---
title: Equivariance
summary: Property of a function whereby the function commutes with the actions of a group, meaning that transformations applied to the input result in proportional transformations in the output.
---
Equivariance in the context of artificial intelligence, particularly in machine learning models like neural networks, refers to the capability of an algorithm to maintain the structure of its input data through transformations. For instance, in image processing, an equivariant convolutional neural network (CNN) can recognize objects in an image regardless of the object’s orientation or position because its filters are designed to respond identically to the same features under different transformations, such as rotations or translations. This property is crucial for developing robust models that generalize well over varied datasets without the need for extensive data augmentation.

Historical overview:
The concept of equivariance has been fundamental in mathematics and physics for many years but started gaining significant attention in the machine learning community around the 2010s. It became particularly relevant with the advent of geometric deep learning and the application of group theory to neural networks, where the design of equivariant neural networks helped in efficiently processing data with inherent symmetries.

Key contributors:
Significant advancements in equivariant neural networks were made by researchers such as Taco Cohen and Max Welling, who have been instrumental in integrating group theory into deep learning architectures. Their work on group equivariant convolutional networks (G-CNNs) and subsequent developments have paved the way for more sophisticated models that efficiently handle data with geometric transformations.