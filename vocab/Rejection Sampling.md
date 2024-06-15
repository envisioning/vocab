---
title: Rejection Sampling
summary: Method used to generate samples from a probability distribution by proposing candidates from a simpler distribution and accepting or rejecting them based on a criterion related to the target distribution.
---
**Detailed Explanation:**
Rejection sampling is a technique in probabilistic modeling and computational statistics where samples are drawn from a target distribution by using a proposal distribution that is easier to sample from. The algorithm works by sampling a candidate from the proposal distribution and then accepting or rejecting this candidate based on a comparison of the target and proposal distributions. Specifically, a candidate \( x \) is accepted with a probability proportional to the ratio of the target density \( f(x) \) to the scaled proposal density \( c \cdot g(x) \), where \( c \) is a constant ensuring that \( f(x) \leq c \cdot g(x) \) for all \( x \). This method is particularly useful in scenarios where direct sampling from the target distribution is challenging. Rejection sampling ensures that the accepted samples conform to the desired target distribution, making it valuable for tasks like Bayesian inference and other statistical modeling processes.

**Historical Overview:**
The concept of rejection sampling was first introduced by John von Neumann in the 1950s as part of his work on Monte Carlo methods. It gained significant attention and application in the subsequent decades, particularly in the fields of statistical physics, computational biology, and machine learning, as more complex probabilistic models and simulations became prevalent.

**Key Contributors:**
John von Neumann is the key figure associated with the development of rejection sampling. His pioneering work in the mid-20th century laid the foundation for many Monte Carlo techniques. Later contributions by researchers in the fields of computational statistics and machine learning have refined and extended the method, integrating it into various sophisticated probabilistic frameworks and algorithms.