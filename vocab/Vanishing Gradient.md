---
title: Vanishing Gradient
summary: Phenomenon in neural networks where gradients of the network's parameters become very small, effectively preventing the weights from changing their values during training.
---
In the context of training deep neural networks, the vanishing gradient problem occurs when the derivatives of the network's loss function with respect to the weights decrease exponentially as we move backward through the hidden layers during backpropagation. This leads to extremely small gradients, which means that the weights in the earlier layers of the network barely change, stalling the learning process. This issue is particularly prevalent in networks using sigmoid or hyperbolic tangent activation functions, where the gradients can be squashed into very small numbers. As a result, networks fail to converge to a good solution, or take a very long time to train.

Historical overview:
The issue of vanishing gradients was identified in the 1990s as researchers began experimenting with deeper neural networks. It became a significant topic of discussion in the early 2000s as it posed a major hurdle to the effectiveness of deep learning models.

Key contributors:
Sepp Hochreiter and Yoshua Bengio, among others, were instrumental in identifying and addressing the vanishing gradient problem. Their work in the late 1990s and early 2000s on understanding and mitigating this issue laid foundational concepts for modern deep learning techniques. Hochreiter's introduction of the Long Short-Term Memory (LSTM) network in 1997 specifically aimed to combat vanishing gradients by using gates that control information flow, thus preserving gradients across many time steps.