---
title: "LoRA (Low-Rank Adaptation)"
summary: "Technique for fine-tuning LLMs in a parameter-efficient manner."
---
LoRA is primarily focused on modifying large pre-trained models with minimal additional parameters, thereby making the adaptation process more efficient and less resource-intensive. It works by introducing trainable low-rank matrices that adapt the self-attention and feed-forward layers of a transformer model. These matrices adjust the pre-trained weights indirectly rather than modifying them directly, allowing significant changes in the model's behavior with only a small increase in the number of parameters. This method is particularly useful in scenarios where deploying fully fine-tuned models is computationally expensive or impractical.

Historical Overview: The concept of Low-Rank Adaptation emerged around 2021, developed by researchers at Microsoft. It gained attention for its efficacy in adapting large models like GPT-3 and BERT with minimal computational overhead.

Key Contributors: The development of LoRA was led by Edward J. Hu and other collaborators at Microsoft Research. Their work demonstrates a significant step forward in making large model tuning more accessible and efficient, particularly for applications where computational resources are a limiting factor.
