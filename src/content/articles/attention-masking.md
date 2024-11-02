---
slug: attention-masking
summary: Technique used in models based on transformers, where it manipulates the
  handling of sequence order and irrelevant elements in ML tasks.
title: Attention Masking
---

Attention masking is a crucial concept in AI, specifically in Natural Language Processing (NLP) tasks that employ transformer models. Transformers are deep learning models, which utilize the attention mechanism to capture contextual relationships among words in a sentence. But the attention mechanism, in its raw form, pays equal attention to all parts of the input sequence, which is not always desirable. Enter the concept of attention masking - it is used to prevent the model from peaking at certain positions of the sequence, effectively forcing it to ignore irrelevant elements or manage sequence order. It is particularly beneficial in tasks like language generation where the prediction for the next word shouldn't be influenced by future words.

Historically, attention masks became popular with the introduction of the Transformer model in "Attention is All You Need" by Vaswani et al., published in 2017. Integrating attention masking into AI models has been one of the key reasons behind the impressive performance of various NLP applications including machine translation, text summarization, and more recently in the GPT-3 model.

The concept of attention masking owes much to the work of Ashish Vaswani and his team, who introduced the 'Transformer model' in 2017. The technique has been further utilized and refined in important subsequent works, including those by OpenAI with their GPT (Generative Pretrained Transformer) models.