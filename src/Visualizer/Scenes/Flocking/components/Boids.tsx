import { Sphere } from "@react-three/drei";
import {
  GroupProps,
  Object3DNode,
  extend,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { shallow } from "zustand/shallow";

import useLocalStorage from "util/hooks/use-local-storage";
import SHADER_FRAGMENT from "../shaders/boid.frag";
import SHADER_VERTEX from "../shaders/boid.vert";
import { FlockingState, useFlockingStore } from "../store";
import { BoidGeometry } from "../util/BoidGeometry";
import { useGPUBoidEngine } from "../util/useGPUBoidEngine";
import { CONFIG } from "../config";
import { getIsMobile } from "util/hooks/use-is-mobile";

extend({ BoidGeometry });
declare module "@react-three/fiber" {
  interface ThreeElements {
    boidGeometry: Object3DNode<BoidGeometry, typeof BoidGeometry>;
  }
}

interface BoidUniforms {
  [uniform: string]: THREE.IUniform<any>;
}

const DebugGravity = (props: GroupProps & { radius: number }) => {
  const SCALE_GRAVITY_SPHERE: [number, number, number] = [10, 10, 10];
  const { position, radius, ...rest } = props;

  return (
    <group position={position} {...rest}>
      <Sphere scale={SCALE_GRAVITY_SPHERE}>
        <meshStandardMaterial color="black" />
      </Sphere>
      <Sphere scale={[radius, radius, radius]}>
        <meshStandardMaterial color="white" opacity={0.1} transparent={true} />
      </Sphere>
    </group>
  );
};

const rate = (min: number, max: number) => {
  const range = max - min;
  const x = 10;
  const y = 100;
  return ((Math.random() * range) / x + range / y) * (Math.random() * 2 - 1);
};

const useSweepBoidParameters = () => {
  const intervalId = useRef<number | null>(null);
  const sweepRates = useRef<Record<string, number | number[]>>({});
  const sweep = useFlockingStore((s) => s.sweep);

  useEffect(() => {
    if (!sweep) return;

    const parameters: (keyof FlockingState)[] = [
      "alignment_radius",
      "cohesion_radius",
      "dispersion_radius",
      "gravity_magnitude",
      "gravity_position",
      "gravity_radius",
      "separation_radius",
      "max_velocity",
    ];

    const newSweepRates: Record<string, number | number[]> = {};
    parameters.forEach((param) => {
      if (CONFIG[param]) {
        const { initial, min, max } = CONFIG[param];
        if (min !== undefined && max !== undefined) {
          if (typeof initial === "object" && Array.isArray(initial)) {
            newSweepRates[param] = (initial as number[]).map((_, i) =>
              rate((min as number[])[i], (max as number[])[i])
            );
            return;
          }
          newSweepRates[param] = rate(min as number, max as number);
        }
      }
    });
    sweepRates.current = newSweepRates;
    const kUpdateIntervalMs = 50.0;
    const kUpdateDelta = kUpdateIntervalMs / 1000.0;

    const sweepNumber = (
      value: number,
      r: number,
      min: number,
      max: number
    ) => {
      const newValue = value + r * kUpdateDelta;
      let newRate = r;

      if (newValue > max || newValue < min) {
        if (Math.random() < 0.5) {
          const r = rate(min, max);
          newRate = r;
        } else {
          newRate = -r;
        }
      }

      return [newValue, newRate];
    };

    const sweepArray = (
      value: number[],
      r: number[],
      min: number[],
      max: number[]
    ) => {
      const newRates = r;

      const newValues = value.map((v, i) => {
        const ir = r[i];
        const imin = min[i];
        const imax = max[i];
        const newValue = v + ir * kUpdateDelta;

        if (newValue > imax || newValue < imin) {
          if (Math.random() < 0.5) {
            const ir = rate(imin, imax);
            newRates[i] = ir;
          } else {
            newRates[i] = -r[i];
          }
        }

        return newValue;
      });

      return [newValues, newRates];
    };

    intervalId.current = setInterval(() => {
      parameters.forEach((param) => {
        if (sweepRates.current[param]) {
          const currentValue = useFlockingStore.getState()[param];
          const { min, max } = CONFIG[param];
          let newValue: number | number[] | undefined;

          if (typeof currentValue === "number") {
            [newValue, sweepRates.current[param]] = sweepNumber(
              currentValue,
              sweepRates.current[param] as number,
              min as number,
              max as number
            );
          } else if (Array.isArray(currentValue)) {
            [newValue, sweepRates.current[param]] = sweepArray(
              currentValue,
              sweepRates.current[param] as number[],
              min as number[],
              max as number[]
            );
          }

          useFlockingStore.setState({ [param]: newValue });
        }
      });
    }, 50);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [sweep]);
};

export const Boids = () => {
  const ref = useRef<THREE.Mesh>(null);
  const n_boids = useFlockingStore((state) => state.n_boids);
  const [debug] = useLocalStorage("ketamedia_debug", false);
  useSweepBoidParameters();

  const {
    alignment_radius,
    cohesion_radius,
    dispersion_enabled,
    dispersion_radius,
    gravity_magnitude,
    gravity_position,
    gravity_radius,
    separation_radius,
    max_velocity,
    fpv_camera,
  } = useFlockingStore(
    (s: any) => ({
      alignment_radius: s.alignment_radius,
      cohesion_radius: s.cohesion_radius,
      dispersion_enabled: s.dispersion_enabled,
      dispersion_radius: s.dispersion_radius,
      gravity_position: s.gravity_position,
      gravity_magnitude: s.gravity_magnitude,
      gravity_radius: s.gravity_radius,
      separation_radius: s.separation_radius,
      max_velocity: s.max_velocity,
      fpv_camera: s.fpv_camera,
    }),
    shallow
  );

  const WIDTH = getIsMobile() ? 64 : 128;
  const { gl } = useThree();
  const { gpu, positionVariable, velocityVariable, P, V } = useGPUBoidEngine(
    gl,
    WIDTH
  );

  const uniforms = useMemo((): BoidUniforms => {
    return {
      color: { value: new THREE.Color(0xff2200) },
      texturePosition: { value: null },
      textureVelocity: { value: null },
      time: { value: 1.0 },
      delta: { value: 0.0 },
    };
  }, []);

  useFrame((state, delta) => {
    const { pointer } = state;
    const now = performance.now();

    if (delta > 1) delta = 1;
    if (!ref.current) return;

    const material = ref.current.material as THREE.ShaderMaterial;
    const dispersion = new THREE.Vector3(pointer.x, pointer.y, 0);

    P["time"].value = now;
    P["delta"].value = delta;

    V["time"].value = now;
    V["delta"].value = delta;

    V["alignment_radius"] = { value: alignment_radius };
    V["cohesion_radius"] = { value: cohesion_radius };
    V["dispersion_enabled"] = { value: dispersion_enabled };
    V["dispersion_position"] = { value: dispersion };
    V["dispersion_radius"] = { value: dispersion_radius };
    V["separation_radius"] = { value: separation_radius };
    V["gravity_magnitude"] = { value: gravity_magnitude };
    V["gravity_position"] = { value: gravity_position };
    V["gravity_radius"] = { value: gravity_radius };

    V["max_velocity"] = { value: max_velocity };

    material.uniforms["time"].value = now;
    material.uniforms["delta"].value = delta;

    gpu.compute();

    uniforms["texturePosition"].value =
      gpu.getCurrentRenderTarget(positionVariable).texture;
    uniforms["textureVelocity"].value =
      gpu.getCurrentRenderTarget(velocityVariable).texture;

    if (!fpv_camera) return;

    // Set camera to position and orientation of boid 0

    // Read position of boid 0 (first texel)
    const positionData = new Float32Array(4);
    state.gl.readRenderTargetPixels(
      gpu.getCurrentRenderTarget(positionVariable),
      0,
      0,
      1,
      1,
      positionData
    );

    // Read velocity of boid 0 (first texel)
    const velocityData = new Float32Array(4);
    state.gl.readRenderTargetPixels(
      gpu.getCurrentRenderTarget(velocityVariable),
      0,
      0,
      1,
      1,
      velocityData
    );

    const boidPosition = new THREE.Vector3(
      positionData[0],
      positionData[1],
      positionData[2]
    );
    const boidVelocity = new THREE.Vector3(
      velocityData[0],
      velocityData[1],
      velocityData[2]
    );

    // position camera behind void's posiiton (based on boid velocity)
    const cameraPosition = boidPosition
      .clone()
      .sub(boidVelocity.clone().setLength(100));

    state.camera.position.copy(cameraPosition);
    state.camera.lookAt(boidPosition.clone());
  });

  return (
    <mesh
      ref={ref}
      matrixAutoUpdate={false}
      rotation={[0, Math.PI / 2, 0]}
      frustumCulled={false}
    >
      {debug && (
        <DebugGravity position={gravity_position} radius={gravity_radius} />
      )}

      <boidGeometry args={[n_boids, WIDTH]} />
      <shaderMaterial
        fragmentShader={SHADER_FRAGMENT}
        vertexShader={SHADER_VERTEX}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
