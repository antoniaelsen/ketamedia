import * as THREE from "three";

export class BoidGeometry extends THREE.BufferGeometry {
  constructor(nBoids: number, textureWidth: number) {
    super();

    const triangles = nBoids * 3;
    const points = triangles * 3;

    const vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
    const references = new THREE.BufferAttribute(
      new Float32Array(points * 2),
      2
    );
    const boidGeometry = new THREE.BufferAttribute(new Float32Array(points), 1);

    this.setAttribute("boidGeometry", boidGeometry);
    this.setAttribute("reference", references);
    this.setAttribute("position", vertices);

    let v = 0;

    function verts_push(...args: any) {
      for (let i = 0; i < args.length; i++) {
        (vertices.array as any)[v++] = args[i];
      }
    }

    const wingsSpan = 20;

    for (let f = 0; f < nBoids; f++) {
      // Body
      verts_push(0, -0, -20, 0, 4, -20, 0, 0, 30);

      // Wings
      verts_push(0, 0, -15, -wingsSpan, 0, 0, 0, 0, 15);
      verts_push(0, 0, 15, wingsSpan, 0, 0, 0, 0, -15);
    }

    for (let v = 0; v < triangles * 3; v++) {
      const iTriangle = ~~(v / 3);
      const iBoid = ~~(iTriangle / 3);
      const x = (iBoid % textureWidth) / textureWidth;
      const y = ~~(iBoid / textureWidth) / textureWidth;

      (references.array as any)[v * 2] = x;
      (references.array as any)[v * 2 + 1] = y;
      (boidGeometry.array as any)[v] = v % 9;
    }

    this.scale(0.2, 0.2, 0.2);
  }
}
