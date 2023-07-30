export default class BeatDetectionNode extends AudioWorkletNode {
  constructor(context: AudioContext, name: string) {
    super(context, name);
    this.port.onmessage = (event) => this.onmessage(event.data);
    this.init();
  }

  async init() {
    await this.loadWASM();
  }

  async loadWASM() {
    const origin = window.location.origin;
    const input = new URL("ketamedia/pkg/ketamedia_bg.wasm", origin);
    const response = await fetch(input);
    const bytes = await response.arrayBuffer();

    this.port.postMessage({
      type: "init",
      payload: { bytes },
    });
  }

  // Handle an uncaught exception thrown in the PitchProcessor.
  onprocessorerror(event) {
    console.error(event);
  }

  onmessage(event: MessageEvent) {}
}
