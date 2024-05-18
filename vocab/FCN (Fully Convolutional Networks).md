---
title: "FCN (Fully Convolutional Networks)"
summary: "Neural network architecture designed specifically for image segmentation tasks, where the goal is to classify each pixel of an image into a category."
---
FCNs are pivotal in computer vision for their ability to output spatial maps instead of classification scores. This characteristic makes them ideal for tasks like semantic segmentation, where the objective is to understand an image at the pixel level. Unlike traditional convolutional neural networks (CNNs) that include fully connected layers and are thus constrained to input images of fixed dimensions, FCNs can process images of any size because they replace fully connected layers with convolutional layers. This modification allows the network to maintain spatial information throughout its layers, leading to more detailed and precise predictions. FCNs have been instrumental in advancing fields that require detailed image analysis, such as autonomous driving, medical image diagnosis, and satellite image interpretation.

Historical overview: The concept of Fully Convolutional Networks was introduced in a seminal paper by Long, Shelhamer, and Darrell in 2015. This paper marked a significant shift in how neural networks were applied to image segmentation tasks, demonstrating the effectiveness of using end-to-end learning for pixel-wise prediction.

Key contributors: The development of FCNs is primarily attributed to Jonathan Long, Evan Shelhamer, and Trevor Darrell from the University of California, Berkeley. Their 2015 paper laid the groundwork for subsequent research and application in the field of computer vision, particularly in semantic segmentation.

