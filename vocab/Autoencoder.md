---
title: "Autoencoder"
summary: "Type of artificial neural network used to learn efficient codings of unlabeled data, typically for the purpose of dimensionality reduction or feature learning."
---
Autoencoders are designed to automatically learn representations (encodings) for a set of data, by training the network to ignore signal "noise." This is achieved by encoding inputs into a latent-space representation, and then decoding them back to the original inputs. The process aims to capture the most salient features of the data. Autoencoders consist of an encoder, a decoder, and a loss function that measures the information loss between the original input and its reconstruction. They are widely used in applications such as data denoising, dimensionality reduction for data visualization, generative models, and even in pretraining of neural networks for deep learning tasks.

Historical overview: The concept of autoencoders has been around since the 1980s, with significant attention in the neural networks community. They gained popularity with the rise of deep learning in the 2000s, as researchers found ways to effectively train deep autoencoders, unlocking their potential for various applications.

Key contributors: Geoffrey Hinton and his collaborators have been pivotal in the development and popularization of autoencoders, especially in the context of deep learning. Their work on using autoencoders for pretraining deep neural networks before the advent of more effective training techniques was particularly influential.

