import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppState {
  panel: string | null;
  visualizer: string | null;

  togglePanel: (panel: string | null) => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set): AppState => ({
      panel: null,
      visualizer: "flocking",

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
