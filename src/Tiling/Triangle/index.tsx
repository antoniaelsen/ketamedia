import React, { useMemo } from 'react';
import { GroupProps } from '@react-three/fiber';
import { Arc } from '../../Shapes/Arc';

import { Triangle } from '../../Shapes/Triangle';
import { SemiCircle } from '../../Shapes/SemiCircle';
import { TriangleArcFill } from './components/TriangleArcFill';

const ARC_WIDTH = 0.05;
const Z_OFFSET = 0.001;
const N_SHAPES = 2;

interface TriangleTilingProps extends GroupProps {
  cols: number;
  rows: number;
  scale?: number;
  wireframe?: boolean;
}

interface TriangleTilingColors {
  stroke: THREE.Color | string;
  background: THREE.Color | string;
  primary: THREE.Color | string;
}

enum TriangleTilingTile {
  FILLED = 0,
  EMPTY = 1,
  MIXED = 2,
}

const generateRandomMask = (n: number) => Array.from(new Array(n)).map(() => Math.floor(Math.random() * 2));

const generateRandomMaskNonzero = (n: number) => {
  let mask = null;
  do {
    mask = generateRandomMask(n);
  } while (mask.every((e) => e < 1));
  return mask;
};

const arcCorners = (scale: number, n_shapes: number = 1, colors: TriangleTilingColors) => {
  const height = Math.sqrt(3) / 2 * scale;
  const d = Math.sqrt(3) / 3 * scale;
  const divis = (n_shapes + 2) * 2  - 1;
  const spacing = 1 / divis * scale;

  return (
    <group>
      {/* Stroke */}
      <group position={[0, 0, Z_OFFSET]}>
        <Arc start={0} length={Math.PI / 3} color={colors.stroke} radius={spacing} position={[-scale / 2, d - height, 0]}  width={ARC_WIDTH} />
        <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={spacing} position={[0, d, 0]} width={ARC_WIDTH} />
        <Arc start={2 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={spacing} position={[scale / 2, d - height, 0]} width={ARC_WIDTH} />
      </group>

      {/* Fill */}
      <SemiCircle start={0} length={Math.PI / 3} color={colors.primary} radius={spacing} position={[-scale / 2, d - height, 0]}/>
      <SemiCircle start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.primary} radius={spacing} position={[0, d, 0]}/>
      <SemiCircle start={2 * Math.PI / 3} length={Math.PI / 3} color={colors.primary} radius={spacing} position={[scale / 2, d - height, 0]}/>
    </group>
  );
};

const arcPatterns = {
  // All fill
  [TriangleTilingTile.FILLED]: (scale: number, n_shapes: number = 1, colors: TriangleTilingColors) => {
    const height = Math.sqrt(3) / 2 * scale;
    const d = Math.sqrt(3) / 3 * scale;
    const r = height - d;
    const divis = (n_shapes + 2) * 2  - 1;
    const spacing = 1 / divis * scale;

    return (
      <group position={[0, 0, Z_OFFSET]}>
        {arcCorners(scale, n_shapes, colors)}

        {/* Stroke */}
        {/* Corners */}
        <Arc start={0} length={Math.PI / 3} color={colors.stroke} radius={2 * spacing} position={[-scale / 2, d - height, Z_OFFSET]}  width={ARC_WIDTH}/>
        <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={2 * spacing} position={[0, d, Z_OFFSET]} width={ARC_WIDTH} />
        <Arc start={2 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={2 * spacing} position={[scale / 2, d - height, Z_OFFSET]} width={ARC_WIDTH} />

        {/* Side */}
        {Array.from(new Array(n_shapes - 1)).map((_, i) => {
          const dot_spacing = spacing * (2 * (i + 1) + 1.5);
          const dot_spacing_x = dot_spacing * Math.cos(Math.PI / 3);
          const dot_spacing_y = dot_spacing * Math.sin(Math.PI / 3);
          const x_ur = (scale / 2) - dot_spacing_x;
          const y_ur = dot_spacing_y - r;
          const x_ul = dot_spacing_x - scale / 2;
          const y_ul = dot_spacing_y - r;
          const x_b = dot_spacing - scale / 2;
          const y_b = -r;

          return (
            <>
              {/* Upper Right */}
              <Arc start={4 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_ul, y_ul, Z_OFFSET]}  width={ARC_WIDTH}/>
              {/* Upper Left */}
              <Arc start={2 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_ur, y_ur, Z_OFFSET]} width={ARC_WIDTH} />
              {/* Bottom */}
              <Arc start={0 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_b, y_b, Z_OFFSET]} width={ARC_WIDTH} />
            </>
          );
        })}

        {/* Fill */}
        <TriangleArcFill color={colors.primary} n_shapes={n_shapes} radius={2 * spacing * scale} scale={scale}/>
      </group>
    );
  },
  // All dots
  [TriangleTilingTile.EMPTY]: (scale: number, n_shapes: number = 1, colors: TriangleTilingColors) => {
    const height = Math.sqrt(3) / 2 * scale;
    const d = Math.sqrt(3) / 3 * scale;
    const r = height - d;
    const divis = (n_shapes + 2) * 2  - 1;
    const spacing = 1 / divis * scale;
    
    return (
      <group position={[0, 0, Z_OFFSET]}>
        {arcCorners(scale, n_shapes, colors)}

        {Array.from(new Array(n_shapes)).map((_, i) => {
          const dot_spacing = spacing * (2 * (i + 1) + 0.5);
          const dot_spacing_x = dot_spacing * Math.cos(Math.PI / 3);
          const dot_spacing_y = dot_spacing * Math.sin(Math.PI / 3);
          const x_ur = (scale / 2) - dot_spacing_x;
          const y_ur = dot_spacing_y - r;
          const x_ul = dot_spacing_x - scale / 2;
          const y_ul = dot_spacing_y - r;
          const x_b = dot_spacing - scale / 2;
          const y_b = -r;

          return (
            <>
              {/* Upper Right */}
              <Arc start={4 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_ul, y_ul, Z_OFFSET]}  width={ARC_WIDTH}/>
              <SemiCircle start={0 * Math.PI / 3} length={Math.PI} color={colors.primary} radius={spacing / 2} position={[x_ul, y_ul, 0]} rotation_ellipse={4 * Math.PI / 3}/>

              {/* Upper Left */}
              <Arc start={2 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_ur, y_ur, Z_OFFSET]} width={ARC_WIDTH} />
              <SemiCircle start={2 * Math.PI / 3} length={Math.PI} color={colors.primary} radius={spacing / 2} position={[x_ur, y_ur, 0]}/>

              {/* Bottom */}
              <Arc start={0 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_b, y_b, Z_OFFSET]} width={ARC_WIDTH} />
              <SemiCircle start={0 * Math.PI / 3} length={Math.PI} color={colors.primary} radius={spacing / 2} position={[x_b, y_b, 0]}/>
            </>
          );
        })}

      </group>
    );
  },
  // Dots and filled curves
  [TriangleTilingTile.MIXED]: (scale: number, n_shapes: number = 1, colors: TriangleTilingColors, { mask }: { mask: number[] }) => {
    const height = Math.sqrt(3) / 2 * scale;
    const d = Math.sqrt(3) / 3 * scale;
    const r = height - d;
    const divis = (n_shapes + 2) * 2  - 1;
    const spacing = 1 / divis * scale;

    return (
      <group position={[0, 0, Z_OFFSET]}>
        {arcCorners(scale, n_shapes, colors)}

        {mask.map((m, i) => {
          if (spacing * (2 * i + 3) > height - ARC_WIDTH) m = 0;
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
                  <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={spacing * (2 * i + 2)} position={[0, d, Z_OFFSET]}  width={ARC_WIDTH} />
                  <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.stroke} radius={spacing * (2 * i + 3)} position={[0, d, Z_OFFSET]}  width={ARC_WIDTH} />
    
                  {/* Fill */}
                  <Arc start={4 * Math.PI / 3} length={Math.PI / 3} color={colors.primary} radius={spacing * (2 * i + 2.5)} position={[0, d, 0]} width={spacing} />
                </group >
              )}
  
              {/* SemiCircle */}
              {(m === 0) && (
                <group key={`semicircle-${i}`}>
                  {/* Upper Right */}
                  <Arc start={4 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_ul, y_ul, Z_OFFSET]}  width={ARC_WIDTH}/>
                  <SemiCircle start={0 * Math.PI / 3} length={Math.PI} color={colors.primary} radius={spacing / 2} position={[x_ul, y_ul, 0]} rotation_ellipse={4 * Math.PI / 3}/>

                  {/* Upper Left */}
                  <Arc start={2 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_ur, y_ur, Z_OFFSET]} width={ARC_WIDTH} />
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
              <Arc start={0 * Math.PI / 3} length={Math.PI} color={colors.stroke} radius={spacing / 2} position={[x_b, y_b, Z_OFFSET]} width={ARC_WIDTH} />
              <SemiCircle start={0 * Math.PI / 3} length={Math.PI} color={colors.primary} radius={spacing / 2} position={[x_b, y_b, 0]}/>
            </>
          );
        })}
      </group>
    );
  },
};

export const TriangleTiling = (props: TriangleTilingProps) => {
  const { cols, rows, scale = 1, wireframe, ...etc } = props;
  const n_shapes = N_SHAPES;

  const colors = useMemo(() => {
    return {
      stroke: "#e26d5c",
      background: "#c9cba3",
      primary: "#ffe1a8",
    };
    // return {
    //   stroke: "#354f52",
    //   background: "#52796f",
    //   primary: "#84a98c",
    // };
  }, []);

  const grid = useMemo(() => {
    const frequencies = [
      ...new Array(1).fill(TriangleTilingTile.EMPTY),
      ...new Array(3).fill(TriangleTilingTile.FILLED),
      ...new Array(3).fill(TriangleTilingTile.MIXED),
    ];
    console.log("Frequencies", frequencies.reduce((acc, e) => ({...acc, [TriangleTilingTile[e]]: (acc[TriangleTilingTile[e]] || 0) + 1 }), {}));
    const grid: any[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: any[] = [];
      for (let c = 0; c < cols; c++) {
        for (let i = 0; i < 2; i++) {
          const rand = Math.random();
          const p = Math.floor(rand * frequencies.length);
          const pattern = frequencies[p];
          const rotation = Math.round(Math.random() * 3) * Math.PI * 2 / 3;
          // const rotation = 0;
          // const pattern = TriangleTilingTile.MIXED;
          const options = pattern === TriangleTilingTile.MIXED ? { mask: n_shapes > 1 ? generateRandomMaskNonzero(n_shapes) : [1] } : {};
          row.push({ pattern, options, rotation });
        }
      }
      grid.push(row.flat());
    }
    return grid;
  }, [cols, rows, n_shapes]);

  const tiling = useMemo(() => {
    return Array.from(new Array(rows)).map((_, r) => {
      return Array.from(new Array(cols * 2)).map((__, c) => {
        const height = Math.sqrt(3) / 2 * scale;
        const d = Math.sqrt(3) / 3;
        const delta = d - height / 2;
        const x = c * scale / 2 + (r % 2 === 0 ? - scale / 2 : 0);
        const y = r * height;
        const e = grid[r][c];
        const y_tiled = c % 2 === 0
          ? y - delta
          : y + delta;

        return (
          <group key={`${r}-${c}`} position={[x, y_tiled, 0]} rotation={[0, 0, (c % 2 === 0 ? 0 : Math.PI) + e.rotation]}>
            <Triangle color={colors.background} wireframe={wireframe} />
            {arcPatterns[e.pattern](scale, n_shapes, { background: colors.background, primary: colors.primary, stroke: colors.stroke }, (e.options as any))}
          </group>
        )
      });
    })
  }, [cols, rows, colors, grid, n_shapes, scale, wireframe]);

  console.log("Grid", grid);

  return (
    <group {...etc}>
      <group position={[-scale * (cols - 1) / 2, -Math.sqrt(3) / 2 * scale * rows / 2, 0]}>
        {tiling}
      </group>
    </group>
  );
}

