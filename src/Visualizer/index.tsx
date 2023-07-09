import { Box, BoxProps } from "@mui/material";
import { useAppStore } from "../store/app";
import { Scene as FlockingScene } from "./Scenes/Flocking";
import Base from "./Scenes/Base";

const VISUALIZERS: { [key: string]: any } = {
  flocking: { scene: FlockingScene },
};

export const Visualizer = (props: BoxProps) => {
  const visualizer = useAppStore((state: any) => state.visualizer);

  const Scene = VISUALIZERS[visualizer]?.scene || Base.scene;

  return (
    <Box
      sx={{ height: "100%", position: "relative" }}
      {...props}
      component="div"
    >
      <Scene />
    </Box>
  );
};
