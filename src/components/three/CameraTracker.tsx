import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { Html } from "@react-three/drei";
import { Typography } from "@mui/material";
import { toDegrees } from "util/coordinates";

export const CameraTracker = () => {
  const { camera } = useThree();
  const [cameraInfo, setCameraInfo] = useState({
    position: new Vector3(),
    rotation: new Vector3(),
    distance: 0,
  });

  useEffect(() => {
    const updateCameraInfo = () => {
      const position = camera.position.clone();
      const rotation = new Vector3(
        camera.rotation.x,
        camera.rotation.y,
        camera.rotation.z
      );
      const distance = position.length();

      setCameraInfo({ position, rotation, distance });
    };

    const intervalId = setInterval(updateCameraInfo, 100); // Update every 100ms

    return () => clearInterval(intervalId);
  }, [camera]);

  return (
    <Html
      style={{
        position: "absolute",
        bottom: "10px",
        right: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        width: "min-content",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, auto)",
            gap: "4px",
          }}
        >
          <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
            X: {cameraInfo.position.x.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
            Y: {cameraInfo.position.y.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
            Z: {cameraInfo.position.z.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
            X: {toDegrees(cameraInfo.rotation.x).toFixed(2)}°
          </Typography>
          <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
            Y: {toDegrees(cameraInfo.rotation.y).toFixed(2)}°
          </Typography>
          <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
            Z: {toDegrees(cameraInfo.rotation.z).toFixed(2)}°
          </Typography>
        </div>
        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
          m: {cameraInfo.distance.toFixed(2)}
        </Typography>
      </div>
    </Html>
  );
};
