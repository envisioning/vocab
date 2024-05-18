---
title: Positional Encoding
summary: Technique used in neural network models, especially in transformers, to inject information about the order of tokens in the input sequence.
---
Positional encoding plays a crucial role in models like the transformer, where it compensates for the absence of recurrent structure by providing additional input that signifies token position within the sequence. This information is essential because the transformer processes input tokens simultaneously, lacking an inherent mechanism to account for the sequence order. Positional encodings can be either fixed, using sinusoidal functions of different frequencies, or learned during training, similar to other model parameters. These encodings are added to the input embeddings to preserve the notion of token order, thereby enabling the model to consider the position of tokens when processing language or other sequential data.

Historical Overview:
The concept of positional encoding was introduced with the transformer model in the paper "Attention is All You Need" by Vaswani et al. in 2017. It quickly became a standard component in many subsequent transformer-based models, underlining its effectiveness and importance.

Key Contributors:
The key contributors to the development of positional encoding are Ashish Vaswani and his co-authors, who presented the transformer model. Their innovative approach to handling sequence information through positional encodings has been pivotal in advancing the field of neural networks, particularly in natural language processing and related applications.