from .sampler import Sampler
from .models.bda import BDA
from .filters.beatnet_filter_bank import BeatNetFilterBank
# from BeatNet.BeatNet import BeatNet

class Processor:
  def __init__(self):
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
    self.model = None

    self.window_length_ms = 93 # Hann window length
    self.window_hop_length_ms = self.window_length / 2 # Hann window hop -- recommended 25% of window for 75% overlap
    self.filter_bank_bands = 24;

  
  def process(self):
    # Apply BeatNet filter bank
    # CRNN
    # Monte-Carlo particle filtering
    pass


class Analyzer:
  def __init__(self):
    # self._analyzer = Sampler()
    # self._processor = Processor()
    pass

  def run(self):
    # self._analyzer.run()
    pass
