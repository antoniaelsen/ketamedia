import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F


class BDA(nn.Module):
  '''
    https://archives.ismir.net/ismir2021/paper/000033.pdf
  '''
  def __init__(self):
    super(BDA, self).__init__()
    pass

  def forward(self, input):
    pass

  def load(self, path: str):
    self.load_state_dict(torch.load(path), strict=False)
    self.train(False)