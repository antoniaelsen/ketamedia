import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Euler, Vector3 } from "three";

import { Canvas } from "components/Canvas";
import { LoadingSpinner } from "components/LoadingSpinner";
import { useAutoOrbit } from "util/hooks/use-auto-orbit";
import { getIsMobile } from "util/hooks/use-is-mobile";

import { useStars } from "./api/ketamedia";
import { useConstellations } from "./api/stellarium";
import { Nametags } from "./components/Nametags";
import { InstancedStarField } from "./components/StarField";
import { Asterisms } from "./components/Asterisms";
import { useAsterStore, useCamera } from "./store";
import { Constellation, StarMetadata } from "./types";
import { useConstellationStars } from "./util/stellarium";
import { CelestialGrid } from "./components/CelestialGrid";
import { Axes } from "components/three/Axes";

const kEmptyStars: StarMetadata[] = [];
const kEmptyConstellations: Record<string, Constellation> = {};

const useAutoOrbitAster = () => {
  const { orbiting, orbitLock, orbitWaitMs, setOrbiting, setOrbitLock } =
    useAsterStore((s) => ({
      orbiting: s.orbiting,
      orbitLock: s.orbit_lock,
      orbitWaitMs: s.orbit_wait_ms,
      setOrbiting: (orbiting: boolean) => {
        if (s.orbit_lock) {
          return;
        }
        s.setVariable("orbiting", orbiting);
      },
      setOrbitLock: (orbitLock: boolean) =>
        s.setVariable("orbit_lock", orbitLock),
    }));

  const controlsRef = useAutoOrbit({
    orbiting,
    orbitLock,
    waitMs: orbitWaitMs,
    setOrbiting,
    setOrbitLock,
  });
  const { camera, setCamera } = useCamera();

  useThree((s) => {
    // ugh
    if (
      camera != s.camera &&
      s.controls != controlsRef.current &&
      !!controlsRef.current
    ) {
      setCamera(s.camera, controlsRef.current);
    }
  });

  return controlsRef;
};

const Base = ({ children }: { children?: React.ReactNode }) => {
  const controlsRef = useAutoOrbitAster();
  return (
    <>
      <color attach="background" args={[`rgb(5, 5, 20)`]} />
      <ambientLight intensity={0.8} />
      <OrbitControls ref={controlsRef} />

      {children}

      <pointLight color={"rgb(255, 200, 0)"} distance={100} intensity={1} />
    </>
  );
};

const Scene = ({
  cameraFov = 75,
  cameraPosition = new Vector3(-1, 0, 0),
}: {
  cameraFov?: number;
  cameraPosition?: Vector3;
}) => {
  const {
    skyculture,
    show_asterisms,
    show_asterism_nametags,
    show_grid,
    show_stars,
    show_star_nametags,
    scale_nametags,
  } = useAsterStore();
  const { data: stars } = useStars();
  const { data: constellations } = useConstellations(skyculture);

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
      <LoadingSpinner
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      />
    );
  }

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
      <Base>
        {show_grid && <CelestialGrid />}
        {show_stars && <InstancedStarField stars={stars} />}
        {show_asterisms && constellations && (
          <Asterisms
            constellations={constellationsWithStars}
            showNametags={show_asterism_nametags}
          />
        )}
        {show_star_nametags && (
          <Nametags stars={stars} transform={scale_nametags} />
        )}
      </Base>
    </Canvas>
  );
};

export default Scene;
