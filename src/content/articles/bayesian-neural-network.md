---
title: Bayesian Neural Network  
summary: A neural network that incorporates Bayesian inference to model uncertainty in its predictions and parameters.
slug: bayesian-neural-network
---  

Bayesian Neural Networks (BNNs) apply Bayesian inference principles within the framework of neural networks, allowing them to quantify uncertainty by placing probabilistic distributions over weights and biases rather than relying on point estimates. This approach makes BNNs highly valuable for applications requiring uncertainty estimation, such as safety-critical systems or predictive modeling in domains with sparse data. By integrating posterior distributions, BNNs can provide more robust predictions and guide parameter updates, considering variability in inputs and model imperfections. Consequently, BNNs help overcome traditional neural networks' inability to express confidence in their predictions, thus offering a flexible mechanism to mitigate overfitting and enhance model generalization. Despite their advantages, BNNs require sophisticated methods, like Markov Chain Monte Carlo (MCMC) or Variational Inference, for computational tractability in high-dimensional parameter spaces.

The foundational concepts of Bayesian Neural Networks trace back to the late 1980s and early 1990s, with pivotal works gaining traction in the AI community during the mid-2010s as the demand for uncertainty modeling in ML models escalated.

David Mackay and Radford Neal are among the key contributors to the development of Bayesian Neural Networks, having laid essential groundwork in the understanding and practical implementation of Bayesian methods in neural computation during the early phases of the term's evolution.