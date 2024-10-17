import { create } from "zustand";
import { CONFIG } from "./config";

export interface GalaxyState {
  show_asterisms: boolean;
  show_nametags: boolean;
  scale_nametags: boolean;

  setVariable: (key: string, value: number | number[] | boolean) => void;
}

export const useGalaxyStore = create<GalaxyState>((set) => ({
  ...(Object.entries(CONFIG).reduce(
    (acc, [key, { initial }]) => ({ ...acc, [key]: initial }),
    {}
  ) as GalaxyState),

  setVariable: (key: string, value: number | number[] | boolean) =>
    set({ [key]: value }),
}));
