import {
  Scene as FlockingScene,
  DebugPanel as FlockingDebugPanel,
} from "./Scenes/Flocking";
import {
  Scene as GalaxyScene,
  DebugPanel as GalaxyDebugPanel,
} from "./Scenes/Aster";
import { getIsMobile } from "util/hooks/use-is-mobile";

export const VISUALIZERS: {
  [key: string]: {
    scene: React.ElementType;
    debug?: React.ElementType;
    desktopOnly?: boolean;
  };
} = {
  aster: { scene: GalaxyScene, debug: GalaxyDebugPanel, desktopOnly: true },
  flocking: { scene: FlockingScene, debug: FlockingDebugPanel },
};

export const getVisualizer = (
  key: VisualizerKey | null
): { scene: React.ElementType; debug?: React.ElementType } => {
  if (!key || !VISUALIZERS[key]) {
    return { scene: FlockingScene, debug: FlockingDebugPanel };
  }

  const vis = VISUALIZERS[key];
  if (vis.desktopOnly && getIsMobile()) {
    return { scene: FlockingScene, debug: FlockingDebugPanel };
  }

  return vis;
};

export type VisualizerKey = keyof typeof VISUALIZERS;
