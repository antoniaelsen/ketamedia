import numpy as np
import pyaudio
from typing import Callable

Callback = Callable[[np.float32], None]

SAMPLE_RATE = 44100
SAMPLE_FRAME_COUNT = 1024

class Sampler:
  def __init__(self):
    self._i = 0
    self._running = False
    self._sample_rate = SAMPLE_RATE
    self._sample_frame_count = SAMPLE_FRAME_COUNT
    print(f'Sampler | Created audio analyzer')
    print(f'Sampler | Sample rate:            {self.sample_rate}')
    print(f'Sampler | Sample length:          {self.sample_length}')

    self._stream_window = np.zeros(self.sample_frame_count, dtype=np.float32)  
    self._stream = pyaudio.PyAudio().open(
      channels=1,
      format=pyaudio.paFloat32,
      input=True,
      frames_per_buffer=self.sample_frame_count,
      rate=self.sample_rate,
    )

  def capture_stream(self, cb: Callback):
    print(f'Sampler | Capturing stream')
    chunk = self.stream.read(self._sample_frame_count)
    chunk = np.frombuffer(chunk, dtype=np.float32)
    cb(chunk)

  def run(self, cb: Callback):
    if (not cb):
      return False

    self._running = True
    while self._running:
      self.capture_stream(cb)
      self._i += 1

  def stop(self, cb: Callback):
    self._running = False
    self._i == 0
