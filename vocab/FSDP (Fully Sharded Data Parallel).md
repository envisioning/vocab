---
title: FSDP (Fully Sharded Data Parallel)
summary: Distributed training method in deep learning that divides both model parameters and optimizer states across multiple devices to improve efficiency and scalability.
---
Detailed Explanation:
Fully Sharded Data Parallel (FSDP) is designed to address the memory bottlenecks and communication overhead associated with training large-scale deep learning models. Unlike traditional data parallelism, which duplicates model parameters across all devices, FSDP shards both the model parameters and optimizer states among the devices. This allows for more efficient use of memory and reduces the communication load by only exchanging the necessary gradients and parameters between devices. FSDP leverages advanced communication techniques like all-reduce and broadcast to synchronize updates, ensuring consistent training results while significantly lowering memory usage and speeding up training times. It is particularly useful for training very large models that cannot fit into the memory of a single device.

Historical Overview:
The concept of sharded data parallelism emerged as the scale of deep learning models and datasets grew exponentially in the late 2010s. FSDP gained significant attention and adoption around 2020-2021, driven by the increasing need for efficient training of massive models like GPT-3 and beyond. This method became a critical component of the toolkit for training large-scale AI systems.

Key Contributors:
Key contributors to the development of FSDP include researchers and engineers from leading AI research labs and organizations such as Google Brain, OpenAI, and Facebook AI Research (FAIR). The development of frameworks like PyTorch and TensorFlow has also played a pivotal role in popularizing and refining FSDP techniques. Specific individuals such as Jeff Dean, Andrew Ng, and the teams behind these frameworks have made significant contributions to the evolution and adoption of these distributed training methods.