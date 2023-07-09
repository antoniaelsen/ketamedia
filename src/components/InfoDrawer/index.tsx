import { Box, Drawer } from "@mui/material";
import { useAppStore } from "../../store/app";
import { SetupPanel } from "../SetupPanel";
import { SignalPanel } from "../SignalPanel";

export const InfoDrawer = ({ children }: { children?: React.ReactNode }) => {
  const panel = useAppStore((state: any) => state.panel);

  return (
    <Drawer
      anchor="bottom"
      variant="persistent"
      open={!!panel}
      sx={(theme) => ({
        "& .MuiDrawer-paper": {
          background: "transparent",
          bottom: theme.spacing(8),
        },
      })}
    >
      <Box p={2} sx={{ backdropFilter: "blur(5px)" }}>
        {children}

        {panel === "setup" && <SetupPanel />}

        {panel === "signal" && <SignalPanel />}
      </Box>
    </Drawer>
  );
};
