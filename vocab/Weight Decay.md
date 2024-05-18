---
title: "Weight Decay"
summary: "Regularization technique used in training neural networks to prevent overfitting by penalizing large weights."
---
Weight decay works by adding a penalty term to the loss function used to train a neural network. This penalty term is proportional to the sum of the squares of the weights of the network, encouraging the learning algorithm to keep the weights small. This approach is particularly effective in combating overfitting, a common problem where a model learns the noise in the training data too well, negatively impacting its performance on unseen data. By keeping the weights small, weight decay limits the complexity of the model, helping to improve its generalization capabilities. It's a foundational technique in machine learning and deep learning, applicable across various types of neural networks, including convolutional and recurrent neural networks.

The concept of weight decay has been integral to neural network training since the late 1980s and early 1990s, becoming widely recognized and adopted as a standard regularization technique. Its roots are in the broader field of ridge regression in statistics, which was developed in the 1970s.

Key contributors to the development and popularization of weight decay include Geoffrey Hinton and Yann LeCun, among others, who have extensively researched and advocated for the use of regularization techniques, including weight decay, in neural network training to improve model performance and generalization.

