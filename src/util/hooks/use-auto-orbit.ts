import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";

interface OrbitConfig {
  speed: number;
}

const kDefaultOrbitConfig: OrbitConfig = {
  speed: 0.1,
};

export const useAutoOrbit = ({
  orbiting,
  orbitLock,
  setOrbiting,
  setOrbitLock,
  waitMs = 25 * 1000,
  config = kDefaultOrbitConfig,
}: {
  orbiting: boolean;
  orbitLock: boolean;
  setOrbiting: (orbiting: boolean) => void;
  setOrbitLock: (orbitLock: boolean) => void;
  waitMs: number;
  config?: OrbitConfig;
}) => {
  const timer = useRef(0);
  const start = useRef(Date.now());
  const controls = useRef<any | null>(null);

  const { speed } = config;

  const reset = useCallback(() => {
    start.current = Date.now();
    setOrbiting(false);

    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (orbitLock) {
      return;
    }

    timer.current = setTimeout(() => {
      setOrbiting(true);
    }, waitMs);
  }, [waitMs]);

  const toggle = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "o") {
        setOrbiting(!orbiting);
        if (!orbiting) {
          timer.current = setTimeout(() => {
            setOrbiting(true);
          }, waitMs);
        }
      } else if (e.key === "O") {
        setOrbitLock(!orbitLock);
        if (orbitLock) {
          setOrbiting(false);
        } else {
          timer.current = setTimeout(() => {
            setOrbiting(true);
          }, waitMs);
        }
      }
    },
    [orbiting, orbitLock, waitMs, setOrbiting, setOrbitLock]
  );

  useEffect(() => {
    const canvas = document.getElementById("visualizer");
    if (!canvas) {
      return;
    }

    window.addEventListener("keydown", toggle);
    canvas.addEventListener("pointerdown", reset);
    canvas.addEventListener("touchmove", reset, { passive: true });
    canvas.addEventListener("wheel", reset, { passive: true });

    return () => {
      window.removeEventListener("keydown", toggle);
      canvas.removeEventListener("pointerdown", reset);
      canvas.removeEventListener("touchmove", reset);
      canvas.removeEventListener("wheel", reset);
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [reset, toggle]);

  useEffect(() => {
    reset();
  }, [orbitLock, reset]);

  useFrame((state) => {
    const camera = state.camera;
    if (!orbiting || !camera || !controls.current) {
      return;
    }
    const time = Date.now() * 0.0001;
    const radius = controls.current.getDistance();

    // slowly orbit in a circle
    const angleX = Math.sin(time * 0.5) * Math.PI * 2 * speed;
    const angleY = Math.cos(time * 0.3) * Math.PI * 2 * speed;

    const x = Math.sin(angleX) * Math.cos(angleY) * radius;
    const y = Math.sin(angleY) * radius;
    const z = Math.cos(angleX) * Math.cos(angleY) * radius;

    camera.position.set(x, y, z);
    camera.lookAt(controls.current.target);
    controls.current.update();
  });

  return controls;
};
