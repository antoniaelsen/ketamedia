import React from 'react'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas as RtfCanvas } from '@react-three/fiber'
import * as THREE from "three";

import { TriangleTiling } from '../Tiling/Triangle';

const Canvas = () => {
  return (
    <RtfCanvas style={{ width: '100%', height: '100%' }}>
      {/* <OrthographicCamera makeDefault /> */}
      <OrbitControls/>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <TriangleTiling cols={25} rows={25} position={[0, 0, -4]} wireframe={false}/>
    </RtfCanvas>
  );
}

export default Canvas;
