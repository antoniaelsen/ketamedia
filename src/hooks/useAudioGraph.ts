import { useAudioStore } from "../store/audio";
import BeatDetectionNode from "../audio/node";
import workletURL from "./worklet.ts?url";

export const setup = async (device: MediaDeviceInfo) => {
  const { deviceId } = device;
  const ctx = new AudioContext();

  const stream = await window.navigator.mediaDevices.getUserMedia({
    audio: { deviceId },
    video: false,
  });

  const source = ctx.createMediaStreamSource(stream);

  // // Beat Detection Node
  // await ctx.audioWorklet.addModule(workletURL);
  // const beat = new BeatDetectionNode(ctx, "BeatDetection");

  // Analyzer
  const analyser = ctx.createAnalyser();
  analyser.fftSize = Math.pow(2, 10);
  analyser.minDecibels = -100;
  analyser.maxDecibels = -10;

  // Graph
  source.connect(analyser);
  // source.connect(beat);

  return {
    nodes: {
      analyser,
      // beat,
    },
  };
};

export const useAudioGraph = () => {
  const device = useAudioStore((s: any) => s.device);
  const setNodes = useAudioStore((s: any) => s.setNodes);
  // TODO(antoniae): update audio graph when device changes

  if (!device) return;

  setup(device).then(({ nodes }) => {
    setNodes(nodes);
  });
};
