import {
  Scene as FlockingScene,
  DebugPanel as FlockingDebugPanel,
} from "./Scenes/Flocking";
import {
  Scene as GalaxyScene,
  DebugPanel as GalaxyDebugPanel,
} from "./Scenes/Aster";

export const VISUALIZERS: {
  [key: string]: { scene: React.ElementType; debug?: React.ElementType };
} = {
  aster: { scene: GalaxyScene, debug: GalaxyDebugPanel },
  flocking: { scene: FlockingScene, debug: FlockingDebugPanel },
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
