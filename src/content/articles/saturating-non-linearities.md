---
slug: saturating-non-linearities
summary: Activation functions in neural networks that reach a point where their output changes very little, or not at all, in response to large input values.
title: Saturating Non-Linearities
---

In neural networks, non-linear activation functions like the sigmoid or hyperbolic tangent (tanh) are called "saturating" because their output flattens as the input grows beyond certain thresholds. For instance, the sigmoid function saturates near 0 and 1, while tanh saturates near -1 and 1. This flattening, or saturation, can impede learning by diminishing the gradient in backpropagation, leading to the "vanishing gradient problem." As a result, early layers of deep networks fail to update effectively, slowing down or preventing convergence. While saturating non-linearities were commonly used in early neural networks, functions like ReLU (Rectified Linear Unit) and its variants are preferred today because they avoid this saturation issue.

Saturating non-linearities, particularly the sigmoid function, were integral to early neural network models in the 1980s and 1990s. However, their limitations became more evident as deeper networks gained popularity around the early 2010s, leading to the adoption of alternatives like ReLU.

Geoffrey Hinton and Yann LeCun were among the pioneers who popularized the use of sigmoid and tanh functions in early neural networks. However, more recent figures such as Yann LeCun and the team behind AlexNet (2012) were influential in moving the field towards non-saturating functions like ReLU.
