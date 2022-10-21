import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as func


class BdaCrnn(nn.Module):
  '''
    https://archives.ismir.net/ismir2021/paper/000033.pdf
  '''
  def __init__(self, input_size, layers_size, cells_size, hidden_size):
    super(BDA, self).__init__()
    self.device = torch.device('cpu')

    self.input_size = input_size
    self.layers_size = layers_size
    self.cells_size = cells_size
    self.hidden_size = hidden_size

    self.kernel_size = 10
    self.dimm_out_1 = 150
    self.dimm_out_2 = 3

    self.convolution_1d = nn.Conv1d(1, 2, self.kernel_size)
    self.linear_1d_1 = nn.Linear(
      in_features=(2 * int((self.input_size - self.kernel_size + 1) / 2)),  # Divided by 2 for max pooling
      out_features=self.dimm_out_1
    )   
    self.lstm = nn.LSTM(
      batch_first=True,
      bidirectional=False,
      input_size=self.dimm_out_1,
      hidden_size=self.hidden_size,
      num_layers=self.layers_size,
    )
    self.linear_1d_2 = nn.Linear(
      in_features=self.hidden_size, 
      out_features=self.dimm_out_2
    )
    self.softmax = nn.Softmax(dim=0)


  def forward(self, data):
    x = data
    x = torch.reshape(x, (-1, self.input_size))
    x = x.unsqueeze(0).transpose(0, 1)

    x = self.convolution_1d(x)                  # 1D convolutional layer
    x = func.relu(x)                            # ReLU activation
    x = func.max_pool1d(x, 2)                   # Max pooling
  
    x = x.view(-1, self.num_flat_features(x))   # Single feature embedding per frame
  
    x = self.linear_1d_1(x)                     # 1D layer - Reduce dimensions
    x = torch.reshape(x, (np.shape(data)[0], np.shape(data)[1], self.dimm_out_1))
    x, (self.hidden, self.cell) = self.lstm(x, (self.hidden, self.cell))

    # x = self.lstm(x)[0]
    x = self.linear_1d_2(x)                     # 1D layer - Reduce dimensions
    x = x.transpose(1, 2)
    x = self.softmax(x)

    return x

  def num_flat_features(self, x):
    size = x.size()[1:]                         # All dimensions except the batch dimension
    num_features = 1
    for s in size:
        num_features *= s
    return num_features

  def load(self, path: str):
    self.load_state_dict(torch.load(path), strict=False)
    self.train(False)