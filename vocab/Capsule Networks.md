---
title: "Capsule Networks"
summary: "Type of artificial neural network designed to improve the processing of spatial hierarchical information by encoding data into small groups of neurons called capsules."
---
Capsule Networks aim to address limitations of traditional convolutional neural networks (CNNs), particularly in recognizing spatial hierarchies between features. A capsule is a group of neurons whose activity vector represents the instantiation parameters of a specific type of entity, such as an object or an object part, within the network. Unlike CNNs, which might lose spatial relationships between high-level features due to pooling layers, CapsNets retain this information through dynamic routing mechanisms. This process ensures that the network can recognize objects in various positions and orientations, making it robust to spatial transformations. CapsNets are especially significant for tasks requiring detailed understanding of scene composition, like image recognition and 3D modeling, demonstrating superior capabilities in handling complex spatial relationships.

Historical overview: The concept of Capsule Networks was first introduced by Geoffrey Hinton and his team in 2011, with significant advancements and popularization occurring around 2017 following the publication of "Dynamic Routing Between Capsules."

Key contributors: Geoffrey Hinton, known as the "Godfather of Deep Learning," along with Sara Sabour and Nicholas Frosst, were pivotal in the development and popularization of Capsule Networks, contributing to the foundational research that laid the groundwork for this innovative approach to neural network design.

