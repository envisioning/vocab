---
title: Straight-Through Estimator
summary: Technique used in training neural networks to enable the backpropagation of gradients through non-differentiable functions or operations.
---
The straight-through estimator (STE) is a method primarily used for handling non-differentiable operations within neural networks during the backpropagation process. Typically, neural network training relies on the differentiability of activation functions to compute gradients and update weights. However, certain functions like the threshold function or operations involving discrete values are inherently non-differentiable. The STE tackles this by simply passing the gradient from the output directly to the input, essentially 'ignoring' the non-differentiability of the function. This allows for effective training of models incorporating discrete elements or hard non-linearities, such as binary neural networks where neurons output discrete values instead of continuous activations.

Historical overview:
The concept of the straight-through estimator emerged around the early 2010s as researchers explored training methods for networks involving discrete decisions. It gained notable attention around 2013 with its application in the training of binary neural networks and other architectures where traditional backpropagation was not feasible due to non-differentiable operations.

Key contributors:
Yoshua Bengio and his colleagues at the University of Montreal were instrumental in popularizing the straight-through estimator through their work on neural networks and deep learning. Their research explored various aspects of deep learning, including the challenges of training networks with non-differentiable components, significantly contributing to the development and understanding of STE.

