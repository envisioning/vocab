---
title: Variance Scaling  
summary: Variance scaling is a technique used in machine learning to ensure weights of layers are initialized in a way that maintains consistent variance of activations throughout a neural network.
slug: variance-scaling
---  

Variance scaling is crucial in the initialization process of neural network weights, which directly affects the convergence and performance of deep learning models. By appropriately scaling the variances of weights in neural networks, variance scaling aims to prevent issues such as the vanishing or exploding gradient problem, thus helping stabilize the training process. Techniques like He initialization and Xavier/Glorot initialization are specific implementations of variance scaling strategies. These approaches distribute initial weights such that the variance remains consistent from layer to layer, allowing gradients to propagate effectively during backpropagation. This is especially significant in deep networks where incorrect initialization could either lead to exponentially diminishing or increasing gradients, rendering learning difficult or altogether ineffective.

This term was conceptualized and came into use around the late 2000s and became popular with the rise of deep learning frameworks in the early 2010s, as researchers sought to overcome challenges associated with deep neural network training stability.

Key contributors to variance scaling include Yann LeCun, Xavier Glorot, and Yoshua Bengio, who played significant roles in developing and popularizing initialization techniques such as LeCun, Glorot (Xavier), and He initializations, respectively. Their work fundamentally contributed to the practical application and theoretical understanding of effective weight initialization in deep learning architectures.