---
generality:
  - 0.7
  - 0.675
  - 0.65
  - 0.625
  - 0.6
  - 0.575
  - 0.55
slug: ebm-energy-based-model
summary:
  Class of deep learning models that learn to associate lower energy levels
  with more probable configurations of the input data.
title: EBM (Energy-Based Model)
---

Energy-Based Models (EBMs) operate on the principle that configurations of variables (e.g., the features of input data) can be represented in terms of their energy, with lower energies indicating more stable or likely configurations. These models are trained to assign lower energy levels to correct or desired outputs and higher energies to incorrect ones. This approach allows EBMs to learn complex distributions over data by defining an energy function, which is often a parameterized function learned during training. The energy function can capture dependencies between variables, making EBMs particularly useful for tasks such as image recognition, natural language processing, and generative tasks where understanding the underlying data distribution is crucial.

The concept of Energy-Based Models has its roots in statistical physics but was adapted for use in machine learning and neural networks in the late 20th century. Their popularity increased in the early 2000s with the rise of deep learning and the development of more efficient training algorithms.

While it's challenging to pinpoint a single contributor to the development of EBMs due to their foundational nature in physics and their broad application in machine learning, researchers like Geoffrey Hinton and Yann LeCun have been influential in popularizing and advancing the use of energy-based frameworks in deep learning. Hinton's work on Boltzmann machines, a type of EBM, and LeCun's work on convolutional networks, which can be adapted into an EBM framework, have been particularly notable.
