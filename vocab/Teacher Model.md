---
title: Teacher Model
summary: Pre-trained, high-performing model that guides the training of a simpler, student model, often in the context of knowledge distillation.
---
**Detailed Explanation:** In AI, particularly in model compression and knowledge distillation, a teacher model is a large, often complex neural network that has been pre-trained on a large dataset and achieves high accuracy. The teacher model's purpose is to transfer its learned knowledge to a smaller, more efficient student model. During training, the student model learns to mimic the teacher model’s predictions, capturing its patterns and insights, but with fewer parameters and reduced computational cost. This process allows the student model to approximate the performance of the teacher model while being more suitable for deployment in resource-constrained environments, such as mobile devices or real-time applications.

**Historical Overview:** The concept of a teacher model became prominent with the introduction of knowledge distillation in 2015, particularly through the work of Geoffrey Hinton and his colleagues, who formalized the approach to compress large models like deep neural networks into smaller ones without significant loss of accuracy.

**Key Contributors:** Geoffrey Hinton, Oriol Vinyals, and Jeff Dean are among the key contributors to the development of the teacher-student model framework through their work on knowledge distillation, which has since become a foundational technique in model compression and transfer learning.