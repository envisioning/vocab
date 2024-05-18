---
title: RBMs (Restricted Boltzmann Machines)
summary: Type of generative stochastic artificial neural network that can learn a probability distribution over its set of inputs.
---
RBMs consist of two layers: a visible layer and a hidden layer, with no intra-layer connections, which allows efficient sampling and learning of data distributions. Each visible unit is connected to all hidden units and vice versa, facilitating the reconstruction of inputs through a bipartite graph structure. RBMs are primarily used for dimensionality reduction, classification, regression, collaborative filtering, feature learning, and topic modeling. The training process involves a contrastive divergence algorithm, which approximates the gradient of the log-likelihood of the observed data. By learning the joint probability distribution of the input data, RBMs can extract useful features and generate new data samples similar to the training data.

Historical Overview:
The concept of RBMs originated from Boltzmann machines, introduced by Geoffrey Hinton and Terry Sejnowski in 1985. The "restricted" variant, which simplifies the architecture to exclude intra-layer connections, was proposed by Hinton in 2002. This adjustment made training more efficient and practical for various machine learning applications, leading to increased popularity in the mid-2000s, particularly in the context of deep learning pretraining methods.

Key Contributors:
Geoffrey Hinton is the most notable figure associated with the development of Restricted Boltzmann Machines. His work on neural networks and deep learning has been foundational, and his introduction of RBMs significantly advanced the field. Terry Sejnowski also contributed to the foundational concepts through their earlier collaboration on Boltzmann machines.