import {
  Scene as FlockingScene,
  DebugPanel as FlockingDebugPanel,
} from "./Scenes/Flocking";
import {
  Scene as VideoScene,
  DebugPanel as VideoDebugPanel,
} from "./Scenes/Video";

export const VISUALIZERS: { [key: string]: any } = {
  flocking: { scene: FlockingScene, debug: FlockingDebugPanel },
  video: { scene: VideoScene, debug: VideoDebugPanel },
};
