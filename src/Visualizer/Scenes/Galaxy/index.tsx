import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";

export { DebugPanel } from "./components/DebugPanel";
import { Nametags } from "./components/Nametags";
import { InstancedStarField } from "./components/StarField";
import STAR_JSON from "./hyglike_from_athyg_24.json";
import { StarMetadata } from "./types";
import { useGalaxyStore } from "./store";

const STARS: StarMetadata[] = (STAR_JSON as StarMetadata[]).filter(
  ({ distance, id }: StarMetadata) => !!distance || id === 0
);

export const Scene = ({
  cameraFov = 75,
  cameraPosition = new Vector3(0, 0, 350),
}) => {
  const { show_nametags, scale_nametags } = useGalaxyStore();

  return (
    <Canvas
      shadows
      camera={{
        position: cameraPosition,
        far: 10000,
        near: 0.0001,
        fov: cameraFov,
      }}
    >
      <color attach="background" args={[`rgb(5, 5, 20)`]} />
      <ambientLight intensity={0.8} />

      <OrbitControls makeDefault />

      <InstancedStarField stars={STARS} />
      {show_nametags && <Nametags stars={STARS} transform={scale_nametags} />}

      <pointLight color={"rgb(255, 200, 0)"} distance={100} intensity={1} />
    </Canvas>
  );
};
