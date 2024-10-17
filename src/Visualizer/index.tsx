import { Box, BoxProps } from "@mui/material";
import { useAppStore } from "../store/app";
import { getVisualizer } from "./visualizers";

export const Visualizer = (props: BoxProps) => {
  const visualizer = useAppStore((state) => state.visualizer);
  console.log("Visualizer:", visualizer);

  const { scene: Scene } = getVisualizer(visualizer);

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
