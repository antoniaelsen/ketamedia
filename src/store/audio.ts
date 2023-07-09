import { create } from "zustand";

export interface AudioState {
  device: MediaDeviceInfo | null;
  setDevice: (device: MediaDeviceInfo) => void;
}

export const useAudioStore = create((set) => ({
  device: null,

  setDevice: (device: MediaDeviceInfo) => set({ device }),
}));
