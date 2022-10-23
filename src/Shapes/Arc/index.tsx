import React, { useMemo } from 'react'
import * as THREE from "three";


const ARC_THETA_SEGMENTS = 32;
const ARC_PHI_SEGMENTS = 3;

interface ArcProps {
  color: THREE.Color | string,
  start?: number;
  length?: number;
  width?: number;
  radius?: number;
  segmentsTheta?: number;
  segmentsPhi?: number;
  position?: THREE.Vector3 | [x: number, y: number, z: number];
}

export const Arc = (props: ArcProps) => {
  const {
    color,
    length = Math.PI * 2,
    position = [0, 0, 0],
    radius = 0.1,
    segmentsTheta = ARC_THETA_SEGMENTS,
    segmentsPhi = ARC_PHI_SEGMENTS,
    start = 0,
    width = 0.05
  } = props;

  return (
    <mesh position={position}>
      <ringGeometry args={[radius - width / 2, radius + width / 2, segmentsTheta, segmentsPhi, start, length]} />
      <meshBasicMaterial
        attach="material"
        color={color}
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
