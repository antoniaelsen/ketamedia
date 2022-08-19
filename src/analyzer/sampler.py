import numpy as np
import pyaudio
from typing import Callable

Callback = Callable[[np.float32], None]

SAMPLE_RATE = 44100
SAMPLE_FRAME_COUNT = 1024

class Sampler:
  def __init__(self, sample_rate, buffer_size):
    self.i = 0
    self.running = False
    self.sample_rate = sample_rate
    self.buffer_size = buffer_size
    print(f'Sampler | Sample rate:              {self.sample_rate}')
    print(f'Sampler | Buffer size:              {self.buffer_size}')

    self.stream = pyaudio.PyAudio().open(
      channels=1,
      format=pyaudio.paFloat32,
      input=True,
      frames_per_buffer=self.buffer_size,
      rate=self.sample_rate,
    )

  def capture_stream(self, window_length, cb: Callback):
    chunk = self.stream.read(window_length, exception_on_overflow=False)
    chunk = np.frombuffer(chunk, dtype=np.float32)
    cb(chunk)

