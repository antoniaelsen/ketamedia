import React, { useState } from "react";
import {
  ClickAwayListener,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MicIcon from "@mui/icons-material/Mic";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TuneIcon from "@mui/icons-material/Tune";
import { shallow } from "zustand/shallow";

import { VisualizerKey, VISUALIZERS } from "../../Visualizer/visualizers";
import { useAppStore } from "../../store/app";
import { useAudioStore } from "../../store/audio";

const VisualizerMenu = (props: {
  selected: VisualizerKey | null;
  onSelect: (v: VisualizerKey) => void;
}) => {
  const { selected, onSelect } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <IconButton
          id="button-visualizer"
          aria-controls={open ? "menu-visualizer" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{ borderRadius: "4px" }}
          onClick={handleClick}
        >
          <AutoAwesomeIcon />
        </IconButton>
        <Menu
          id="menu-visualizer"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "button-visualizer",
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {Object.keys(VISUALIZERS)
            .sort()
            .map((v) => (
              <MenuItem
                key={v}
                selected={v === selected}
                onClick={() => {
                  onSelect(v);
                  handleClose();
                }}
              >
                {v}
              </MenuItem>
            ))}
        </Menu>
      </div>
    </ClickAwayListener>
  );
};

export const AppBar = () => {
  const { panel, visualizer, togglePanel, toggleVisualizer } = useAppStore(
    (state) => ({
      visualizer: state.visualizer,
      panel: state.panel,
      togglePanel: state.togglePanel,
      toggleVisualizer: state.toggleVisualizer,
    }),
    shallow
  );

  const device = useAudioStore((state) => state.device);

  const handleVisualizerSelect = (visualizer: VisualizerKey) => {
    toggleVisualizer(visualizer);
    togglePanel(null);
  };

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
      {!!window.navigator.mediaDevices && (
        <IconButton
          aria-label="setup"
          color={panel === "setup" ? "secondary" : "inherit"}
          sx={{ borderRadius: "4px" }}
          onClick={() => togglePanel("setup")}
        >
          <MicIcon />
        </IconButton>
      )}
      {!!window.navigator.mediaDevices && (
        <IconButton
          aria-label="source data"
          color={panel === "signal" ? "secondary" : "inherit"}
          disabled={!device}
          sx={{ borderRadius: "4px" }}
          onClick={() => togglePanel("signal")}
        >
          <ShowChartIcon />
        </IconButton>
      )}

      <VisualizerMenu selected={visualizer} onSelect={handleVisualizerSelect} />

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
