---
title: "Masking"
summary: "Technique used in NLP models to prevent future input tokens from influencing the prediction of current tokens."
---
Masking is crucial in sequential data processing, especially in models like transformers used for NLP tasks. By blocking certain positions within the input sequence from being attended to (typically future positions in autoregressive models), masking ensures that the prediction for a particular token is conditioned only on the known past and present information, not on future tokens. This is fundamental in training models to generate text or process language sequentially, maintaining the causal and temporal structure of data. It helps in achieving more accurate and contextually appropriate outputs while maintaining the integrity of the sequence's temporal dynamics.

Historical overview: Masking gained prominence with the rise of transformer models, particularly after the introduction of the Transformer architecture in 2017. It has since become a standard technique in training state-of-the-art language models, where it is used to ensure that the self-attention mechanism in transformers only processes valid preceding contexts.

Key contributors: The concept of masking as applied in modern NLP architectures was popularized by Vaswani et al. in their seminal 2017 paper introducing the Transformer model. This work laid the foundation for subsequent developments in NLP, including models like BERT and GPT, which utilize various forms of masking to train on large text corpora effectively.
