---
slug: multi-token-prediction
summary: AI technique used in NLP where a model generates multiple output tokens simultaneously, often improving coherence and speed compared to single-token generation methods.
title: Multi-Token Prediction
---

In multi-token prediction, models are designed to produce several words or tokens at once during each step of text generation, rather than predicting one token at a time. This approach leverages parallel processing capabilities, significantly speeding up text generation processes and often enhancing the contextual accuracy of the generated content. Multi-token prediction can be implemented using various architectures, including modified transformers and recurrent neural networks (RNNs), where adjustments are made to accommodate the simultaneous output of multiple tokens. This method is particularly beneficial in applications requiring real-time generation of text, such as interactive chatbots or real-time translation systems, where speed and contextual understanding are crucial.

Multi-token prediction has roots in advancements in sequence-to-sequence models, which began to significantly impact NLP around the mid-2010s. The concept of predicting more than one token per sequence iteration gained traction with the introduction and refinement of transformer models around 2017, which inherently supported parallelization in processing input data.

The development of multi-token prediction techniques has been closely tied to the evolution of transformer architectures, primarily driven by researchers at institutions like Google Brain and OpenAI. Notable figures in the broader field of transformers, which underpin multi-token prediction capabilities, include researchers such as Ashish Vaswani, who was instrumental in the development of the original transformer model.
