import { Object3DNode, extend, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { shallow } from "zustand/shallow";

import SHADER_FRAGMENT from "../shaders/boid.frag";
import SHADER_VERTEX from "../shaders/boid.vert";
import { useFlockingStore } from "../store";
import { BoidGeometry } from "../util/BoidGeometry";
import { useGPUBoidEngine } from "../util/useGPUBoidEngine";

extend({ BoidGeometry });
declare module "@react-three/fiber" {
  interface ThreeElements {
    boidGeometry: Object3DNode<BoidGeometry, typeof BoidGeometry>;
  }
}

const WIDTH = 64;

export const Boids = () => {
  const ref = useRef<any>();
  const n_boids = useFlockingStore((state: any) => state.n_boids);

  const {
    alignment_radius,
    cohesion_radius,
    dispersion_enabled,
    dispersion_radius,
    gravity,
    gravity_radius,
    separation_radius,
    max_velocity,
  } = useFlockingStore(
    (s: any) => ({
      alignment_radius: s.alignment_radius,
      cohesion_radius: s.cohesion_radius,
      dispersion_enabled: s.dispersion_enabled,
      dispersion_radius: s.dispersion_radius,
      gravity: s.gravity,
      gravity_radius: s.gravity_radius,
      separation_radius: s.separation_radius,
      max_velocity: s.max_velocity,
    }),
    shallow
  );

  const { gl } = useThree();
  const { gpu, positionVariable, velocityVariable, P, V } = useGPUBoidEngine(
    gl,
    WIDTH
  );

  const uniforms = useMemo(() => {
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
    V["gravity"] = { value: gravity };
    V["gravity_radius"] = { value: gravity_radius };

    V["max_velocity"] = { value: max_velocity };

    material.uniforms["time"].value = now;
    material.uniforms["delta"].value = delta;

    gpu.compute();

    (uniforms["texturePosition"].value as any) =
      gpu.getCurrentRenderTarget(positionVariable).texture;
    (uniforms["textureVelocity"].value as any) =
      gpu.getCurrentRenderTarget(velocityVariable).texture;
  });

  return (
    <mesh ref={ref} matrixAutoUpdate={false} rotation={[0, Math.PI / 2, 0]}>
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
