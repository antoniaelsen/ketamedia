import React, { useMemo } from 'react';
import { GroupProps } from '@react-three/fiber';
import { Arc } from '../Shapes/Arc';

import { Triangle } from '../Shapes/Triangle';
import { SemiCircle } from '../Shapes/SemiCircle';
import { TriangleArcFill } from '../Shapes/TriangleArcFill';

const ARC_WIDTH = 0.05;
const Z_OFFSET = 0.001;

interface TriangleTilingProps extends GroupProps {
  cols: number;
  rows: number;
  scale?: number;
  z?: number;
}

interface TriangleTilingColors {
  stroke: THREE.Color | string;
  primary: THREE.Color | string;
  secondary: THREE.Color | string;
}

const arcCorners = (scale: number, divis: number = 1/5, colors: TriangleTilingColors) => {
  const height = Math.sqrt(3) / 2 * scale;
  const d = Math.sqrt(3) / 3 * scale;
  const sdivis = divis * scale;

  return (
    <group>
      {/* Stroke */}
      <group position={[0, 0, Z_OFFSET]}>
        <Arc start={0} length={Math.PI / 3} color={colors.stroke} radius={sdivis} position={[-scale / 2, d - height, 0]}  width={ARC_WIDTH} />
        <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={sdivis} position={[0, d, 0]} width={ARC_WIDTH} />
        <Arc start={2 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={sdivis} position={[scale / 2, d - height, 0]} width={ARC_WIDTH} />
      </group>

      {/* Fill */}
      <SemiCircle start={0} length={Math.PI / 3} color={colors.secondary} radius={sdivis} position={[-scale / 2, d - height, 0]}/>
      <SemiCircle start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.secondary} radius={sdivis} position={[0, d, 0]}/>
      <SemiCircle start={2 * Math.PI / 3} length={Math.PI / 3} color={colors.secondary} radius={sdivis} position={[scale / 2, d - height, 0]}/>
    </group>
  );
};

const arcPatterns = [
  (scale: number, divis: number = 1/5, colors: TriangleTilingColors) => {
    const height = Math.sqrt(3) / 2 * scale;
    const d = Math.sqrt(3) / 3 * scale;
    const sdivis = divis * scale;

    return (
      <group position={[0, 0, Z_OFFSET]}>
        {arcCorners(scale, divis, colors)}

        {/* Stroke */}
        <group position={[0, 0, Z_OFFSET]}>
          <Arc start={0} length={Math.PI / 3} color={colors.stroke} radius={2 * sdivis} position={[-scale / 2, d - height, 0]}  width={ARC_WIDTH}/>
          <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={2 * sdivis} position={[0, d, 0]} width={ARC_WIDTH} />
          <Arc start={2 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={2 * sdivis} position={[scale / 2, d - height, 0]} width={ARC_WIDTH} />
        </group>

        {/* Fill */}
        <TriangleArcFill color={colors.secondary} radius={2 * divis * scale} scale={scale}/>
      </group>
    );
  },
  (scale: number, divis: number = 1/5, colors: TriangleTilingColors) => {
    const height = Math.sqrt(3) / 2 * scale;
    const d = Math.sqrt(3) / 3 * scale;
    const sdivis = divis * scale;
  
    return (
      <group position={[0, 0, Z_OFFSET]}>
        {arcCorners(scale, divis, colors)}

        {/* Stroke */}
        <group position={[0, 0, Z_OFFSET]}>
          <Arc start={4 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={sdivis / 2} position={[-scale / 4, d - height / 2, 0]}  width={ARC_WIDTH}/>
          <Arc start={2 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={sdivis / 2} position={[scale / 4, d - height / 2, 0]} width={ARC_WIDTH} />
          <Arc start={0 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={sdivis / 2} position={[0, d - height, 0]} width={ARC_WIDTH} />
        </group>

        {/* Fill */}
        <SemiCircle start={0 * Math.PI / 3} length={Math.PI} color={colors.secondary} radius={sdivis / 2} position={[-scale / 4, d - height / 2, 0]} rotation_ellipse={4 * Math.PI / 3}/>
        <SemiCircle start={2 * Math.PI / 3} length={Math.PI} color={colors.secondary} radius={sdivis / 2} position={[scale / 4, d - height / 2, 0]}/>
        <SemiCircle start={0 * Math.PI / 3} length={Math.PI} color={colors.secondary} radius={sdivis / 2} position={[0, d - height, 0]}/>
      </group>
    );
  },
  (scale: number, divis: number = 1/5, colors: TriangleTilingColors) => {
    const height = Math.sqrt(3) / 2 * scale;
    const d = Math.sqrt(3) / 3 * scale;
    const sdivis = divis * scale;
  
    return (
      <group position={[0, 0, Z_OFFSET]}>
        {arcCorners(scale, divis, colors)}

        <group position={[0, 0, Z_OFFSET]}>
          <Arc start={0} length={Math.PI / 3} color={colors.stroke} radius={2/5} position={[-scale / 2, d - height, 0]}  width={ARC_WIDTH} />
          <Arc start={0} length={Math.PI / 3} color={colors.stroke} radius={3/5} position={[-scale / 2, d - height, 0]}  width={ARC_WIDTH} />
          <Arc start={2 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={sdivis / 2} position={[scale / 4, d - height / 2, 0]} width={ARC_WIDTH} />
        </group>

        {/* Fill */}
        <Arc start={0} length={Math.PI / 3} color={colors.secondary} radius={5/10} position={[-scale / 2, d - height, 0]} width={ARC_WIDTH * 3} />
        <SemiCircle start={2 * Math.PI / 3} length={Math.PI} color={colors.secondary} radius={sdivis / 2} position={[scale / 4, d - height / 2, 0]}/>
      </group>
    );
  },
];

export const TriangleTiling = (props: TriangleTilingProps) => {
  const { cols, rows, scale = 1, z = 0, ...etc } = props;

  const colors = useMemo(() => {
    return ["#264653", "#2a9d8f", "#e9c46a"];
  }, []);

  const grid = useMemo(() => {
    const grid: number[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: number[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(Math.floor(Math.random() * arcPatterns.length));
        row.push(Math.floor(Math.random() * arcPatterns.length));
      }
      grid.push(row.flat());
    }
    return grid;
  }, [rows, cols]);

  const tiling = useMemo(() => {
    const wireframe = true;
    return Array.from(new Array(rows)).map((_, r) => {
      return Array.from(new Array(cols)).map((__, c) => {
        const height = Math.sqrt(3) / 2 * scale;
        const d = Math.sqrt(3) / 3;
        const delta = d - height / 2;
        const x = c * scale + (r % 2 === 0 ? - scale / 2 : 0);
        const y = r * height;
        const a = Math.round(Math.random() * 3) * Math.PI * 2 / 3;
        const i = grid[r][c];
        const j = grid[r][c + 1];
        return [
          (
            <group key={`${r}-${c * 2}-${i}`} position={[x, y - delta, 0]}>
              <Triangle color={colors[1]} wireframe={wireframe} />
              {arcPatterns[i](scale, 1 / 5, { primary: colors[1], secondary: colors[2], stroke: colors[0] })}
            </group>
          ),
          (
            <group key={`${r}-${c * 2 + 1}-${j}`} position={[x + scale / 2, y + delta, 0]} rotation={[0, 0, Math.PI + a]}>
              <Triangle color={colors[1]} wireframe={wireframe} />
              {arcPatterns[j](scale, 1 / 5, { primary: colors[1], secondary: colors[2], stroke: colors[0] })}
            </group>
          )
        ]
      }).flat();
    })
  }, [cols, rows, colors, grid, scale]);

  return (
    <group {...etc}>
      <group position={[-scale * (cols - 1) / 2, -Math.sqrt(3) / 2 * scale * rows / 2, z]}>
        {tiling}
      </group>
    </group>
  );
}

