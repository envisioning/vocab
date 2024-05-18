---
title: GMM (Gaussian Mixture Models)
summary: Probabilistic models that assume all data points are generated from a mixture of a finite number of Gaussian distributions with unknown parameters.
---
Gaussian Mixture Models are used extensively in statistical pattern recognition and machine learning for clustering and density estimation. A GMM represents a composite distribution wherein each component density represents a cluster, typically modeled as a multivariate normal distribution. The model parameters, including the means, variances, and mixture weights of these Gaussian components, are typically estimated using the Expectation-Maximization (EM) algorithm. This iterative process alternates between assigning data points to clusters based on current parameter estimates (expectation step) and updating the parameters to better fit the data (maximization step). The flexibility of GMMs in accommodating varying cluster shapes makes them superior for modeling complex data distributions compared to simpler clustering methods like k-means.

Historical overview:
The concept of mixture models dates back to the late 19th century, but the specific formulation of Gaussian Mixture Models and their algorithmic learning via the EM algorithm became prominent in the 1970s. The application of GMMs became widespread with the advancement in computational power and the development of statistical software.

Key contributors:
While the general theory of mixture models was developed by various statisticians, the modern formulation and popularization of Gaussian Mixture Models were significantly advanced by Arthur Dempster, Nan Laird, and Donald Rubin through their seminal 1977 paper on the EM algorithm. Their work laid the foundational algorithmic framework that facilitated the broad adoption and application of GMMs in many areas of research and industry.