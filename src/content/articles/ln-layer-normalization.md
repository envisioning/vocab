---
generality:
- 0.765
- 0.74
- 0.715
- 0.69
- 0.665
- 0.64
- 0.615
slug: ln-layer-normalization
summary: Technique in deep learning that standardizes the inputs of each layer independently,
  improving the stability of the neural network.
title: LN (Layer Normalization)
year_origin: 2016
---

Layer Normalization (LN) is an effective technique employed in deep learning to improve the stability of the neural network. The method works by applying a normalization step during training that standardizes the inputs for each neuron in a layer, independently of batch size. This is helpful in mitigating problems associated with training such as scale sensitivity and vanishing/exploding gradients. For Recurrent Neural Networks (RNNs), LN is particularly beneficial as it helps in handling varying sequence length and reducing the dependency on larger batch sizes.

Layer Normalization was introduced in a paper titled "Layer Normalization" by Jimmy Lei Ba, Jamie Ryan Kiros, and Geoffrey Everest Hinton in 2016. The technique quickly gained popularity in deep learning community due to its effectiveness in stabilizing training and reducing the dependency on batch size.

The concept of Layer Normalization was conceptualized and first introduced by Jimmy Lei Ba, Jamie Ryan Kiros, and Geoffrey Everest Hinton. Geoffrey Hinton, particularly, is widely regarded as one of the leading figures in the field of AI, credited with several key developments in the area of deep learning.