import { OrbitControls, Sphere } from "@react-three/drei";
import { GroupProps, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, GodRays } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import { BlendFunction, KernelSize } from "postprocessing";
import { Mesh, Vector3 } from "three";

import { Canvas } from "components/Canvas";
import { LoadingSpinner } from "components/LoadingSpinner";
import { useAutoOrbit } from "util/hooks/use-auto-orbit";
import { getIsMobile } from "util/hooks/use-is-mobile";

import { useStars } from "./api/ketamedia";
import { useConstellations } from "./api/stellarium";
import { useConstellationStars } from "./util/stellarium";
import { Asterisms } from "./components/Asterisms";
import { CelestialGrid } from "./components/CelestialGrid";
import { Nametags } from "./components/Nametags";
import { InstancedStarField } from "./components/StarField";
import { useAsterStore, useCamera } from "./store";
import { Constellation, StarMetadata } from "./types";

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

const Base = (props: GroupProps) => {
  const { children, ...rest } = props;
  const controlsRef = useAutoOrbitAster();
  return (
    <group {...rest}>
      <color attach="background" args={[`rgb(0, 0, 0)`]} />
      <ambientLight intensity={0.8} />
      <OrbitControls ref={controlsRef} />

      {children}

      <pointLight color={"rgb(255, 200, 0)"} distance={100} intensity={1} />
    </group>
  );
};

const Scene = ({
  cameraFov = 75,
  cameraPosition = new Vector3(-1, 0, 0),
}: {
  cameraFov?: number;
  cameraPosition?: Vector3;
}) => {
  const sol = useRef<Mesh>(null);
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
      style={{ backgroundColor: "black" }}
    >
      <Base>
        <Sphere ref={sol} scale={0.05}>
          <meshStandardMaterial
            color="rgb(255, 225, 100)"
            emissive="rgb(255, 225, 100)"
            emissiveIntensity={0.8}
            opacity={show_stars ? 1 : 0}
          />
        </Sphere>
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
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={1} height={300} />
        <GodRays
          sun={sol as any}
          blendFunction={BlendFunction.SCREEN}
          samples={60}
          density={1}
          decay={0.5}
          weight={1}
          exposure={0.6}
          clampMax={1}
          kernelSize={KernelSize.SMALL}
          blur={true}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;
