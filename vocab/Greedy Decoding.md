---
title: "Greedy Decoding"
summary: "Technique used in ML models, especially in NLP, where the model selects the most likely next item in a sequence at each step."
---
Greedy decoding is commonly applied in sequence generation tasks such as machine translation, text summarization, and speech recognition. It involves choosing the highest probability output at each step of the sequence generation, based on the conditional probability given the previous items. While this method is computationally efficient, it can lead to suboptimal results because it always selects the most probable next step without considering the overall sequence quality. This often results in less diverse and sometimes grammatically incorrect or nonsensical sequences.

Historical Overview: The concept of greedy decoding has been used in various forms of sequence prediction algorithms since at least the early 2000s. It became particularly prominent with the rise of deep learning and encoder-decoder architectures in the 2010s.

Key Contributors: The development of greedy decoding as a method has been influenced broadly by the research community working on statistical machine learning and natural language processing, rather than being attributable to specific individuals. It is a fundamental part of many sequence modeling frameworks that evolved from earlier work on hidden Markov models and other statistical methods.
