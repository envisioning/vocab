---
title: Self-Supervised Pretraining
summary: ML approach where a model learns to predict parts of the input data from other parts without requiring labeled data, which is then fine-tuned on downstream tasks.
---
Self-supervised pretraining leverages the inherent structure within the data to generate pseudo-labels, allowing the model to learn useful representations from vast amounts of unlabeled data. This approach involves tasks like predicting the next word in a sentence, filling in masked parts of an image, or reconstructing corrupted data. Once pretrained, these models capture rich and generalizable features that can be fine-tuned with a smaller set of labeled examples for specific tasks such as classification, detection, or translation. This technique has been particularly impactful in natural language processing (NLP) with models like BERT and GPT, and in computer vision with models like SimCLR and BYOL.

Historical Overview:
The concept of self-supervised learning began gaining traction in the mid-2010s, with significant advancements around 2018-2019, particularly in the field of NLP with the introduction of models like BERT (2018) and GPT-2 (2019).

Key Contributors:
Notable contributors to the development of self-supervised pretraining include researchers at Google AI who developed BERT (Jacob Devlin et al.), and OpenAI with the creation of the GPT series (Alec Radford et al.). In computer vision, contributions from Yann LeCun at Facebook AI Research (FAIR) and researchers like Ting Chen (SimCLR) and Jean-Baptiste Grill (BYOL) have been significant.