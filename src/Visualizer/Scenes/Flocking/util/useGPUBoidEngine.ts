import { useMemo } from "react";
import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

import SHADER_POSITION from "../shaders/boid_position.frag";
import SHADER_VELOCITY from "../shaders/boid_velocity.frag";
import { CONFIG } from "../config";

const BOUNDS = 800;
const BOUNDS_HALF = BOUNDS / 2;

function fillPositionTexture(texture: THREE.DataTexture) {
  const theArray = texture.image.data;

  for (let k = 0, kl = theArray.length; k < kl; k += 4) {
    const x = Math.random() * BOUNDS - BOUNDS_HALF;
    const y = Math.random() * BOUNDS - BOUNDS_HALF;
    const z = Math.random() * BOUNDS - BOUNDS_HALF;

    theArray[k + 0] = x;
    theArray[k + 1] = y;
    theArray[k + 2] = z;
    theArray[k + 3] = 1;
  }
}

function fillVelocityTexture(texture: THREE.DataTexture) {
  const theArray = texture.image.data;

  for (let k = 0, kl = theArray.length; k < kl; k += 4) {
    const x = Math.random() - 0.5;
    const y = Math.random() - 0.5;
    const z = Math.random() - 0.5;

    theArray[k + 0] = x * 10;
    theArray[k + 1] = y * 10;
    theArray[k + 2] = z * 10;
    theArray[k + 3] = 1;
  }
}

export const useGPUBoidEngine = (gl: any, textureWidth: number) => {
  return useMemo(() => {
    const gpu = new GPUComputationRenderer(textureWidth, textureWidth, gl);

    if (gl.capabilities.isWebGL2 === false) {
      gpu.setDataType(THREE.HalfFloatType);
    }

    const dtPosition = gpu.createTexture();
    const dtVelocity = gpu.createTexture();
    fillPositionTexture(dtPosition);
    fillVelocityTexture(dtVelocity);

    const velocityVariable = gpu.addVariable(
      "textureVelocity",
      SHADER_VELOCITY,
      dtVelocity
    );
    const positionVariable = gpu.addVariable(
      "texturePosition",
      SHADER_POSITION,
      dtPosition
    );

    gpu.setVariableDependencies(velocityVariable, [
      positionVariable,
      velocityVariable,
    ]);
    gpu.setVariableDependencies(positionVariable, [
      positionVariable,
      velocityVariable,
    ]);

    const P = positionVariable.material.uniforms;
    const V = velocityVariable.material.uniforms;

    P["time"] = { value: 0.0 };
    P["delta"] = { value: 0.0 };
    V["time"] = { value: 1.0 };
    V["delta"] = { value: 0.0 };

    V["alignment"] = { value: 1.0 };
    V["alignment_radius"] = { value: CONFIG.alignment_radius.initial };

    V["cohesion"] = { value: 1.0 };
    V["cohesion_radius"] = { value: CONFIG.cohesion_radius.initial };

    V["dispersion_enabled"] = { value: false };
    V["dispersion_position"] = { value: new THREE.Vector3(0, 0, 0) };
    V["dispersion_radius"] = { value: CONFIG.dispersion_radius.initial };

    V["separation"] = { value: 1.0 };
    V["separation_radius"] = { value: CONFIG.separation_radius.initial };

    V["max_velocity"] = { value: CONFIG.max_velocity.initial };

    V["gravity_magnitude"] = { value: CONFIG.gravity_magnitude.initial };
    V["gravity_position"] = { value: CONFIG.gravity_position.initial };
    V["gravity_radius"] = { value: CONFIG.gravity_radius.initial };

    velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(2);
    velocityVariable.wrapS = THREE.RepeatWrapping;
    velocityVariable.wrapT = THREE.RepeatWrapping;
    positionVariable.wrapS = THREE.RepeatWrapping;
    positionVariable.wrapT = THREE.RepeatWrapping;

    const error = gpu.init();
    if (error !== null) {
      console.error(error);
    }

    return {
      gpu,
      positionVariable,
      velocityVariable,
      P,
      V,
    };
  }, [gl]);
};
