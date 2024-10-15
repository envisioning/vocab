---
title: Distillation
summary: Process of compressing a larger, complex model (the teacher) into a smaller, simpler model (the student) while retaining much of the original model's performance.
---
Detailed Explanation:
Distillation is a model compression technique used to transfer knowledge from a large, often overparameterized model, known as the "teacher," to a smaller, more efficient "student" model. The goal is to achieve a model that is faster and requires less computational power while maintaining a high level of accuracy. During distillation, the student model is trained not only on the original dataset but also to mimic the teacher's output (soft labels), which contains richer information than hard labels. This process enables the student to capture the teacher's learned generalizations and subtleties. Distillation is especially useful in scenarios where deploying large models is impractical, such as on mobile devices or edge computing environments.

Historical Overview:
The concept of model distillation was first introduced by Geoffrey Hinton, Oriol Vinyals, and Jeff Dean in a 2015 paper titled "Distilling the Knowledge in a Neural Network." This paper popularized the idea and led to widespread adoption in various AI applications, particularly in natural language processing and computer vision.

Key Contributors:
Geoffrey Hinton, a pioneer in neural networks, along with Oriol Vinyals and Jeff Dean, are the primary contributors to the development and popularization of model distillation. Their 2015 paper laid the groundwork for subsequent research and applications of this technique in AI.