---
title: VGG (Visual Geometry Group)
summary: A University of Oxford research group whose 2014 deep convolutional network designs (VGGNet) demonstrated the practical benefits of very deep, uniformly structured CNNs with small convolutional kernels and became a standard backbone for image tasks.
slug: vgg-visual-geometry-group
---

VGG (Visual Geometry Group) is a research group at the University of Oxford known in AI and ML for producing the "VGGNet" family of convolutional neural network architectures; their 2014 paper "Very Deep Convolutional Networks for Large-Scale Image Recognition" (Simonyan & Zisserman) showed that stacking many layers of small (3×3) convolutional filters with simple, repeatable blocks yields substantially improved representational power and transferability for image classification and related vision tasks. The architectural choices — consistent use of small kernels, simple conv-conv-(conv)-pool patterns, ReLU nonlinearities, and a small number of design hyperparameters — provided a clear recipe for scaling depth, offered interpretable feature hierarchies, and produced pretrained models (e.g., VGG-16, VGG-19) that became widely used as off-the-shelf feature extractors and backbones for detection, segmentation, and transfer learning despite their large parameter counts and computational cost.

First applied and published in 2014; it gained rapid popularity that same year after strong ImageNet/ILSVRC results and widespread adoption of VGGNet weights as standard pretrained backbones in ML workflows.

Key contributors include Karen Simonyan and Andrew Zisserman (authors of the seminal 2014 paper) and the broader Visual Geometry Group at the University of Oxford, with adoption and extensions driven by the ImageNet/ILSVRC community and many subsequent researchers who used VGG architectures as baselines or feature extractors in computer vision and ML.