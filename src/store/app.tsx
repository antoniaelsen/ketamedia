import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VisualizerKey } from "../Visualizer/visualizers";

export interface AppState {
  panel: string | null;
  visualizer: VisualizerKey | null;

  togglePanel: (panel: string | null) => void;
  toggleVisualizer: (visualizer: VisualizerKey) => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set): AppState => ({
      panel: null,
      visualizer: "flocking",

      toggleVisualizer: (visualizer: VisualizerKey) => {
        set(() => ({
          visualizer,
        }));
      },

      togglePanel: (panel: string | null) => {
        set((state: AppState) => {
          if (state.panel === panel) {
            return {
              panel: null,
            };
          }

          return {
            panel,
          };
        });
      },
    }),
    {
      name: "app-storage",
    }
  )
);
