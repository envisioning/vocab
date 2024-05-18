---
title: "VAE (Variational Autoencoders)"
summary: "Class of generative models that use neural networks to encode inputs into a latent space and then decode from this space to reconstruct the input or generate new data that resemble the input data."
---
Variational Autoencoders stand out for their foundation in probability theory and their approach to generative modeling. They encode input data into a latent (hidden) space using a neural network, capturing the essence of the data in a compressed form. Another neural network then decodes these latent representations to reconstruct the input data or generate new data points. VAEs are distinguished by their use of a variational approach for latent representation learning, which involves optimizing the encoder and decoder simultaneously to minimize the difference between the original and reconstructed data, while also ensuring that the latent space has good properties (e.g., continuity, completeness) that allow for the generation of meaningful new data. This is achieved through a loss function that combines reconstruction loss with a regularization term based on the Kullback-Leibler divergence, ensuring the encoded data points are distributed in a manner conducive to generative processes.

Historical overview: The concept of Variational Autoencoders was introduced in 2013, marking a significant advancement in the field of generative models and neural networks. They gained popularity as a powerful tool for unsupervised learning, capable of generating high-quality, diverse samples across various domains, including images, text, and more.

Key contributors: The introduction and development of Variational Autoencoders can be attributed to Kingma and Welling, who published the seminal paper "Auto-Encoding Variational Bayes" in 2013. Their work laid the foundational principles and demonstrated the potential of VAEs in generative modeling, influencing subsequent research and applications in AI.

