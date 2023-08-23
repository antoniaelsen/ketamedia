import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, Plane } from "@react-three/drei";

import { useMemo } from "react";
import { getConnectedEdges, Node } from "reactflow";
import * as THREE from "three";
import useVideoStore from "./store";

export { DebugPanel } from "./components/DebugPanel";

const Screen = () => {
  const videos = useVideoStore((s) => s.videos);
  const [video, setVideo] = useState(videos[1]);

  const nextVideo = () => {
    setVideo((video) => {
      const index = video ? videos.findIndex((v) => v.url === video.url) : -1;
      const next = videos[index + 1] || videos[0];
      return next;
    });
  };

  const videoElement = useMemo(() => {
    if (!video) return null;

    console.log("Playing", video.url);
    const vid = document.createElement("video");
    vid.addEventListener("ended", nextVideo);
    vid.src = video.url;
    vid.crossOrigin = "Anonymous";
    vid.muted = true;
    vid.play().catch((error) => {
      console.log(`Failed to play video "${video.url}":`, error);
    });

    return vid;
  }, [video]);

  return (
    <Plane args={[2, (10 / 16) * 2]}>
      <meshStandardMaterial emissive={"black"} side={THREE.DoubleSide}>
        {videoElement && (
          <>
            <videoTexture attach="map" args={[videoElement]} />
            <videoTexture attach="emissiveMap" args={[videoElement]} />
          </>
        )}
      </meshStandardMaterial>
    </Plane>
  );
};

export const Scene = () => {
  return (
    <Canvas shadows>
      <OrthographicCamera
        makeDefault
        bottom={-1}
        left={-1}
        right={1}
        top={1}
        far={1}
        near={0}
      />
      <OrbitControls makeDefault />
      <color attach="background" args={[`rgb(10, 10, 10)`] as any} />

      <ambientLight intensity={0.5} />
      <Screen />
    </Canvas>
  );
};

export default {
  debug: null,
  scene: Scene,
};
