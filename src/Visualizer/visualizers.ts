import React from "react";
import { DebugPanel as AsterDebugPanel } from "./Scenes/Aster/components/DebugPanel";
import { DebugPanel as FlockingDebugPanel } from "./Scenes/Flocking/components/DebugPanel";
const AsterScene = React.lazy(() => import("./Scenes/Aster"));
const FlockingScene = React.lazy(() => import("./Scenes/Flocking"));

export const VISUALIZERS: {
  [key: string]: {
    scene: React.ElementType;
    debug?: React.ElementType;
    desktopOnly?: boolean;
  };
} = {
  aster: {
    scene: AsterScene,
    debug: AsterDebugPanel,
    desktopOnly: true,
  },
  flocking: {
    scene: FlockingScene,
    debug: FlockingDebugPanel,
  },
};

export const getVisualizer = (
  key: VisualizerKey | null
): { scene: React.ElementType; debug?: React.ElementType } => {
  if (!key || !VISUALIZERS[key]) {
    return { scene: FlockingScene, debug: FlockingDebugPanel };
  }

  return VISUALIZERS[key];
};

export type VisualizerKey = keyof typeof VISUALIZERS;
