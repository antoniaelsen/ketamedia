import React from "react"
import { Z_OFFSET } from "../../../../constants";
import { Arc } from '../../../../Shapes/Arc';
import { SemiCircle } from '../../../../Shapes/SemiCircle';
import { TriangleTilingColors } from "../../types";

interface TrianglePatternArcCornersProps {
  arc_width: number;
  colors: TriangleTilingColors;
  n_shapes: number;
  scale: number;
}

export const TrianglePatternArcCorners = (props: TrianglePatternArcCornersProps) => {
  const { arc_width, scale, n_shapes = 1, colors } = props;

  const height = Math.sqrt(3) / 2 * scale;
  const d = Math.sqrt(3) / 3 * scale;
  const divis = (n_shapes + 2) * 2  - 1;
  const spacing = 1 / divis * scale;

  return (
    <group>
      {/* Stroke */}
      <group position={[0, 0, Z_OFFSET]}>
        <Arc start={0} length={Math.PI / 3} color={colors.stroke} radius={spacing} position={[-scale / 2, d - height, 0]}  width={arc_width} />
        <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={spacing} position={[0, d, 0]} width={arc_width} />
        <Arc start={2 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={spacing} position={[scale / 2, d - height, 0]} width={arc_width} />
      </group>

      {/* Fill */}
      <SemiCircle start={0} length={Math.PI / 3} color={colors.primary} radius={spacing} position={[-scale / 2, d - height, 0]}/>
      <SemiCircle start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.primary} radius={spacing} position={[0, d, 0]}/>
      <SemiCircle start={2 * Math.PI / 3} length={Math.PI / 3} color={colors.primary} radius={spacing} position={[scale / 2, d - height, 0]}/>
    </group>
  );
};
