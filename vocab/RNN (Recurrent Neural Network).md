---
title: "RNN (Recurrent Neural Network)"
summary: "Class of neural networks where connections between nodes form a directed graph along a temporal sequence, enabling them to exhibit temporal dynamic behavior for a sequence of inputs."
---
Recurrent Neural Networks (RNNs) are designed to recognize patterns in sequences of data, such as text, genomes, handwriting, or spoken words. Unlike traditional neural networks, which assume that all inputs (and outputs) are independent of each other, RNNs are characterized by their ability to maintain a form of memory by using their internal state (or hidden layers) to process sequences of inputs. This makes them particularly useful for tasks where context or the order of data points is important. RNNs can be used in applications like language modeling, speech recognition, and machine translation. However, they often suffer from problems like vanishing and exploding gradients, which make training deep RNNs challenging.

Historical overview: The concept of RNNs dates back to the 1980s, with the first notable implementation being the Hopfield Network in 1982. However, RNNs gained significant popularity in the 1990s and 2000s with the introduction of Long Short-Term Memory (LSTM) networks, which addressed some of the training difficulties associated with traditional RNNs.

Key contributors: John Hopfield introduced the Hopfield Network, a form of RNN, in 1982, making a significant contribution to the field. Later, in 1997, Sepp Hochreiter and Jürgen Schmidhuber introduced LSTM networks, a pivotal development that significantly improved the usability and performance of RNNs in long sequence tasks.

