---
title: MLE (Maximum Likelihood Estimation)
summary: Statistical method used to estimate the parameters of a probability distribution by maximizing a likelihood function.
---
Maximum Likelihood Estimation (MLE) is a cornerstone in statistical inference, widely used in machine learning and data science for parameter estimation. The core idea of MLE is to find the set of parameters that make the observed data most probable under the assumed statistical model. Given a dataset and a parameterized probability model, the likelihood function is constructed as the joint probability of the observed data as a function of the parameters. The parameters that maximize this likelihood function are the MLE estimates. Mathematically, this involves taking the derivative of the likelihood function with respect to the parameters, setting it to zero, and solving for the parameters. MLE is particularly favored for its asymptotic properties, such as consistency (estimates converge to the true parameters as sample size increases) and efficiency (achieving the lowest possible variance among unbiased estimators in large samples).

Historical Overview:
The concept of MLE was first introduced by the British statistician Ronald A. Fisher in 1912, with its formal development occurring in his seminal works during the 1920s. MLE gained significant popularity in the mid-20th century as computational methods and tools advanced, allowing for practical implementation on larger datasets.

Key Contributors:
Ronald A. Fisher is the most significant figure in the development of MLE. His pioneering work laid the foundation for modern statistical theory, influencing a wide array of applications across various scientific disciplines. Fisher's contributions to the theoretical framework of MLE and its properties have cemented his legacy as a central figure in the field of statistics.