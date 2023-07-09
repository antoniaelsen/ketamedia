import { Box } from "@mui/material";
import { useAppStore } from "../../store/app";
import { VISUALIZERS } from "../../Visualizer/visualizers";

export const TunePanel = () => {
  const visualizer = useAppStore((state: any) => state.visualizer);

  const Component = VISUALIZERS[visualizer]?.debug || null;
  console.log("TunePanel | Component: ", visualizer, Component);
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "center",
        height: 360,
      }}
    >
      <Component />
    </Box>
  );
};
