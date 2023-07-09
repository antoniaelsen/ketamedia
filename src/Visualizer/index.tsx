import { Box, BoxProps } from "@mui/material";
import { useAppStore } from "../store/app";
import Base from "./Scenes/Base";
import { VISUALIZERS } from "./visualizers";

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
