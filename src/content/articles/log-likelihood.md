---
slug: log-likelihood
summary: Logarithm of the likelihood function, used in statistical models to measure how well a model explains a given set of data.
title: Log Likelihood
---

Log likelihood is central in maximum likelihood estimation (MLE), where it transforms the product of probabilities into a sum (via logarithm), simplifying the optimization of complex models. Given a probabilistic model and observed data, the likelihood represents the probability of the data given the model's parameters. Taking the log of this function improves numerical stability and makes it easier to differentiate, thus facilitating parameter estimation through gradient-based methods. Log likelihood is crucial in many AI tasks, such as training probabilistic models (e.g., in Gaussian Mixture Models or Hidden Markov Models) or learning weights in neural networks (e.g., in softmax classifiers), where maximizing the log likelihood helps find the best-fit model parameters.

The concept of likelihood was introduced by Ronald Fisher in 1921 as part of his foundational work in statistics. Log likelihood gained prominence as computational methods advanced, particularly during the 1960s and 1970s, with the rise of statistical computing and the increased use of MLE.

Ronald A. Fisher, a pioneer in modern statistics, introduced the likelihood function, which laid the foundation for log likelihood's later widespread use. The development of computational techniques, such as gradient descent and optimization algorithms by figures like John von Neumann and others, further enhanced the practical application of log likelihood in statistical modeling and AI.
