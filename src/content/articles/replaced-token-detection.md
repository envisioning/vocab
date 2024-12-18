---
slug: replaced-token-detection
summary: Method used in self-supervised learning where the task involves identifying or predicting tokens that have been intentionally altered or replaced in a given sequence.
title: Replaced Token Detection
---

In natural language processing (NLP), replaced token detection is typically used to train models by providing them with a sequence of text where certain tokens (words or subwords) have been replaced by other tokens. The model's objective is to detect which tokens in the sequence are incorrect, leveraging the context provided by the surrounding tokens. This approach forces the model to understand the semantics and syntax of the language, improving its ability to generate coherent and contextually appropriate text. It is a variation of the masked language modeling (MLM) strategy, where instead of masking, tokens are replaced, requiring the model to distinguish between plausible but incorrect replacements and the correct tokens.

The concept of token replacement in model training gained prominence with advancements in pre-trained language models around 2019, when BERT (Bidirectional Encoder Representations from Transformers) popularized masked language modeling. The replaced token detection method emerged shortly after as a variation, particularly in models seeking to improve upon the MLM approach by increasing the difficulty of the prediction task.

The research teams behind models like BERT, particularly from Google AI, and subsequent models such as RoBERTa and ELECTRA, were instrumental in advancing the methods of token detection, including variations like replaced token detection. These teams include influential researchers like Jacob Devlin, who led the development of BERT, and the Google Research Brain Team, which has driven many innovations in self-supervised learning techniques.