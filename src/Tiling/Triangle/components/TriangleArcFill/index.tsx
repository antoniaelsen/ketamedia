import React, { useMemo } from 'react';
import { GroupProps } from '@react-three/fiber';
import * as THREE from "three";
import { sign } from 'crypto';


const DEBUG = true;
const CURVE_THETA_SEGMENTS = 32;

interface TriangleArcFillProps extends GroupProps {
  color: string | THREE.Color;
  n_shapes: number;
  radius?: number;
  scale?: number;
  mask?: number[]; // Shape gaps to remain empty (0) or fill (1)
}

export const TriangleArcFill = (props: TriangleArcFillProps) => {
  const {
    color,
    n_shapes = 1,
    radius = 0.5,
    scale = 1,
    mask,
    ...etc
  }  = props;

  const shapes = useMemo(() => {
    // if (!mask || mask.length != n_shapes - 1) mask = new Array(n_shapes - 1).fill(1);
    const height = Math.sqrt(3) / 2 * scale;
    const d = Math.sqrt(3) / 3 * scale;
    const r = height - d;
    const divis = (n_shapes + 2) * 2  - 1;
    const spacing = 1 / divis * scale;

    if (DEBUG) {
      const shapes = [];
      let ul: any[] = [];
      let ur: any[] = [];
      let arcs: any[] = [];
      arcs.push(
        new THREE.EllipseCurve(
          0,  d,
          spacing * 2, spacing * 2,
          0, Math.PI / 3,
          false,
          4 * Math.PI / 3
        ).getPoints(CURVE_THETA_SEGMENTS)
      )
  
      Array.from(new Array(n_shapes - 1)).forEach((_, i) => {
        const masked = mask ? mask[i] : 1;
        const x_start = 2 * (i + 1) * spacing * Math.cos(Math.PI / 3);
        const y_start = 2 * (i + 1) * spacing * Math.sin(Math.PI / 3);

        const x_mid = (2 * (i + 1) + 1) *  spacing * Math.cos(Math.PI / 3);
        const y_mid = (2 * (i + 1) + 1) * spacing * Math.sin(Math.PI / 3);

        // const x_end = (2 * (i + 1) + 2) *  spacing * Math.cos(Math.PI / 3);
        // const y_end = (2 * (i + 1) + 2) * spacing * Math.sin(Math.PI / 3);

        // Upper Left - start of solid
        ul.push(new THREE.Vector2(
          -x_start,
          d - y_start,
        ));
        // Upper Right - start of solid
        ur.push(new THREE.Vector2(
          x_start,
          d - y_start,
        ));
        
        // Upper Left - end of solid
        ul.push(new THREE.Vector2(
          -x_mid,
          d - y_mid,
        ));
        // Upper Right - end of solid
        ur.push(new THREE.Vector2(
          x_mid,
          d - y_mid,
        ));

        if (!masked) {
          console.log("Empty", i, masked)
          arcs.push(
            new THREE.EllipseCurve(
              0,  d,
              spacing * (i * 2 + 2), spacing * (i * 2 + 2),
              0, Math.PI / 3,
              false,
              4 * Math.PI / 3
            ).getPoints(CURVE_THETA_SEGMENTS)
          )
          
          shapes.push(new THREE.Shape([
            ...arcs.pop(),
            ...ur,
            ...arcs.pop().reverse(),            
            ...ul.reverse(),
          ]));

          arcs.push(
            new THREE.EllipseCurve(
              0,  d,
              spacing * (i * 2 + 3), spacing * (i * 2 + 3),
              0, Math.PI / 3,
              false,
              4 * Math.PI / 3
            ).getPoints(CURVE_THETA_SEGMENTS)
          );

        } else {
          console.log("Filling", i, masked)
          const dot_spacing = spacing * (2 * (i + 1) + 1.5);
          const dot_spacing_x = dot_spacing * Math.cos(Math.PI / 3);
          const dot_spacing_y = dot_spacing * Math.sin(Math.PI / 3);
          const x = dot_spacing_x
          const y = d - dot_spacing_y;

          ul = [
            ...ul,
            ...new THREE.EllipseCurve(
              -x,  y,
              spacing / 2, spacing / 2,
              0, Math.PI,
              false,
              4 * Math.PI / 3
            ).getPoints(CURVE_THETA_SEGMENTS).reverse()
          ];
          
          ur = [
            ...ur,
            ...new THREE.EllipseCurve(
              x,  y,
              spacing / 2, spacing / 2,
              0, Math.PI,
              false,
              2 * Math.PI / 3
            ).getPoints(CURVE_THETA_SEGMENTS).reverse()
          ];
        }
      });

      const b_points = n_shapes < 2 ? [] :  Array.from(new Array(n_shapes - 1)).map((_, i) => {
        const dot_spacing = spacing * (2 * (i + 1) + 1.5);
        const x = scale / 2 - dot_spacing;
        const y = -r;

        return new THREE.EllipseCurve(
          x,  y,
          spacing / 2, spacing / 2,
          0, Math.PI,
          false,
          0
        ).getPoints(CURVE_THETA_SEGMENTS);
      });
      
      shapes.push(new THREE.Shape([
        ...(arcs.length > 0 ? arcs.pop() : []),
        ...ur,
        ...b_points,            
        ...ul.reverse(),
      ]));
      return shapes;
    }


    // // Upper left side, from the top down
    // const ul_points = n_shapes < 2 ? [] : Array.from(new Array(n_shapes - 1)).map((_, i) => {
    //   const dot_spacing = spacing * (2 * (i + 1) + 1.5);
    //   const dot_spacing_x = dot_spacing * Math.cos(Math.PI / 3);
    //   const dot_spacing_y = dot_spacing * Math.sin(Math.PI / 3);
    //   const x = -dot_spacing_x
    //   const y = d - dot_spacing_y;
    //   return new THREE.EllipseCurve(
    //     x,  y,
    //     spacing / 2, spacing / 2,
    //     0, Math.PI,
    //     false,
    //     4 * Math.PI / 3
    //   ).getPoints(CURVE_THETA_SEGMENTS);
    // });

    // // Upper right side, from the top down
    // const ur_points = n_shapes < 2 ? [] : Array.from(new Array(n_shapes - 1)).map((_, i) => {
    //   const dot_spacing = spacing * (2 * (i + 1) + 1.5);
    //   const dot_spacing_x = dot_spacing * Math.cos(Math.PI / 3);
    //   const dot_spacing_y = dot_spacing * Math.sin(Math.PI / 3);
    //   const x = dot_spacing_x;
    //   const y = height - dot_spacing_y - r;
    //   return new THREE.EllipseCurve(
    //     x,  y,
    //     spacing / 2, spacing / 2,
    //     0, Math.PI,
    //     false,
    //     2 * Math.PI / 3
    //   ).getPoints(CURVE_THETA_SEGMENTS);
    // });

    // // Bottom points
    // const b_points = n_shapes < 2 ? [] :  Array.from(new Array(n_shapes - 1)).map((_, i) => {
    //   const dot_spacing = spacing * (2 * (i + 1) + 1.5);
    //   const x = scale - dot_spacing - scale / 2;
    //   const y = -r;

    //   return new THREE.EllipseCurve(
    //     x,  y,
    //     spacing / 2, spacing / 2,
    //     0, Math.PI,
    //     false,
    //     0
    //   ).getPoints(CURVE_THETA_SEGMENTS);
    // });


    // const shape = new THREE.Shape([
    //   // Left corner
    //   ...(new THREE.EllipseCurve(
    //     -scale / 2,  d - height,
    //     radius, radius,
    //     0, 1 * Math.PI / 3,
    //     false,
    //     0
    //   ).getPoints(CURVE_THETA_SEGMENTS)),

    //   //  Upper left
    //   ...ul_points.flat(),

    //   // Top corner
    //   ...(new THREE.EllipseCurve(
    //     0,  d,
    //     radius, radius,
    //     0, 1 * Math.PI / 3,
    //     false,
    //     -2 * Math.PI / 3
    //   ).getPoints(CURVE_THETA_SEGMENTS)),

    //   // Upper right
    //   ...ur_points.flat(),
  
    //   // Right corner
    //   ...(new THREE.EllipseCurve(
    //     scale / 2,  d - height,
    //     radius, radius,
    //     0, 1 * Math.PI / 3,
    //     false,
    //     -4 * Math.PI / 3
    //   ).getPoints(CURVE_THETA_SEGMENTS)),

    //   // Bottom
    //   ...b_points.flat(),
    // ]);
    // return shape;
  }, [mask, n_shapes, radius, scale]);


  return (
    <group {...etc} >
      {shapes.map((shape) => (
        <mesh>
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial
            attach="material"
            color={color}
            wireframe={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
