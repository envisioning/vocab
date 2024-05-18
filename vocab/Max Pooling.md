---
title: Max Pooling
summary: Downsampling technique that reduces the dimensionality of input data by selecting the maximum value from a specified subset of the data.
---
Max pooling is employed within convolutional neural networks to progressively reduce the spatial size of the representation, thereby decreasing the amount of parameters and computation in the network. This operation works by sliding a window (often 2x2) over the input data (typically the output of convolutional layers) and taking the maximum value within that window as the output for that region. This process not only helps in reducing data dimensions but also introduces translational invariance, enhancing the model's ability to generalize from local to broader features, and effectively concentrating on the most salient features within the receptive field.

Historical overview:
The concept of max pooling emerged in the context of neural networks in the late 1980s and gained substantial popularity in the 2000s, particularly after 2012 following its successful implementation in AlexNet for the ImageNet competition. This method has become a standard component in the design of convolutional layers in deep learning architectures.

Key contributors:
While the general technique of pooling can be traced to earlier neural network models, it was popularized by researchers like Geoffrey Hinton and his students, Alex Krizhevsky, Ilya Sutskever, and others through its effective use in AlexNet. Their work demonstrated the effectiveness of max pooling in deep convolutional neural networks, particularly for tasks in computer vision.