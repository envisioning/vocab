---
title: ADAM (Adaptive Moment Estimation)
summary: Algorithm for gradient-based optimization of stochastic objective functions, widely used in training DL models.
---
ADAM, an acronym for "Adaptive Moment Estimation," is a method that computes adaptive learning rates for each parameter. It combines the advantages of two other extensions of stochastic gradient descent: AdaGrad, which works well with sparse gradients, and RMSProp, which handles non-stationary objectives effectively. ADAM stores an exponentially decaying average of past squared gradients (v) and an exponentially decaying average of past gradients (m). These moments are estimates of the first (the mean) and second (the uncentered variance) moments of the gradients. The optimizer then uses these moments to update the model weights in a way that is particularly effective across many different types of machine learning problems and architectures, contributing to its popularity in the field.

Historical Overview:
ADAM was introduced in 2014 by Diederik P. Kingma and Jimmy Ba. It quickly became popular due to its robust performance across a variety of neural network architectures and its ability to handle sparse gradients, making it particularly useful in natural language processing and computer vision tasks.

Key Contributors:
Diederik P. Kingma and Jimmy Ba are the principal developers of the ADAM optimizer. Their work provided a significant boost to the efficiency and effectiveness of training deep neural networks, influencing a wide array of AI applications and research.