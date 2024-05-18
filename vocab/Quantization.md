---
title: "Quantization"
summary: "Process of reducing the precision of the weights and activations in neural network models to decrease their memory and computational requirements."
---
Quantization is a technique used to optimize neural networks, making them more efficient for deployment on devices with limited computational resources, such as mobile phones and embedded systems. By reducing the bit-width of the numbers representing the model's parameters and activations, quantization decreases the model size and speeds up inference, albeit with a potential slight loss in accuracy. This trade-off is often acceptable in many practical applications where the speed and size of the model are critical. Quantization can be applied in various forms, including post-training quantization, where the model is quantized after it has been fully trained, and quantization-aware training, which incorporates quantization into the training process to minimize accuracy loss.

Historical overview: The concept of quantization has been around in signal processing for decades, but its application to neural networks for efficiency gained prominence in the 2010s as deep learning models became increasingly complex and their deployment on edge devices became a critical need.

Key contributors: While specific individuals leading the development of quantization techniques in AI are numerous and span across academia and industry, organizations like Google, through their work on TensorFlow Lite, and Facebook, with PyTorch, have made significant contributions to making quantization techniques more accessible and practical for a wide range of applications.

