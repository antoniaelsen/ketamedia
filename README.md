# ketamedia

Super stationary images


## Beat and downbeat estimation with BeatNet algorithm

[BeatNet: CRNN and Particle Filtering for Online Joint Beat, Downbeat and Meter Tracking](https://archives.ismir.net/ismir2021/paper/000033.pdf)

[source](https://github.com/mjhydri/BeatNet)

This app re-implements the BeatNet algorithm.

The BeatNet algorithm consists of multiple stages.
- The first stage produces responses from a multi-process filter bank.
- The second stage infers beat, downbeat andn non-beat activations with a CRNN.
- The third stage infers beat and downbeat positions, as well as meter, with a MC particle filter.


Notes:
  - Hann window hop sizes: https://ccrma.stanford.edu/~jos/parshl/Choice_Hop_Size.html
