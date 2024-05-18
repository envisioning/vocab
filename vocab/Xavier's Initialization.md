---
title: Xavier's Initialization
summary: Weight initialization technique designed to keep the variance of the outputs of a neuron approximately equal to the variance of its inputs across layers in a deep neural network.
---
Xavier's initialization addresses the problem of vanishing and exploding gradients in deep neural networks by maintaining a balance in the variance of the activations and gradients throughout the network. This method sets the initial weights of the network by drawing them from a distribution with zero mean and a specific variance that depends on the number of input and output neurons. The variance is typically set as the reciprocal of the average of the number of input and output units for each layer, ensuring that the signal neither diminishes nor becomes too large as it propagates forward through the layers during training. This method is crucial for effective learning in deep networks, especially when using activation functions like hyperbolic tangent (tanh) or logistic sigmoid.

Historical overview:
Xavier's initialization was introduced in 2010 by Xavier Glorot and Yoshua Bengio in their paper discussing the difficulties of training deep architectures and how traditional initialization methods were inadequate for deep networks. The technique quickly gained popularity due to its effectiveness in improving the training of deep neural networks.

Key contributors:
The method is named after Xavier Glorot, who, along with Yoshua Bengio, pioneered this approach. Their collaborative work, particularly in the context of understanding and addressing the challenges in training deep neural networks, was foundational in developing practical techniques for effective deep learning.