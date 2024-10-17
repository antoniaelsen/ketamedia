import { Box, BoxProps } from "@mui/material";
import { ErrorBoundary, ErrorText } from "components/ErrorBoundary";
import { useAppStore } from "../store/app";
import { getVisualizer } from "./visualizers";
import { Suspense } from "react";
import { LoadingSpinner } from "components/LoadingSpinner";

export const Visualizer = (props: BoxProps) => {
  const visualizer = useAppStore((state) => state.visualizer);
  console.log("Visualizer:", visualizer);

  const { scene: Scene } = getVisualizer(visualizer);

  return (
    <Box
      sx={{ height: "100%", position: "relative" }}
      {...props}
      component="div"
    >
      <ErrorBoundary
        fallback={
          <ErrorText title="oh no" subtitle="does your device support webgl?" />
        }
      >
        <Suspense
          fallback={
            <LoadingSpinner
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
              }}
            />
          }
        >
          <Scene />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};
