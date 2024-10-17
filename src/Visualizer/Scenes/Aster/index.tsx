import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";

export { DebugPanel } from "./components/DebugPanel";
import { Nametags } from "./components/Nametags";
import { InstancedStarField } from "./components/StarField";
import { StarMetadata } from "./types";
import { useGalaxyStore } from "./store";
import STAR_JSON from "./hyglike_from_athyg_24.json";
import { useMemo } from "react";
import { getIsMobile } from "util/hooks/use-is-mobile";

const STARS: StarMetadata[] = (STAR_JSON as StarMetadata[]).filter(
  ({ distance, id }: StarMetadata) => !!distance || id === 0
);

export const Scene = ({
  cameraFov = 75,
  cameraPosition = new Vector3(0, 0, 1),
}) => {
  const { show_nametags, scale_nametags } = useGalaxyStore();

  const stars = useMemo(() => {
    const isMobile = getIsMobile();

    if (isMobile) {
      return STARS.filter((s, i) => !!s.proper || i % 10 === 0);
    }

    return STARS;
  }, []);

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

      <InstancedStarField stars={stars} />
      {show_nametags && <Nametags stars={stars} transform={scale_nametags} />}

      <pointLight color={"rgb(255, 200, 0)"} distance={100} intensity={1} />
    </Canvas>
  );
};
