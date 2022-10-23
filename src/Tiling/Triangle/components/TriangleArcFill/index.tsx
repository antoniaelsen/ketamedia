import React, { useMemo } from 'react';
import { GroupProps } from '@react-three/fiber';
import * as THREE from "three";


const CURVE_THETA_SEGMENTS = 32;

interface TriangleArcFillProps extends GroupProps {
  color: string | THREE.Color;
  n_shapes: number;
  radius?: number;
  scale?: number;
}

export const TriangleArcFill = (props: TriangleArcFillProps) => {
  const {
    color,
    n_shapes = 1,
    radius = 0.5,
    scale = 1,
    ...etc
  }  = props;

  const shape = useMemo(() => {
    const height = Math.sqrt(3) / 2 * scale;
    const d = Math.sqrt(3) / 3 * scale;
    const r = height - d;
    const divis = (n_shapes + 2) * 2  - 1;
    const spacing = 1 / divis * scale;

    const ul_points = n_shapes < 2 ? [] : Array.from(new Array(n_shapes - 1)).map((_, i) => {
      const dot_spacing = spacing * (2 * (i + 1) + 1.5);
      const dot_spacing_x = dot_spacing * Math.cos(Math.PI / 3);
      const dot_spacing_y = dot_spacing * Math.sin(Math.PI / 3);
      const x = dot_spacing_x - scale / 2;
      const y = dot_spacing_y - r;
      return new THREE.EllipseCurve(
        x,  y,
        spacing / 2, spacing / 2,
        0, Math.PI,
        false,
        4 * Math.PI / 3
      ).getPoints(CURVE_THETA_SEGMENTS);
    });

    const ur_points = n_shapes < 2 ? [] : Array.from(new Array(n_shapes - 1)).map((_, i) => {
      const dot_spacing = spacing * (2 * (i + 1) + 1.5);
      const dot_spacing_x = dot_spacing * Math.cos(Math.PI / 3);
      const dot_spacing_y = dot_spacing * Math.sin(Math.PI / 3);
      const x = dot_spacing_x;
      const y = height - dot_spacing_y - r;
      return new THREE.EllipseCurve(
        x,  y,
        spacing / 2, spacing / 2,
        0, Math.PI,
        false,
        2 * Math.PI / 3
      ).getPoints(CURVE_THETA_SEGMENTS);
    });

    const b_points = n_shapes < 2 ? [] :  Array.from(new Array(n_shapes - 1)).map((_, i) => {
      const dot_spacing = spacing * (2 * (i + 1) + 1.5);
      const x = scale - dot_spacing - scale / 2;
      const y = -r;

      return new THREE.EllipseCurve(
        x,  y,
        spacing / 2, spacing / 2,
        0, Math.PI,
        false,
        0
      ).getPoints(CURVE_THETA_SEGMENTS);
    });

    const shape = new THREE.Shape([
      // Left corner
      ...(new THREE.EllipseCurve(
        -scale / 2,  d - height,
        radius, radius,
        0, 1 * Math.PI / 3,
        false,
        0
      ).getPoints(CURVE_THETA_SEGMENTS)),

      //  Upper left
      ...ul_points.flat(),

      // Top corner
      ...(new THREE.EllipseCurve(
        0,  d,
        radius, radius,
        0, 1 * Math.PI / 3,
        false,
        -2 * Math.PI / 3
      ).getPoints(CURVE_THETA_SEGMENTS)),

      // Upper right
      ...ur_points.flat(),
  
      // Right corner
      ...(new THREE.EllipseCurve(
        scale / 2,  d - height,
        radius, radius,
        0, 1 * Math.PI / 3,
        false,
        -4 * Math.PI / 3
      ).getPoints(CURVE_THETA_SEGMENTS)),

      // Bottom
      ...b_points.flat(),
    ]);
    return shape
  }, [n_shapes, radius, scale]);

  return (
    <group {...etc} >
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial
          attach="material"
          color={color}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
