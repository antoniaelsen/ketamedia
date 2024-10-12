import {
  Scene as FlockingScene,
  DebugPanel as FlockingDebugPanel,
} from "./Scenes/Flocking";

export const VISUALIZERS: {
  [key: string]: { scene: React.ElementType; debug?: React.ElementType };
} = {
  flocking: { scene: FlockingScene, debug: FlockingDebugPanel },
};
