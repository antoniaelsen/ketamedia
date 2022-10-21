import React from 'react'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas as RtfCanvas } from '@react-three/fiber'
import * as THREE from "three";

import { Arc } from '../Shapes/Arc';
import { Box } from '../Shapes/Box';
import { TriangleTiling } from '../Tiling/triangle';

const Canvas = () => {
  return (
    <RtfCanvas style={{ width: '100%', height: '100%' }}>
      {/* <OrthographicCamera makeDefault /> */}
      <OrbitControls/>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <Box position={[-1.2, 0, -2]} />
      <Box position={[1.2, 0, -2]} /> */}
      <TriangleTiling cols={25} rows={25} position={[0, 0, -4]}/>
    </RtfCanvas>
  );
}

export default Canvas;
