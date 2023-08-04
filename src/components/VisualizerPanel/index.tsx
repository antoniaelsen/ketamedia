import { DragPanel } from "../DragPanel";
import { useAppStore } from "../../store/app";
import { VISUALIZERS } from "../../Visualizer/visualizers";

export const VisualizerPanel = () => {
  const visualizer = useAppStore((state: any) => state.visualizer);

  const Component = VISUALIZERS[visualizer]?.debug;
  if (!Component) return null;

  return (
    <DragPanel name="Visualizer">
      <Component />
    </DragPanel>
  );
};
