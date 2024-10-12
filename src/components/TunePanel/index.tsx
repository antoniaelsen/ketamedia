import { Box } from "@mui/material";
import { useAppStore } from "../../store/app";
import { VISUALIZERS } from "../../Visualizer/visualizers";

export const TunePanel = () => {
  const visualizer = useAppStore((state) => state.visualizer);

  const Component = visualizer ? VISUALIZERS[visualizer]?.debug : null;
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "center",
        height: 360,
      }}
    >
      {Component && <Component />}
    </Box>
  );
};
