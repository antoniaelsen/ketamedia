import "./polyfills/TextEncoder";
import init, { rust_log } from "../../ketamedia/pkg/ketamedia";

class BeatDetectionProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.port.onmessage = (event) => {
      const { data } = event;
      const { payload, type } = data;
      console.log("Worklet | Received message", data);

      switch (type) {
        case "init":
          this.initWASM(payload.bytes);
          break;

        default:
          break;
      }
    };
  }

  async initWASM(bytes: ArrayBuffer) {
    const compiled = await WebAssembly.compile(bytes);
    await init(compiled);
  }

  process(inputs, outputs) {

    return true;
  }
}

registerProcessor("BeatDetection", BeatDetectionProcessor);
