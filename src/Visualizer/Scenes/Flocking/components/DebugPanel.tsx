import { CONFIG } from "../config";
import { DebugPanel as BaseDebugPanel } from "../../../../components/DebugPanel";
import { useFlockingStore } from "../store";

export const DebugPanel = () => {
  const state = useFlockingStore((state) => state);

  return (
    <BaseDebugPanel
      config={CONFIG}
      state={state as any}
      setVariable={state.setVariable}
    />
  );
};
