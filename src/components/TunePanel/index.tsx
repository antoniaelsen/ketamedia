import { Box } from "@mui/material";
import { useAppStore } from "../../store/app";
import { getVisualizer } from "../../Visualizer/visualizers";

export const TunePanel = () => {
  const visualizer = useAppStore((state) => state.visualizer);

  const { debug: Component } = getVisualizer(visualizer);
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {Component && <Component />}
    </Box>
  );
};
