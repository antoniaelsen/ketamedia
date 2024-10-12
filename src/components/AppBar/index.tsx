import { IconButton, Stack } from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TuneIcon from "@mui/icons-material/Tune";
import { shallow } from "zustand/shallow";

import { useAppStore } from "../../store/app";
import { useAudioStore } from "../../store/audio";

export const AppBar = () => {
  const { panel, togglePanel } = useAppStore(
    (state) => ({
      panel: state.panel,
      togglePanel: state.togglePanel,
    }),
    shallow
  );

  const device = useAudioStore((state) => state.device);

  return (
    <Stack
      position="absolute"
      direction="row"
      spacing={1}
      sx={{
        background: "transparent",
        height: "fit-content",
        padding: 1,
        bottom: 0,
        top: "auto",
        zIndex: 10000,
      }}
    >
      <IconButton
        aria-label="setup"
        color={panel === "setup" ? "secondary" : "inherit"}
        sx={{ borderRadius: "4px" }}
        onClick={() => togglePanel("setup")}
      >
        <MicIcon />
      </IconButton>

      <IconButton
        aria-label="source data"
        color={panel === "signal" ? "secondary" : "inherit"}
        disabled={!device}
        sx={{ borderRadius: "4px" }}
        onClick={() => togglePanel("signal")}
      >
        <ShowChartIcon />
      </IconButton>

      <IconButton
        aria-label="tune"
        color={panel === "visualizer" ? "secondary" : "inherit"}
        sx={{ borderRadius: "4px" }}
        onClick={() => togglePanel("visualizer")}
      >
        <TuneIcon />
      </IconButton>
    </Stack>
  );
};
