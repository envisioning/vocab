---
title: Forward Propagation
summary: Process in a neural network where input data is passed through layers of the network to generate output.
---
In the context of artificial intelligence and machine learning, forward propagation is a fundamental mechanism used in neural networks to predict output based on input data. The process begins at the input layer and proceeds sequentially through hidden layers towards the output layer. At each layer, the input is multiplied by the layer’s weights, added to a bias (if any), and passed through a non-linear activation function to determine the neuron’s output. This output becomes the input for the next layer. The final output of forward propagation is then used for tasks like classification or regression, and this output is further utilized in backpropagation to adjust the weights of the network based on error gradients.

Historical overview: The concept of forward propagation in neural networks has been integral to the field since the 1980s, closely linked with the popularization of backpropagation. It gained prominence as part of the broader adoption of multilayer perceptrons (MLPs).

Key contributors: While the concept of neural networks dates back to the 1940s with pioneers like Warren McCulloch and Walter Pitts, the practical application of forward and backpropagation as understood in contemporary neural networks was significantly advanced by researchers such as David Rumelhart, Geoffrey Hinton, and Ronald Williams in their seminal 1986 paper which discussed the use of these concepts in training neural networks.