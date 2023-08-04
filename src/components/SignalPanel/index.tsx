import { Graph } from "./Graph";
import { DragPanel } from "../DragPanel";

export const SignalPanel = () => {
  return (
    <DragPanel name="Signal" sx={{ minWidth: "480px" }}>
      <Graph />
    </DragPanel>
  );
};
