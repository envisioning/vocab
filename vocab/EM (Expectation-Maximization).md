---
title: EM (Expectation-Maximization)
summary: Statistical technique used to find the maximum likelihood estimates of parameters in probabilistic models, specifically when the model depends on unobserved latent variables.
---
In the context of Gaussian Mixture Models (GMM), the EM algorithm iteratively improves estimates of the unknown parameters, which include the means, variances, and mixture weights of different Gaussian components within the model. The algorithm consists of two main steps: the expectation (E) step, which calculates the probability that each data point belongs to each Gaussian component based on current parameter estimates; and the maximization (M) step, which updates the parameters to maximize the likelihood of the data given these probabilities. This process repeats until convergence, effectively allowing the model to fit complex datasets by finding clusters of data modeled as mixtures of multiple Gaussians.

Historical Overview:
The expectation-maximization algorithm was first introduced by Arthur Dempster, Nan Laird, and Donald Rubin in their seminal 1977 paper. Although the underlying concepts of iterative improvement of likelihood estimates were known earlier, their formalization brought significant clarity and broad application potential. The use of EM in Gaussian Mixture Models became particularly popular in the late 1980s and 1990s as computational resources allowed for handling larger datasets and more complex models.

Key Contributors:
Arthur P. Dempster, Nan M. Laird, and Donald B. Rubin are credited with the formal introduction of the EM algorithm. Their work provided a robust framework for the application of these methods in various fields, including statistics and machine learning. The integration of EM with GMMs has been further explored by numerous researchers in the field of machine learning and statistics, adapting and optimizing it for different applications and challenges.