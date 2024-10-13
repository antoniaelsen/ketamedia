import {
  Scene as FlockingScene,
  DebugPanel as FlockingDebugPanel,
} from "./Scenes/Flocking";
import {
  Scene as GalaxyScene,
  DebugPanel as GalaxyDebugPanel,
} from "./Scenes/Galaxy";

export const VISUALIZERS: {
  [key: string]: { scene: React.ElementType; debug?: React.ElementType };
} = {
  flocking: { scene: FlockingScene, debug: FlockingDebugPanel },
  galaxy: { scene: GalaxyScene, debug: GalaxyDebugPanel },
};

export type VisualizerKey = keyof typeof VISUALIZERS;
