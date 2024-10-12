import { Box, BoxProps } from "@mui/material";
import { useAppStore } from "../store/app";
import { Scene as BaseScene } from "./Scenes/Base";
import { VISUALIZERS } from "./visualizers";

export const Visualizer = (props: BoxProps) => {
  const visualizer = useAppStore((state) => state.visualizer);

  const Scene = visualizer ? VISUALIZERS[visualizer]?.scene : BaseScene;

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
