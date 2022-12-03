import React, { useCallback, useRef, useState } from 'react'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas as RtfCanvas } from '@react-three/fiber'
import * as THREE from "three";

import Button from '@mui/material/Button';

import { TriangleTiling } from '../Tiling/Triangle';
import Box from '@mui/material/Box';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const [wireframe, setWireframe] = useState(false);

  const save = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("Canvas", canvas)
    const url = canvas.toDataURL("image/png");
    let download = document.createElement('a');
    download.setAttribute('download', 'ketamedia.png');
    console.log("url", url)
    download.setAttribute('href', url);
    download.click();
  }, [canvasRef]);

  return (
    <>
      <RtfCanvas ref={canvasRef} style={{ width: '100%', height: '100%' }} gl={{ preserveDrawingBuffer: true }}>
        {/* <OrthographicCamera makeDefault /> */}
        <OrbitControls/>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <TriangleTiling cols={15} rows={15} position={[0, 0, -4]} wireframe={wireframe}/>
      </RtfCanvas>

      <Box sx={{ position: "absolute", bottom: "1rem", right: "1rem", display: "flex" }}>
        <Button sx={{ mr: "1rem" }} onClick={() => setWireframe(!wireframe)} variant="contained">
          wireframe
        </Button>
        <Button onClick={save} variant="contained">
          save
        </Button>
      </Box>
    </>
  );
}

export default Canvas;
