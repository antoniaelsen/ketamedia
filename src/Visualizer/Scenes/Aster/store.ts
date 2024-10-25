import { create } from "zustand";
import { OrbitControls } from "three-stdlib";
import { CONFIG } from "./config";
import { kSkycultureUrls } from "./api/stellarium";
import { DebugValue } from "types";

export interface AsterState {
  camera: THREE.Camera | null;
  controls: OrbitControls | null;
  setCamera: (
    camera: THREE.Camera | null,
    controls: OrbitControls | null
  ) => void;

  // Config
  orbiting: boolean;
  orbit_lock: boolean;
  orbit_wait_ms: number;
  traveling: boolean;
  skyculture: keyof typeof kSkycultureUrls;
  show_asterisms: boolean;
  show_asterism_nametags: boolean;
  show_grid: boolean;
  show_stars: boolean;
  show_star_nametags: boolean;
  scale_nametags: boolean;
  traveling_speed: number;

  setVariable: (key: string, value: DebugValue) => void;
}

export const useAsterStore = create<AsterState>((set) => ({
  camera: null,
  controls: null,

  setCamera: (camera: THREE.Camera | null, controls: any | null) =>
    set({ camera, controls }),

  // Config
  ...(Object.entries(CONFIG).reduce(
    (acc, [key, { initial }]) => ({ ...acc, [key]: initial }),
    {}
  ) as Omit<AsterState, "camera" | "controls" | "setCamera">),

  setVariable: (key: string, value: DebugValue) => set({ [key]: value }),
}));

export const useCamera = () => {
  const { camera, controls, setCamera } = useAsterStore((s) => ({
    camera: s.camera,
    controls: s.controls,
    setCamera: s.setCamera,
  }));

  return { camera, controls, setCamera };
};
