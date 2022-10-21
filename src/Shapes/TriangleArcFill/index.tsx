import React, { useMemo } from 'react';
import { GroupProps } from '@react-three/fiber';
import * as THREE from "three";


const CURVE_THETA_SEGMENTS = 64;

interface TriangleArcFillProps extends GroupProps {
  color: string | THREE.Color;
  radius?: number;
  scale?: number;
}

export const TriangleArcFill = (props: TriangleArcFillProps) => {
  const {
    color,
    radius = 0.5,
    scale = 1,
    ...etc
  }  = props;

  const shape = useMemo(() => {
    const height = Math.sqrt(3) / 2 * scale;
    const d = Math.sqrt(3) / 3 * scale;
    const shape = new THREE.Shape([
      ...(new THREE.EllipseCurve(
        -scale / 2,  d - height,
        radius, radius,
        0, 1 * Math.PI / 3,
        false,
        0
      ).getPoints(CURVE_THETA_SEGMENTS)),
      ...(new THREE.EllipseCurve(
        0,  d,
        radius, radius,
        0, 1 * Math.PI / 3,
        false,
        -2 * Math.PI / 3
      ).getPoints(CURVE_THETA_SEGMENTS)),
      ...(new THREE.EllipseCurve(
        scale / 2,  d - height,
        radius, radius,
        0, 1 * Math.PI / 3,
        false,
        -4 * Math.PI / 3
      ).getPoints(CURVE_THETA_SEGMENTS)),
    ]);
    return shape
  }, [radius, scale]);

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
