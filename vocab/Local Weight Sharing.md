---
title: Local Weight Sharing
summary: Technique where the same weights are used across different positions in an input, enhancing the network's ability to recognize patterns irrespective of their spatial location.
---
Local weight sharing is fundamental to the design of convolutional neural networks, which are particularly effective for tasks that involve image and video processing. By using the same set of weights across different parts of an input image (i.e., sharing weights locally), CNNs significantly reduce the number of parameters compared to fully connected networks. This not only helps in making the training process more efficient but also improves the network's generalization abilities. The local receptive fields formed by this technique allow the network to detect specific features like edges, corners, and textures, no matter where they appear in the image.

Historical Overview:
The concept of local weight sharing was introduced as part of the convolutional network architecture in the 1980s, notably by Kunihiko Fukushima's "neocognitron" and later refined and popularized by Yann LeCun's work in the late 1980s and early 1990s, specifically in the development of LeNet-5 for digit recognition.

Key Contributors:
Kunihiko Fukushima first introduced the concept of a convolutional neural network with the neocognitron, which employed a form of local weight sharing. Yann LeCun further advanced this concept and successfully applied it to practical tasks. His work in the development of the LeNet architecture, which utilized local weight sharing in deep learning, was instrumental in demonstrating the efficiency and power of CNNs in image recognition tasks.