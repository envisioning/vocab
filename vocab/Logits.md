---
title: "Logits"
summary: "Raw, unnormalized outputs of the last layer in a neural network before applying the softmax function in classification tasks."
---
Logits represent the vector of raw predictions that a classification model generates, which are then transformed through the softmax function to produce probabilities. The term is significant because logits directly reflect the model's internal decision values for each class, before any normalization to make these outputs interpretable as probabilities. In neural networks, especially those designed for classification, understanding and analyzing logits can provide insights into the model's confidence and decision-making process. They are crucial for loss calculations in training, where functions like the softmax cross-entropy loss directly work with logits to compute gradients for model optimization.

Historical Overview: The concept of logits has its roots in logistic regression, predating deep learning, where it referred to the log-odds of probabilities. Its application in neural networks, particularly in the context of deep learning, gained prominence with the rise of these models for classification tasks in the 2010s.

Key Contributors: While the concept of logits is foundational and not attributed to a single contributor, the development and popularization of neural networks and deep learning techniques by researchers such as Geoffrey Hinton, Yoshua Bengio, and Yann LeCun have significantly influenced the widespread use and understanding of logits in AI.

