import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { Vector3 } from "three";

import { useConstellations } from "./api/stellarium";
import { Nametags } from "./components/Nametags";
import { InstancedStarField } from "./components/StarField";
import { kStars } from "./util/stellarium";
import { useGalaxyStore } from "./store";
import { getIsMobile } from "util/hooks/use-is-mobile";
import { Asterisms } from "./components/Asterisms";

const Scene = ({ cameraFov = 75, cameraPosition = new Vector3(0, 0, 1) }) => {
  const { show_asterisms, show_nametags, scale_nametags } = useGalaxyStore();
  const { data: constellations } = useConstellations();

  const stars = useMemo(() => {
    const isMobile = getIsMobile();

    if (isMobile) {
      return kStars.filter((s, i) => !!s.proper || i % 10 === 0);
    }

    return kStars;
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
      {show_asterisms && constellations && (
        <Asterisms constellations={constellations} />
      )}
      {show_nametags && <Nametags stars={stars} transform={scale_nametags} />}

      <pointLight color={"rgb(255, 200, 0)"} distance={100} intensity={1} />
    </Canvas>
  );
};

export default Scene;
