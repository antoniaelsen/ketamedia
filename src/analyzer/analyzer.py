import math
import numpy as np
from matplotlib import pyplot as plt

from .sampler import SAMPLE_RATE, Sampler
from .filters.beatnet_filter_bank import BeatNetFilterBank
# from .models.bda import BDA


PLOT = True


if (PLOT):
  plt.ion()
  plt.figure()
  plt.show()

def plot(data):
  plt.clf()
  plt.subplot(211)
  plt.plot(data[0], 'r-')
  plt.subplot(212)
  plt.plot(data[1], 'r-')
  plt.draw()
  plt.pause(0.0001)


class Processor:
  def __init__(self, sample_rate, window_length, window_hop_length):
    '''
      BeatNet algorithm
      Paper: https://archives.ismir.net/ismir2021/paper/000033.pdf
      Original implementation: https://github.com/mjhydri/BeatNet

      The BeatNet algorithm consists of multiple stages.
      - The first stage produces responses from a multi-process filter bank.
      - The second stage infers beat, downbeat andn non-beat activations with a CRNN.
      - The third stage infers beat and downbeat positions, as well as meter, with a MC particle filter.


      Notes:
       - Hann window hop sizes: https://ccrma.stanford.edu/~jos/parshl/Choice_Hop_Size.html
    '''
    self.sample_rate = sample_rate
    self.window_length = window_length
    self.window_hop_length = window_hop_length
    self.filter_bank_bands = 24;

    self.filter = BeatNetFilterBank(
      sample_rate=self.sample_rate,
      window_length=self.window_length,
      window_hop_length=self.window_hop_length,
      filter_bank_bands=self.filter_bank_bands
    )
    self.model = None


  def process(self, input):
    # Apply BeatNet filter bank
    print(f'Input: {len(input)}')
    filtered = self.filter.process(input)
    print(f'Filtered: {len(filtered)}')

    if (PLOT):
      plot([input, filtered])
    # CRNN
    # Monte-Carlo particle filtering
    pass


class Analyzer:
  def __init__(self):
    self.sample_rate = SAMPLE_RATE
    self.window_length_ms = 100
    self.window_hop_length_ms = self.window_length_ms / 4 # Hann window hop -- recommended 25% of window for 75% overlap

    self.window_length = math.ceil((self.window_length_ms / 1000.0) * self.sample_rate)
    self.window_hop_length = math.ceil((self.window_hop_length_ms / 1000.0) * self.sample_rate)

    stream_window_length = self.window_length + (2* self.window_hop_length)
    self.stream_window = np.zeros(stream_window_length, dtype=np.float32)

    print(f'Analyzer | sample_rate:             {self.sample_rate}')
    print(f'Analyzer | window_length:           {self.window_length}')
    print(f'Analyzer | window_hop_length:    {self.window_hop_length}')
    print(f'Analyzer | stream_window_length:    {stream_window_length}')

    self.sampler = Sampler(sample_rate=self.sample_rate, buffer_size=self.window_hop_length)
    self.processor = Processor(
      sample_rate=self.sample_rate,
      window_length=self.window_length,
      window_hop_length=self.window_hop_length
    )

    self.data = np.array([], dtype=np.float32)


  def run(self):
    print(f'Analyzer | Run')

    # Debug
    target_length_ms = 10000
    iterations = math.ceil(target_length_ms / self.window_length_ms)

    self.i = 0

    def cb(data):
      self.data = np.append(self.data, data)
      self.stream_window = np.append(self.stream_window[self.window_hop_length:], data)
      self.processor.process(self.stream_window)


    self.running = True
    while self.running:
      self.sampler.capture_stream(self.window_hop_length, cb)
      self.i += 1

      if (self.i >= iterations):
        self.stop()
        print(f'Analyzer | Data for {target_length_ms} ms: {len(self.data)}')

  def stop(self):
    print(f'Analyzer | Stop')
    self.running = False
    self.i == 0
