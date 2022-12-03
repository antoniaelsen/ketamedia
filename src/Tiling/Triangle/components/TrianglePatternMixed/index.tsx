import React from "react"
import { Z_OFFSET } from "../../../../constants";
import { Arc } from '../../../../Shapes/Arc';
import { SemiCircle } from '../../../../Shapes/SemiCircle';
import { TriangleTilingColors } from "../../types";
import { TrianglePatternArcCorners } from '../TrianglePatternArcCorners';


export interface TrianglePatternMixedProps {
  arc_width: number;
  scale: number;
  n_shapes: number;
  colors: TriangleTilingColors;
  options: { mask: number[] };
}

export const TrianglePatternMixed = (props: TrianglePatternMixedProps) => {
  const { arc_width, scale, n_shapes = 1, colors, options } = props;
  const { mask } = options;
  const height = Math.sqrt(3) / 2 * scale;
  const d = Math.sqrt(3) / 3 * scale;
  const r = height - d;
  const divis = (n_shapes + 2) * 2  - 1;
  const spacing = 1 / divis * scale;

  return (
    <group position={[0, 0, Z_OFFSET]}>
      <TrianglePatternArcCorners arc_width={arc_width} scale={scale} n_shapes={n_shapes} colors={colors} />

      {mask.map(() => 1).map((m, i) => {
        // if (spacing * (2 * i + 3) > height - arc_width) m = 0;
        const dot_spacing = spacing * (2 * (i + 1) + 0.5);
        const dot_spacing_x = dot_spacing * Math.cos(Math.PI / 3);
        const dot_spacing_y = dot_spacing * Math.sin(Math.PI / 3);
        const x_ur = dot_spacing_x;
        const y_ur = d - dot_spacing_y;
        const x_ul = -dot_spacing_x;
        const y_ul = d - dot_spacing_y;
        return (
          <>
            {/* Curve */}
            {(m > 0) && (
              <group key={`curve-${i}`}>
                {/* Stroke */}
                <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={spacing * (2 * i + 2)} position={[0, d, Z_OFFSET]}  width={arc_width} />
                <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={spacing * (2 * i + 3)} position={[0, d, Z_OFFSET]}  width={arc_width} />
  
                {/* Fill */}
                <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.primary} radius={spacing * (2 * i + 2.5)} position={[0, d, 0]} width={spacing} />
              </group >
            )}

            {/* SemiCircle */}
            {(m === 0) && (
              <group key={`semicircle-${i}`}>
                {/* Upper Right */}
                <Arc start={4 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_ul, y_ul, Z_OFFSET]}  width={arc_width}/>
                <SemiCircle start={0 * Math.PI / 3} length={Math.PI} color={colors.primary} radius={spacing / 2} position={[x_ul, y_ul, 0]} rotation_ellipse={4 * Math.PI / 3}/>

                {/* Upper Left */}
                <Arc start={2 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_ur, y_ur, Z_OFFSET]} width={arc_width} />
                <SemiCircle start={2 * Math.PI / 3} length={Math.PI} color={colors.primary} radius={spacing / 2} position={[x_ur, y_ur, 0]}/>
              </group>
            )}
          </>
        );
      })}

      {/* Bottom */}
      
      {Array.from(new Array(n_shapes)).map((_, i) => {
        const dot_spacing = spacing * (2 * (i + 1) + 0.5);
        const x_b = dot_spacing - scale / 2;
        const y_b = -r;
        return (
          <>
            <Arc start={0 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_b, y_b, Z_OFFSET]} width={arc_width} />
            <SemiCircle start={0 * Math.PI / 3} length={Math.PI} color={colors.primary} radius={spacing / 2} position={[x_b, y_b, 0]}/>
          </>
        );
      })}
    </group>
  );
}