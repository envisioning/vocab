---
title: Siamese Network
summary: Type of neural network architecture that involves two or more identical subnetworks sharing the same parameters and weights, typically used for tasks like similarity learning and verification.
---
Siamese networks consist of two or more identical neural networks that process two different inputs to produce outputs, which are then compared. The architecture is particularly effective for tasks where determining the similarity or difference between two inputs is crucial, such as face verification, signature verification, and image similarity tasks. Each subnetwork processes one input independently, but because they share the same parameters, the features they extract are directly comparable. A common loss function used in Siamese networks is the contrastive loss, which helps in minimizing the distance between similar pairs and maximizing the distance between dissimilar pairs. This architecture leverages the concept of parameter sharing to ensure that the same feature extraction process is applied to both inputs, enhancing consistency and efficiency.

Historical Overview:
The concept of Siamese networks was first introduced in the early 1990s, specifically in a paper by Bromley et al. in 1993 for signature verification. The architecture gained significant popularity in the 2010s with advancements in deep learning and its applications in computer vision and other domains, notably with the resurgence of interest in convolutional neural networks (CNNs).

Key Contributors:
The initial development of Siamese networks is credited to Jane Bromley and colleagues, who introduced the architecture in their 1993 paper "Signature Verification using a 'Siamese' Time Delay Neural Network". Later, researchers like Yann LeCun and his team at AT&T Bell Labs further contributed to its development and popularization.