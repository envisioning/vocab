---
title: LLE (Locally Linear Embedding)
summary: Nonlinear dimensionality reduction technique that preserves local neighborhood information to reduce high-dimensional data to a lower-dimensional space.
---
Locally Linear Embedding (LLE) is an unsupervised learning algorithm primarily used for dimensionality reduction, which is critical in dealing with high-dimensional data in machine learning and data visualization. LLE operates by mapping high-dimensional data points to a lower-dimensional space while preserving the relationships between neighboring points. It achieves this by assuming that each data point and its neighbors lie on or close to a locally linear patch of the manifold. The process involves two main steps: first, finding the weights that best reconstruct each data point from its neighbors; second, using these weights to construct the lower-dimensional embedding. LLE is particularly useful for visualizing complex data structures and discovering intrinsic low-dimensional manifolds within high-dimensional data.

Historical Overview:
LLE was introduced in the year 2000 and gained popularity as researchers sought more effective ways to handle high-dimensional data for visualization and analysis, especially with the increasing availability of large datasets.

Key Contributors:
The concept of Locally Linear Embedding was developed by Sam T. Roweis and Lawrence K. Saul, whose groundbreaking paper, "Nonlinear Dimensionality Reduction by Locally Linear Embedding," laid the foundation for its application and further research in the field of manifold learning and data science.