import { create } from "zustand";

export interface AudioState {
  device: MediaDeviceInfo | null;
  nodes: { [key: string]: AudioNode };

  setDevice: (device: MediaDeviceInfo) => void;
}

export const useAudioStore = create((set) => ({
  device: null,
  nodes: {},

  setDevice: (device: MediaDeviceInfo) => set({ device }),
  setNodes: (nodes: { [key: string]: AudioNode }) => set({ nodes }),
}));
