import { Box } from "@mui/material";
import { useAppStore } from "../../store/app";
import { DevicePanel } from "../DevicePanel";
import { SignalPanel } from "../SignalPanel";
import { VisualizerPanel } from "../VisualizerPanel";

export const InfoPanel = ({ children }: { children?: React.ReactNode }) => {
  const panels = useAppStore((state: any) => state.panels);
  const { data, device, visualizer } = panels;

  return (
    <Box
      component="div"
      p={2}
      sx={{
        backdropFilter: "blur(5px)",
        position: "absolute",
        left: 0,
        bottom: 50,
      }}
    >
      {children}

      {device && <DevicePanel />}

      {visualizer && <VisualizerPanel />}

      {data && <SignalPanel />}
    </Box>
  );
};
