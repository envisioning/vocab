---
title: Capsule Network
summary: Type of artificial neural network that aims to more accurately model hierarchical relationships and spatial information in visual data by using groups of neurons called capsules.
---
Expert-Level Explanation:
Capsule Networks, introduced by Geoffrey Hinton and his colleagues, address some limitations of traditional convolutional neural networks (CNNs), such as their inability to effectively handle spatial hierarchies and pose variations. Capsules are groups of neurons that encapsulate the parameters of an entity's specific properties, such as its pose, texture, deformation, velocity, albedo, hue, and so on. These capsules use dynamic routing algorithms to ensure that the output of one layer is sent to the appropriate capsule in the next layer, thus preserving the spatial hierarchies. This enables Capsule Networks to recognize the same object even when it appears in different orientations or perspectives, making them particularly powerful for tasks involving complex spatial relationships and detailed object recognition.

Historical Overview:
The concept of Capsule Networks was first introduced by Geoffrey Hinton, Alex Krizhevsky, and Sida Wang in 2011, but it gained significant attention and popularity in 2017 with the publication of the paper "Dynamic Routing Between Capsules." This paper outlined the limitations of CNNs and proposed Capsule Networks as a superior alternative for certain types of tasks.

Key Contributors:
Geoffrey Hinton, often regarded as one of the founding fathers of deep learning, is the principal figure behind the development of Capsule Networks. His collaborators, Alex Krizhevsky and Sida Wang, also played significant roles in the early conceptualization and development of this technology. Hinton's continued advocacy and research have been crucial in promoting the development and understanding of Capsule Networks within the AI community.