import { create } from "zustand";
import { CONFIG } from "../config";

export interface FlockingState {
  n_boids: number;

  fpv_camera: boolean;
  sweep: boolean;

  max_velocity: number;
  alignment: number;
  alignment_radius: number;
  cohesion: number;
  cohesion_radius: number;
  separation: number;
  separation_radius: number;

  gravity_position: [number, number, number];
  gravity_magnitude: number;
  gravity_radius: number;

  dispersion_enabled: boolean;
  dispersion_radius: number;

  debug: boolean;

  setVariable: (key: string, value: number | number[] | boolean) => void;
}

export const useFlockingStore = create<FlockingState>((set) => ({
  ...(Object.entries(CONFIG).reduce(
    (acc, [key, { initial }]) => ({ ...acc, [key]: initial }),
    {}
  ) as FlockingState),

  setVariable: (key: string, value: number | number[] | boolean) =>
    set({ [key]: value }),
}));
