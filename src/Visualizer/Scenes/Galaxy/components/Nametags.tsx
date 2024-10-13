import { Typography } from "@mui/material";
import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { Vector3 } from "three";
import { StarMetadata } from "../types";

export const Nametags = ({
  stars,
  transform,
}: {
  stars: StarMetadata[];
  transform: boolean;
}) => {
  const nametags = useMemo(() => {
    return stars
      .filter(({ proper }) => !!proper)
      .map(({ id, proper, position }) => ({
        id,
        proper,
        position: new Vector3(position.x, position.y, position.z),
      }));
  }, [stars]);

  return (
    <>
      {nametags.map(({ id, proper, position }, i) => (
        <Html
          key={`${i}-${proper}`}
          position={position}
          scale={0.05}
          transform={transform}
        >
          <Typography
            variant="caption"
            sx={{
              color: "rgb(0, 200, 225)",
              opacity: id === 0 ? 1 : 0.5,
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            {proper}
          </Typography>
        </Html>
      ))}
    </>
  );
};
