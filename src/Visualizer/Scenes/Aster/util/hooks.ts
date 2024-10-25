import { useCallback, useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3 } from "three";

import { toDegrees } from "util/coordinates";
import { useAutoOrbit } from "util/hooks/use-auto-orbit";
import { requestLocation } from "util/location";
import { useAsterStore, useCamera } from "../store";
import { gpsToCelestial } from "../util/celestial";

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

export const useTravelling = () => {
  const { camera, controls } = useControlledCamera();
  const { traveling, traveling_speed } = useAsterStore((s) => ({
    traveling: s.traveling,
    traveling_speed: s.traveling_speed,
    setVariable: s.setVariable,
  }));

  const curve = useMemo(() => {
    const max = 250;
    const start = camera?.position.clone() ?? new Vector3(0, 0, 0);
    const points = Array.from({ length: 10 }, () => {
      return new Vector3(
        -max + Math.random() * max * 2,
        -max + Math.random() * max * 2,
        -max + Math.random() * max * 2
      );
    });
    return new CatmullRomCurve3([start, ...points, start], true);
  }, [camera]);

  useEffect(() => {
    if (!traveling || !camera || !controls) return;

    let animationFrameId: number;
    let t = 0;

    const animate = () => {
      t += 0.00001 * traveling_speed;
      if (t > 1) t = 0;

      const position = curve.getPoint(t);
      camera.position.copy(position);

      const tangent = curve.getTangent(t);
      const lookAtPoint = position.clone().add(tangent);
      camera.lookAt(lookAtPoint);

      controls.target.copy(lookAtPoint);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      controls.enabled = true;
    };
  }, [traveling, traveling_speed, camera, controls, curve]);

  return { curve };
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

      // Set camera position to origin
      camera.position.set(0, 0, 0);

      camera.up.set(0, 0, 1); // Set z as up
      camera.lookAt(lookAtPosition);

      controls.target.copy(lookAtPosition);

      controls.update();

      setVariable("orbiting", false);
    } catch (error) {
      console.error("Error getting location", error);
    }
  }, [camera, controls, setVariable]);
};
