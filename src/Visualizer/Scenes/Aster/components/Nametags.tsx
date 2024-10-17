import { Typography } from "@mui/material";
import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { Vector3 } from "three";
import { StarMetadata } from "../types";

export interface NametagProps {
  proper: string;
  position: Vector3;
  transform: boolean;
  color?: string;
  opacity?: number;
}

export const Nametag = (props: NametagProps) => {
  const { color, proper, position, transform, opacity = 0.5 } = props;

  return (
    <Html position={position} scale={0.05} transform={transform}>
      <Typography
        variant="caption"
        sx={{
          color,
          opacity,
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {proper}
      </Typography>
    </Html>
  );
};

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
      {nametags.map(({ id, proper, position }) => (
        <Nametag
          key={id}
          proper={proper}
          position={position}
          transform={transform}
          color="rgb(255, 180, 50)"
          opacity={id === 0 ? 1 : 0.5}
        />
      ))}
    </>
  );
};
