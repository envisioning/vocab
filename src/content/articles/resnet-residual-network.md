---
slug: resnet-residual-network
summary: Type of CNN (Convolutional Neural Network) architecture that introduces residual learning to facilitate the training of much deeper networks by utilizing shortcut connections or skip connections that allow the gradient to bypass some layers.
title: ResNet (Residual Network)
---

ResNet revolutionized deep learning by addressing the vanishing gradient problem that occurs in traditional deep neural networks as their depth increases. By integrating skip connections, which are essentially shortcuts that allow the input to a layer to be added directly to its output, ResNet allows gradients to flow through the network without attenuation during backpropagation. This innovation supports training significantly deeper networks—versions of ResNet have been successfully trained with over 100 layers—enhancing performance on complex tasks like image recognition. The architecture is widely adopted in various applications including image and video recognition, object detection, and semantic segmentation.

ResNet was introduced in 2015 by Kaiming He and colleagues at Microsoft Research. It quickly gained prominence after winning the ImageNet Large Scale Visual Recognition Challenge (ILSVRC) in the same year, demonstrating substantial improvements over previous models with its deeper and more efficient architectures.

The primary contributors to the development of ResNet are Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun, all affiliated with Microsoft Research. Their work not only provided a practical solution to the problem of training deep neural networks but also spurred further innovations in network design and deep learning theory.