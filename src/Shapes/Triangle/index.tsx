import React, { useMemo } from 'react';
import { Line, Sphere } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import * as THREE from "three";


const DEBUG = false;
const Z_OFFSET = 0.001;

interface TriangleProps extends GroupProps {
  color: string | THREE.Color,
  scale?: number;
  position?: THREE.Vector3 | [x: number, y: number, z: number];
  wireframe?: boolean;
}

export const Triangle = (props: TriangleProps) => {
  const {
    color,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    wireframe,
    ...etc
  }  = props;
  const height = Math.sqrt(3) / 2 * scale;
  const d = Math.sqrt(3) / 3 * scale;

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.lineTo(scale / 2, height);
    shape.lineTo(scale, 0);
    return shape
  }, [height, scale]);

  return (
    <group position={position} {...etc} >

      {/* Triangle */}
      <group rotation={rotation}>

        {/* Inner triangle */}
        <group position={[-scale / 2, - height + d, 0]}>
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

          {wireframe && (
            <Line
              points={[
                [0, 0, 0],
                [scale / 2, height, 0],
                [scale, 0, 0],
                [0, 0, 0],
              ]}
              color="#000"
              lineWidth={1}
            />
          )}
          {DEBUG && (
            <>
              {/* Center */}
              <Sphere scale={0.05} position={[scale / 2, height - d, Z_OFFSET]}>
                <meshBasicMaterial color="hotpink" />
              </Sphere>

              {/* Vertices */}
              <group>
                <Sphere scale={0.025} position={[0, 0, 0]}>
                  <meshBasicMaterial color="green" />
                </Sphere>
                <Sphere scale={0.025} position={[scale / 2, height, 0]}>
                  <meshBasicMaterial color="green" />
                </Sphere>
                <Sphere scale={0.025} position={[scale, 0, 0]}>
                  <meshBasicMaterial color="green" />
                </Sphere>
              </group>
            </>
          )}
        </group>
      </group>
    </group>
  );
}
