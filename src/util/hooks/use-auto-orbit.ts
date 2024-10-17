import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";

interface OrbitConfig {
  speed: number;
}

const kDefaultOrbitConfig: OrbitConfig = {
  speed: 0.1,
};

export const useAutoOrbit = (
  waitMs: number = 25 * 1000,
  config: OrbitConfig = kDefaultOrbitConfig
) => {
  const timer = useRef(0);
  const start = useRef(Date.now());
  const orbiting = useRef(false);
  const orbitOff = useRef(false);
  const controls = useRef<any | null>(null);

  const { speed } = config;

  const reset = useCallback(() => {
    start.current = Date.now();
    orbiting.current = false;

    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (orbitOff.current) {
      return;
    }

    timer.current = setTimeout(() => {
      orbiting.current = true;
    }, waitMs);
  }, [waitMs]);

  const toggle = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "o") {
        orbiting.current = !orbiting.current;
        if (!orbiting.current) {
          timer.current = setTimeout(() => {
            orbiting.current = true;
          }, waitMs);
        }
      } else if (e.key === "O") {
        orbitOff.current = !orbitOff.current;
        if (orbitOff.current) {
          orbiting.current = false;
        } else {
          timer.current = setTimeout(() => {
            orbiting.current = true;
          }, waitMs);
        }
      }
    },
    [waitMs]
  );

  useEffect(() => {
    const canvas = document.getElementById("visualizer");
    if (!canvas) {
      return;
    }
    timer.current = setTimeout(() => {
      orbiting.current = true;
    }, waitMs);

    window.addEventListener("keydown", toggle);
    canvas.addEventListener("pointerdown", reset);
    canvas.addEventListener("touchmove", reset);
    canvas.addEventListener("wheel", reset);

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

  useFrame((state) => {
    const camera = state.camera;
    if (!orbiting.current || !camera || !controls.current) {
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
