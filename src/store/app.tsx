import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  panel: string | null;
  visualizer: string | null;
}

export const useAppStore = create(
  persist(
    (set) => ({
      panel: null,
      visualizer: null,

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
