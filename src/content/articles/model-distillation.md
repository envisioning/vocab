---
slug: model-distillation
summary: ML technique where a larger, more complex model (teacher) is used to train
  a smaller, simpler model (student) to approximate the teacher's predictions while
  maintaining similar performance.
title: Model Distillation
---

Model distillation is a form of model compression that aims to reduce the size and computational requirements of a neural network while preserving its predictive capabilities. During distillation, the knowledge of a large pre-trained model (teacher) is transferred to a smaller model (student) by training the student to mimic the teacher's outputs rather than the original training data labels. The process often involves using the soft labels produced by the teacher—probabilities assigned to each class—rather than the hard labels, which helps the student model learn the nuanced patterns captured by the teacher. This approach is particularly useful in deploying models in resource-constrained environments like mobile devices or edge computing, where memory and processing power are limited. It also facilitates faster inference times and can contribute to better generalization by preventing overfitting.

The concept of model distillation was introduced by Geoffrey Hinton, Oriol Vinyals, and Jeff Dean in 2015 as a way to improve the efficiency of deep neural networks. Since its introduction, model distillation has gained popularity in applications ranging from image classification to natural language processing, especially with the rise of large-scale models like BERT and GPT.

Geoffrey Hinton, Oriol Vinyals, and Jeff Dean are credited with pioneering the formal concept of model distillation in their 2015 paper "Distilling the Knowledge in a Neural Network." Their work laid the foundation for subsequent advancements in neural network compression and transfer learning techniques.