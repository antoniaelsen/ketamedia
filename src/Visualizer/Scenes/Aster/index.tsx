import { OrbitControls as RTFOrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import { Vector3 } from "three";

import { Canvas } from "components/Canvas";
import { LoadingSpinner } from "components/LoadingSpinner";
import { useStars } from "./api/ketamedia";
import { useConstellations } from "./api/stellarium";
import { Nametags } from "./components/Nametags";
import { InstancedStarField } from "./components/StarField";
import { useGalaxyStore } from "./store";
import { getIsMobile } from "util/hooks/use-is-mobile";
import { Asterisms } from "./components/Asterisms";
import { useConstellationStars } from "./util/lib";
import { Constellation, StarMetadata } from "./types";
import { useAutoOrbit } from "util/hooks/use-auto-orbit";

const kEmptyStars: StarMetadata[] = [];
const kEmptyConstellations: Record<string, Constellation> = {};

const OrbitControls = ({}) => {
  const ref = useAutoOrbit();

  return <RTFOrbitControls ref={ref} makeDefault />;
};

const Base = ({
  cameraFov = 75,
  cameraPosition = new Vector3(0, 0, 1),
  children,
}: {
  cameraFov?: number;
  cameraPosition?: Vector3;
  children?: React.ReactNode;
}) => {
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
      <OrbitControls />

      {children}

      <pointLight color={"rgb(255, 200, 0)"} distance={100} intensity={1} />
    </Canvas>
  );
};

const Scene = () => {
  const { show_asterisms, show_nametags, scale_nametags } = useGalaxyStore();
  const { data: stars } = useStars();
  const { data: constellations } = useConstellations();

  const filtered = useMemo(() => {
    const isMobile = getIsMobile();

    if (isMobile) {
      return (stars || []).filter((s, i) => !!s.proper || i % 10 === 0);
    }

    return stars;
  }, [stars]);

  const constellationsWithStars = useConstellationStars(
    filtered || kEmptyStars,
    constellations || kEmptyConstellations
  );

  if (!stars) {
    return (
      <>
        <Base />
        <LoadingSpinner
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        />
      </>
    );
  }

  return (
    <Base>
      <InstancedStarField stars={stars} />
      {show_asterisms && constellations && (
        <Asterisms constellations={constellationsWithStars} />
      )}
      {show_nametags && <Nametags stars={stars} transform={scale_nametags} />}
    </Base>
  );
};

export default Scene;
