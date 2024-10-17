import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { Canvas } from "components/Canvas";
import { Boids as BoidsShader } from "./components/Boids";

export const Scene = ({
  cameraFov = 75,
  cameraPosition = new Vector3(0, 0, 350),
}) => {
  return (
    <Canvas
      camera={{
        position: cameraPosition,
        far: 10000,
        near: 0.0001,
        fov: cameraFov,
      }}
    >
      <OrbitControls makeDefault />
      <color attach="background" args={[`rgb(15, 20, 50)`]} />

      <ambientLight intensity={0.8} />

      <BoidsShader />
    </Canvas>
  );
};

export default Scene;
