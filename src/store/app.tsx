import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  panels: Record<string, boolean>;
  visualizer: string | null;

  togglePanel: (panels: string) => void;
}

export const useAppStore = create(
  persist(
    (set): AppState => ({
      panels: {},
      visualizer: "flocking",

      togglePanel: (panel: string) => {
        set((state: AppState) => {
          const toggled = !!state.panels[panel];

          return {
            ...state,
            panels: {
              ...state.panels,
              [panel]: !toggled,
            },
          };
        });
      },
    }),
    {
      name: "app-storage",
    }
  )
);
