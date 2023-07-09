import { CONFIG } from "../config";
import { DebugPanel as BaseDebugPanel } from "../../../../components/DebugPanel";
import { useFlockingStore } from "../store";

export const DebugPanel = () => {
  const state = useFlockingStore((state: any) => state);

  return (
    <BaseDebugPanel
      config={CONFIG}
      state={state}
      setVariable={state.setVariable}
    />
  );
};
