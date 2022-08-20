import numpy as np

from madmom.audio.signal import SignalProcessor, FramedSignalProcessor
from madmom.audio.spectrogram import FilteredSpectrogramProcessor, LogarithmicSpectrogramProcessor, SpectrogramDifferenceProcessor
from madmom.audio.stft import ShortTimeFourierTransformProcessor
from madmom.processors import ParallelProcessor, SequentialProcessor


FILTER_FREQ_MIN = 20
FILTER_FREQ_MAX = 22000

class BeatNetFilterBank:
  '''
    BeatNet filter bank
    https://archives.ismir.net/ismir2021/paper/000033.pdf

    - Window function (Hann?)
    - STFT
    - Logarithmically spaced filter bank

  '''
  def __init__(
    self,
    sample_rate,
    window_length,
    window_hop_length,
    filter_bank_bands
  ):
    print(f'Processor | sample_rate: {sample_rate}')
    print(f'Processor | window_length: {window_length}')
    print(f'Processor | window_hop_length: {window_hop_length}')
    print(f'Processor | filter_bank_bands: {filter_bank_bands}')
    # self.sample_rate = sample_rate
    # self.window_length = window_length
    # self.window_hop_length = window_hop_length

    sig = SignalProcessor(sample_rate=sample_rate, num_channels=1, window_length=window_length)

    # Window function (Hann?)
    frame = FramedSignalProcessor(
      frame_size=window_length,
      hop_size=window_hop_length,
      num_frames=4
    )

    stft = ShortTimeFourierTransformProcessor()

    # Filter bank
    filt_spec = FilteredSpectrogramProcessor(
      num_bands=filter_bank_bands,
      fmin=FILTER_FREQ_MIN,
      fmax=FILTER_FREQ_MAX,
      norm_filters=True,
    )

    log_spec = LogarithmicSpectrogramProcessor(mul=1, add=1)
    spec_diff = SpectrogramDifferenceProcessor(diff_ratio=0.5, positive_diffs=True, stack_diffs=np.hstack)

    seq = SequentialProcessor([frame, stft, filt_spec, log_spec, spec_diff])
    pll = ParallelProcessor([])
    pll.append(seq)
    self.processor = SequentialProcessor((sig, pll, np.hstack))

  def process(self, data):
    # print(f'Filter | input: {data.shape}')
    output = self.processor(data)
    # print(f'Filter | output: {output.shape}')
    return output.T
