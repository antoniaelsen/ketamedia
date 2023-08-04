import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";

import { FrequencyDomain } from "./components/FrequencyDomain";
import { TimeDomain } from "./components/TimeDomain";

export const Graph = ({
  cameraFov = 60,
  cameraPosition = new Vector3(0, 0.25, -3),
  ...etc
}) => {
  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: cameraFov }}
      {...etc}
    >
      <ambientLight intensity={1} />

      <FrequencyDomain />
      {/* <TimeDomain position={[2.75, 0, 0]} /> */}

      <OrbitControls makeDefault />
    </Canvas>
  );
};
