import { Box } from "@mui/material";
import { useAppStore } from "../../store/app";
import { SetupPanel } from "../SetupPanel";
import { SignalPanel } from "../SignalPanel";
import { TunePanel } from "../TunePanel";
import { useEffect } from "react";

const useTogglePanel = () => {
  const { panel, togglePanel } = useAppStore((s) => ({
    panel: s.panel,
    togglePanel: s.togglePanel,
  }));

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "d" || event.key === "D") {
        togglePanel(panel !== "visualizer" ? "visualizer" : null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [panel]);

  return panel;
};

export const InfoPanel = ({ children }: { children?: React.ReactNode }) => {
  const panel = useTogglePanel();

  return (
    <Box
      component="div"
      p={2}
      maxWidth={{
        xs: "100%",
        sm: "20rem",
      }}
      sx={{
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
