---
generality:
  - 0.85
  - 0.835
  - 0.82
  - 0.805
  - 0.79
  - 0.775
  - 0.76
slug: k-nn-k-nearest-neighbors
summary:
  Simple, non-parametric algorithm used in ML for classification and regression
  tasks by assigning labels based on the majority vote of the nearest neighbors.
title: k-NN (k-Nearest Neighbors)
---

The k-Nearest Neighbors (k-NN) algorithm operates on a simple principle: it classifies a new data point based on the predominant category (in classification tasks) or average outcome (in regression tasks) of the 'k' closest points in the feature space. 'k' is a user-defined constant, and the closeness is usually determined by a distance metric like Euclidean, Manhattan, or Hamming distance. The choice of 'k' and the type of distance metric significantly influence the algorithm's performance. k-NN is a type of instance-based learning, or lazy learning, where generalization of the training data is delayed until a query is made, making it one of the simplest machine learning algorithms in terms of implementation, but potentially computationally expensive during testing, as it involves calculating the distance from each query instance to all training samples.

The concept of nearest neighbor classification was first introduced in 1951 by Fix and Hodges, but the term k-NN was popularized and more formally described in the 1967 book Nearest Neighbor (NN) Norms: NN Pattern Classification Techniques by Cover and Hart.

Evelyn Fix and Joseph Hodges pioneered the initial development with their work on non-parametric discrimination. Later, Thomas Cover and Peter Hart significantly contributed to the formalization and popularization of the algorithm with their systematic study and comparative analysis in the late 1960s. Their work established k-NN as a vital tool in statistical pattern recognition and machine learning.
