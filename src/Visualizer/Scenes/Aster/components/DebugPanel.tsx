import { CONFIG } from "../config";
import { DebugPanel as BaseDebugPanel } from "../../../../components/DebugPanel";
import { useGalaxyStore } from "../store";

export const DebugPanel = () => {
  const state = useGalaxyStore((state) => state);

  return (
    <BaseDebugPanel
      config={CONFIG}
      state={state as any}
      setVariable={state.setVariable}
    />
  );
};
