import { Box } from "@mui/material";
import { useAppStore } from "../../store/app";
import { SetupPanel } from "../SetupPanel";
import { SignalPanel } from "../SignalPanel";
import { TunePanel } from "../TunePanel";

export const InfoPanel = ({ children }: { children?: React.ReactNode }) => {
  const panel = useAppStore((state: any) => state.panel);

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
        right: 0,
        top: 0,
      }}
    >
      {children}

      {panel === "setup" && <SetupPanel />}

      {panel === "signal" && <SignalPanel />}

      {panel === "visualizer" && <TunePanel />}
    </Box>
  );
};
