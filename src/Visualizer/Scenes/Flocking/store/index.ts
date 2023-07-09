import { create } from "zustand";
import { CONFIG } from "../config";

export interface FlockingState {
  alignment: number;
  alignment_radius: number;
  cohesion: number;
  cohesion_radius: number;
  containment: number;
  containment_radius: number;
  separation: number;
  separation_radius: number;
  velocity_damping: number;

  max_velocity: number;
  resting_velocity: number;

  n_boids: number;
}

export const useFlockingStore = create((set) => ({
  ...Object.entries(CONFIG).reduce(
    (acc, [key, { initial }]) => ({ ...acc, [key]: initial }),
    {}
  ),

  setVariable: (key: string, value: number) => set({ [key]: value }),
}));
