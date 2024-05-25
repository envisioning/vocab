---
title: CD (Contrastive Divergence)
summary: Algorithm used to approximate the gradient of the log-likelihood for training probabilistic models.
---
Contrastive Divergence is a method designed to efficiently train energy-based models like RBMs (Restricted Boltzmann Machines) by approximating the gradient of the log-likelihood of the data. Traditional maximum likelihood estimation for these models is computationally expensive due to the intractability of the partition function. CD circumvents this by performing a limited number of Gibbs sampling steps to approximate the true gradient. In the context of RBMs, CD typically starts with a data sample, performs a forward pass to obtain hidden activations, then reconstructs the visible layer from these hidden activations, and finally updates the model parameters based on the difference between the original and reconstructed data. This method, although not yielding exact maximum likelihood estimates, has been shown to be effective and computationally feasible, making it a popular choice for training deep learning models that include RBM layers.

Historical Overview:
The concept of Contrastive Divergence was introduced by Geoffrey Hinton in 2002 as a way to make the training of RBMs practical. It gained significant traction in the mid-2000s with the resurgence of interest in deep learning, particularly due to its use in pretraining layers of deep neural networks before the advent of fully supervised deep learning techniques.

Key Contributors
Geoffrey Hinton, a pioneer in the field of neural networks and deep learning, is the primary contributor to the development and popularization of Contrastive Divergence. His work on RBMs and CD has had a lasting impact on the field, influencing subsequent research and applications in deep learning and unsupervised learning.