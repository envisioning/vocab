---
title: Point-wise Feedforward Network
summary: Neural network layer that applies a series of linear and non-linear transformations to each position (or "point") in the input sequence independently.
---
Detailed Explanation:
Point-wise feedforward networks are used extensively in transformer architectures. These networks consist of two linear transformations with a ReLU activation in between. The first linear transformation expands the dimensionality of each input position and the second reduces it back to the original dimension. This layer operates independently on each position within the input sequence, which allows it to efficiently process long sequences in parallel. Its significance lies in its ability to introduce non-linearity and increase the model's capacity to capture complex features, improving the performance of tasks like language modeling, translation, and more.

Historical Overview:
The point-wise feedforward network concept gained prominence with the introduction of the Transformer model in the seminal paper "Attention Is All You Need" by Vaswani et al. in 2017. The model's innovative architecture, including this type of feedforward network, revolutionized the field of natural language processing (NLP).

Key Contributors:
The key contributors to the development and popularization of point-wise feedforward networks are the authors of the 2017 paper "Attention Is All You Need": Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, and Illia Polosukhin. Their work at Google Brain and Google Research significantly advanced the state of NLP.