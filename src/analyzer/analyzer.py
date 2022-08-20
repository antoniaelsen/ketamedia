import datetime
import math
import numpy as np
import torch
from matplotlib import pyplot as plt

from .models.bda_crnn.model import BdaCrnn
from .sampler import Sampler
from .filters.beatnet_filter_bank import BeatNetFilterBank


PLOT = True
if (PLOT):
  plt.ion()
  plt.figure()
  plt.show()

def plot(data):
  plt.clf()
  plt.subplot(211)
  plt.plot(data[0], 'r-')
  plt.ylim(-0.25, 0.25)
  plt.subplot(212)
  plt.plot(data[1], 'r-')
  plt.draw()
  plt.ylim(0, 1)
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
    self.model = BdaCrnn(
      input_size=272,
      layers_size=2,
      cells_size=150,
      hidden_size=150
    )

  def process(self, data):
    # Apply BeatNet filter bank
    # print(f'Processor | Filter input: {data.shape}')
    features = self.filter.process(data).T[-1]
    if (PLOT):
      plot([data, features])
    # print(f'Processor | Filter output transpose -1: {features.shape}')

    features = torch.from_numpy(features)
    features = features.unsqueeze(0).unsqueeze(0)
    # print(f'Processor | Unsqueezed: {features.shape}')

    # CRNN
    prediction = self.model(features)[0]
    prediction = np.transpose(prediction.detach().numpy()[:2, :])

    # Monte-Carlo particle filtering
    detections = self.estimator.process(prediction)
    return features


class Analyzer:
  '''
    Notes:
      - Hann window hop sizes: https://ccrma.stanford.edu/~jos/parshl/Choice_Hop_Size.html
  '''
  def __init__(self):
    self.sample_rate = 44100
    self.window_length_ms = 100
    self.window_hop_length_ms = self.window_length_ms / 4 # Hann window hop -- recommended 25% of window for 75% overlap

    self.window_length = math.ceil((self.window_length_ms / 1000.0) * self.sample_rate)
    self.window_hop_length = math.ceil((self.window_hop_length_ms / 1000.0) * self.sample_rate)

    stream_window_length = self.window_length + (2* self.window_hop_length)
    self.stream_window = np.zeros(stream_window_length, dtype=np.float32)

    print(f'Analyzer | sample_rate:             {self.sample_rate}')
    print(f'Analyzer | window_length:           {self.window_length}')
    print(f'Analyzer | window_hop_length:       {self.window_hop_length}')
    print(f'Analyzer | stream_window_length:    {stream_window_length}')

    self.sampler = Sampler(sample_rate=self.sample_rate, buffer_size=self.window_hop_length)
    self.processor = Processor(
      sample_rate=self.sample_rate,
      window_length=self.window_length,
      window_hop_length=self.window_hop_length
    )

    self.data = np.array([], dtype=np.float32)
    self.feats = np.array([], dtype=np.float32)

  def run(self):
    # Debug
    target_length_ms = 10000
    iterations = math.ceil(target_length_ms / self.window_hop_length_ms)

    def cb(data):
      self.data = np.append(self.data, data)
      self.stream_window = np.append(self.stream_window[self.window_hop_length:], data)
      feats = self.processor.process(self.stream_window)
      self.feats = np.append(self.feats, feats);

    self.i = 0
    self.running = True
    print(f'Analyzer | Run - start {datetime.datetime.now()} - time {target_length_ms / 1000} ms, iterations {iterations}')
    while self.running:
      self.sampler.capture_stream(self.window_hop_length, cb)
      self.i += 1

      if (self.i >= iterations):
        self.stop()

    print(f'Analyzer | Run - end {datetime.datetime.now()}')

  def stop(self):
    print(f'Analyzer | Stop')
    self.running = False
    self.i == 0
