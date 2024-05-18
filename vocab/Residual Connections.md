---
title: Residual Connections
summary: DL architecture feature designed to help alleviate the vanishing gradient problem by allowing gradients to flow through a network more effectively.
---
Residual connections are primarily utilized in the construction of deep neural networks, particularly in models known as Residual Networks (ResNets). They work by creating shortcuts that skip one or more layers, typically adding the output from an earlier layer to the output of a later layer. This approach helps to preserve the integrity of the information as it passes through the network, reducing the risk of information loss and making it possible to train much deeper networks effectively. The introduction of residual connections marked a significant advancement in deep learning, enabling the development of networks that are deeper and more complex than was previously possible without encountering severe training challenges.

The concept of residual connections was introduced in 2015 by Kaiming He and colleagues at Microsoft Research in their seminal paper, "Deep Residual Learning for Image Recognition." This innovation quickly gained popularity due to its effectiveness in improving the training of deep neural networks.

Kaiming He, along with his co-authors Xiangyu Zhang, Shaoqing Ren, and Jian Sun, were instrumental in the development and popularization of residual connections. Their work not only introduced a powerful technique for constructing deeper neural networks but also sparked further research and development in network architecture innovations.