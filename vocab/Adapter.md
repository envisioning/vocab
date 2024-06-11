---
title: Adapter
summary: Lightweight, modular component added to a pre-trained model to fine-tune it for specific tasks without altering the original model's parameters significantly.
---
**Detailed Explanation:** Adapters are a method of transfer learning that allow large pre-trained models to adapt to various downstream tasks efficiently. Instead of retraining the entire model, adapters introduce small additional layers or modules that are trained on the specific task while keeping the original model's parameters frozen. This approach significantly reduces the computational cost and resources required for fine-tuning, making it easier to leverage powerful pre-trained models across diverse applications. Adapters enable rapid customization and adaptability, making them particularly useful in settings where computational resources are limited or where frequent model updates are necessary.

**Historical Overview:** The concept of adapters in AI gained prominence around 2019 with the introduction of adapter modules for BERT (Bidirectional Encoder Representations from Transformers). This approach was motivated by the need to make the fine-tuning of large language models more efficient and scalable across multiple tasks.

**Key Contributors:** The development of adapters was significantly advanced by the work of researchers at Google, including Houlsby et al., who published the seminal paper "Parameter-Efficient Transfer Learning for NLP" in 2019. Their work laid the foundation for subsequent research and development in the use of adapters for efficient model fine-tuning.