import {
  Scene as FlockingScene,
  DebugPanel as FlockingDebugPanel,
} from "./Scenes/Flocking";

export const VISUALIZERS: { [key: string]: any } = {
  flocking: { scene: FlockingScene, debug: FlockingDebugPanel },
};
