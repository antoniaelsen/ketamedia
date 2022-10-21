import React, { useMemo } from 'react';
import { GroupProps } from '@react-three/fiber';
import * as THREE from "three";


const CURVE_THETA_SEGMENTS = 32;

interface SemiCircleProps extends GroupProps {
  color: string | THREE.Color;
  length?: number;
  start?: number;
  radius?: number;
  rotation_ellipse?: number;
}

export const SemiCircle = (props: SemiCircleProps) => {
  const {
    color,
    radius = 0.5,
    start = 0,
    length = Math.PI,
    rotation_ellipse = 0,
    ...etc
  }  = props;

  const shape = useMemo(() => {
    const shape = new THREE.Shape([
      new THREE.Vector2(0, 0),
      ...(new THREE.EllipseCurve(
        0,  0,
        radius, radius,
        start, start + length,
        false,
        rotation_ellipse
      ).getPoints(CURVE_THETA_SEGMENTS))
    ]);
    return shape
  }, [length, radius, rotation_ellipse, start]);

  return (
    <group {...etc} >
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial
          attach="material"
          opacity={0.5}
          color={color}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
