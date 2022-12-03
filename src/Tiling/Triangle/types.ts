import * as THREE from "three";

export interface TriangleTilingColors {
  stroke: THREE.Color | string;
  background: THREE.Color | string;
  primary: THREE.Color | string;
}

export enum TriangleTilingTile {
  FILLED = 0,
  EMPTY = 1,
  MIXED = 2,
  MIXED_FILLED = 3
}
