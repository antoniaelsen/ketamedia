import BeatDetectionNode from "./node";
import workletURL from "./worklet.ts?url";

export const setup = async () => {
  const ctx = new AudioContext();

  // console.log("Setup | Worklet URL", workletURL);

  await ctx.audioWorklet.addModule(workletURL);
  const node = new BeatDetectionNode(ctx, "BeatDetection");

  // source.connect(node);
  node.connect(ctx.destination);
};
