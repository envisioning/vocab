---
title: "Cross-Attention"
summary: "Mechanism in neural networks that allows the model to weigh and integrate information from different input sources dynamically."
---
Cross-attention is primarily used in models where there are distinct but related input streams that need to be processed in relation to each other, such as in machine translation where the model must consider both the source and target text. The mechanism works by computing attention scores based on one set of inputs (e.g., a query from a decoder) against another set of inputs (e.g., keys and values from an encoder), enabling the model to focus on relevant parts of the input data when generating each part of the output. This selective attention enhances the model’s ability to handle complex tasks that involve relationships between different types of data, such as correlating visual regions with textual descriptions in image captioning.

Historical overview: Cross-attention gained prominence with the success of the Transformer architecture, introduced in the seminal paper "Attention is All You Need" by Vaswani et al. in 2017. It was crucial for improving the performance of various tasks in natural language processing and computer vision by enabling more contextually aware information processing.

Key contributors: Ashish Vaswani and his colleagues at Google Brain were pivotal in developing the Transformer model, which utilizes cross-attention as a core component. Their work has significantly influenced subsequent developments in AI models that integrate multiple input sources.
