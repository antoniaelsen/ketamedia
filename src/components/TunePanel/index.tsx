import { DragPanel } from "../DragPanel";
import { useAppStore } from "../../store/app";
import { VISUALIZERS } from "../../Visualizer/visualizers";

export const TunePanel = () => {
  const visualizer = useAppStore((state: any) => state.visualizer);

  const Component = VISUALIZERS[visualizer]?.debug || null;
  return (
    <DragPanel name="Visualizer">
      <Component />
    </DragPanel>
  );
};
