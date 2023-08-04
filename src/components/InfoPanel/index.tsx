import { Box } from "@mui/material";
import { useAppStore } from "../../store/app";
import { DevicePanel } from "../DevicePanel";
import { SignalPanel } from "../SignalPanel";
import { TunePanel } from "../TunePanel";

export const InfoPanel = ({ children }: { children?: React.ReactNode }) => {
  const panels = useAppStore((state: any) => state.panels);
  const { data, device, visualizer } = panels;

  const activePanels = Object.entries(panels)
    .filter(([_, active]) => active)
    .map(([panel, _]) => panel);

  return (
    <Box
      component="div"
      p={2}
      maxWidth={{
        xs: "100%",
        sm: "20rem",
      }}
      sx={{
        backdropFilter: "blur(5px)",
        position: "absolute",
        left: 0,
        bottom: 50,
      }}
    >
      {children}

      {device && <DevicePanel />}

      {visualizer && <TunePanel />}

      {data && <SignalPanel />}
    </Box>
  );
};
