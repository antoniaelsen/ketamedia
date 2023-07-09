import {
  AppBar as MuiAppBar,
  AppBarProps,
  IconButton,
  Toolbar,
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TuneIcon from "@mui/icons-material/Tune";
import { shallow } from "zustand/shallow";

import { useAppStore } from "../../store/app";
import { useAudioStore } from "../../store/audio";

export const AppBar = (props: AppBarProps) => {
  const { panel, togglePanel } = useAppStore(
    (state: any) => ({
      panel: state.panel,
      togglePanel: state.togglePanel,
    }),
    shallow
  );

  const device = useAudioStore((state: any) => state.device);

  return (
    <MuiAppBar
      position="absolute"
      sx={{
        background: "transparent",
        backdropFilter: "blur(5px)",
        bottom: 0,
        height: "fit-content",
        top: "auto",
        zIndex: 10000,
      }}
      {...props}
    >
      <Toolbar>
        <IconButton
          aria-label="setup"
          color={panel === "setup" ? "secondary" : "inherit"}
          sx={{ mr: 2 }}
          onClick={() => togglePanel("setup")}
        >
          <MicIcon />
        </IconButton>

        <IconButton
          aria-label="source data"
          color={panel === "signal" ? "secondary" : "inherit"}
          disabled={!device}
          sx={{ mr: 2 }}
          onClick={() => togglePanel("signal")}
        >
          <ShowChartIcon />
        </IconButton>

        <IconButton
          aria-label="tune"
          color={panel === "visualizer" ? "secondary" : "inherit"}
          sx={{ mr: 2 }}
          onClick={() => togglePanel("visualizer")}
        >
          <TuneIcon />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
};
