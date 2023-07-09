import { Boids as BoidsShader } from "./components/Boids";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import { OrbitControls } from "@react-three/drei";

export { DebugPanel } from "./components/DebugPanel";

export const Scene = ({
  cameraFov = 75,
  cameraPosition = new Vector3(0, 0, 350),
}) => {
  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, far: 3000, fov: cameraFov }}
    >
      <OrbitControls makeDefault />
      <color attach="background" args={[`rgb(15, 20, 50)`]} />

      <ambientLight intensity={0.8} />

      <BoidsShader />
    </Canvas>
  );
};
