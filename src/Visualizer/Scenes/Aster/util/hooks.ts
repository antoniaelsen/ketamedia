import { useCallback, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Camera, CatmullRomCurve3, Euler, Vector3 } from "three";

import { toDegrees } from "util/coordinates";
import { useAutoOrbit } from "util/hooks/use-auto-orbit";
import { requestLocation } from "util/location";
import { useAsterStore, useCamera } from "../store";
import { gpsToCelestial } from "../util/celestial";
import { OrbitControls } from "three-stdlib";

const setCameraTarget = (
  camera: Camera,
  controls: OrbitControls,
  position: Vector3,
  target: Vector3
) => {
  camera.position.copy(position);
  camera.lookAt(target);

  controls.target.copy(target);
  controls.update();
};

export const useAutoOrbitAster = () => {
  const { orbiting, orbitLock, orbitWaitMs, setOrbiting, setOrbitLock } =
    useAsterStore((s) => ({
      orbiting: s.orbiting,
      orbitLock: s.orbit_lock,
      orbitWaitMs: s.orbit_wait_ms,
      setOrbiting: (orbiting: boolean) => {
        if (s.orbit_lock) {
          return;
        }
        s.setVariable("orbiting", orbiting);
      },
      setOrbitLock: (orbitLock: boolean) =>
        s.setVariable("orbit_lock", orbitLock),
    }));

  const controlsRef = useAutoOrbit({
    orbiting,
    orbitLock,
    waitMs: orbitWaitMs,
    setOrbiting,
    setOrbitLock,
  });
  const { camera, setCamera } = useCamera();

  useThree((s) => {
    // ugh
    if (
      camera != s.camera &&
      s.controls != controlsRef.current &&
      !!controlsRef.current
    ) {
      setCamera(s.camera, controlsRef.current);
    }
  });

  useEffect(() => {
    const controls = controlsRef.current;
    if (orbiting && camera && controls) {
      const origin = new Vector3(0, 0, 0);
      camera.lookAt(origin);
      controls.target.copy(origin);
    }
  }, [orbiting, camera, controlsRef.current]);

  return controlsRef;
};

export const useControlledCamera = () => {
  const state = useAsterStore((s) => s);
  const { camera, controls } = state;
  return { camera, controls };
};

const generateTravelingCurve = (
  currentPosition: Vector3,
  currentRotation: Euler
) => {
  const nPoints = 64;
  const max = 250;
  const start = currentPosition.clone();
  const direction = new Vector3(0, 0, -1).applyEuler(currentRotation);
  const next = start
    .clone()
    .add(direction.multiplyScalar(Math.random() * 10 + 25));
  const points = [
    start,
    next,
    ...Array.from({ length: nPoints - 2 }, () => {
      return new Vector3(
        -max + Math.random() * max * 2,
        -max + Math.random() * max * 2,
        -max + Math.random() * max * 2
      );
    }),
    start,
  ];
  return new CatmullRomCurve3(points, true, "chordal", 0.05);
};
export const useTraveling = () => {
  const { camera, controls } = useControlledCamera();
  const { traveling, traveling_speed, setVariable } = useAsterStore((s) => ({
    traveling: s.traveling,
    traveling_speed: s.traveling_speed,
    setVariable: s.setVariable,
  }));

  const curve = useRef<CatmullRomCurve3 | null>(null);
  const progress = useRef<number>(0);
  const lastTime = useRef<number | null>(null);

  useEffect(() => {
    if (!traveling || !camera || !controls) return;
    setVariable("orbiting", false);

    curve.current = generateTravelingCurve(camera.position, camera.rotation);
    const totalLength = curve.current.getLength();
    progress.current = 0;

    let animationFrameId: number;

    const animate = (time: number) => {
      if (!curve.current) return;

      const speed = traveling_speed * 0.1;
      const delta = time - (lastTime.current || time);
      lastTime.current = time;

      progress.current += (speed * delta) / 1000;
      if (progress.current > totalLength) progress.current = 0;

      const ahead = (progress.current + speed * 0.1) % totalLength;

      const basePoint = curve.current.getUtoTmapping(0, progress.current);
      const lookAtPoint = curve.current.getUtoTmapping(0, ahead);

      const currentPosition = curve.current.getPoint(basePoint);
      const targetPosition = curve.current.getPoint(lookAtPoint);

      camera.position.copy(currentPosition);
      camera.lookAt(targetPosition);

      controls.target.copy(targetPosition);
      controls.update();

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      controls.enabled = true;
      lastTime.current = null;
      progress.current = 0;
    };
  }, [traveling, traveling_speed, camera, controls, setVariable]);

  return { curve };
};

export const useOnSol = () => {
  const { setVariable } = useAsterStore((s) => ({
    setVariable: s.setVariable,
  }));
  const { camera, controls } = useControlledCamera();

  return useCallback(async () => {
    if (!camera || !controls) {
      return;
    }

    setVariable("orbiting", false);
    setVariable("traveling", false);

    setCameraTarget(camera, controls, new Vector3(-1, 0, 0), new Vector3());
  }, [camera, controls, setVariable]);
};

export const useOnZenith = () => {
  const { setVariable } = useAsterStore((s) => ({
    setVariable: s.setVariable,
  }));
  const { camera, controls } = useControlledCamera();

  return useCallback(async () => {
    if (!camera || !controls) {
      return;
    }

    try {
      const position = await requestLocation();

      setVariable("orbiting", false);
      setVariable("traveling", false);

      const { latitude, longitude } = position.coords;
      const { ra, dec } = gpsToCelestial(latitude, longitude);
      console.log(
        `Current celestial coordinates: (ra: ${toDegrees(ra)}, dec: ${toDegrees(
          dec
        )})`
      );

      const radius = 1; // Unit sphere
      const x = radius * Math.cos(dec) * Math.cos(ra);
      const y = radius * Math.cos(dec) * Math.sin(ra);
      const z = radius * Math.sin(dec);
      const lookAtPosition = new Vector3(x, y, z);

      camera.up.set(0, 0, 1);
      setCameraTarget(camera, controls, new Vector3(), lookAtPosition);
    } catch (error) {
      console.error("Error getting location", error);
    }
  }, [camera, controls, setVariable]);
};
