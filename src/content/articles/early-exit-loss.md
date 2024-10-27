---
category: ARCH, IMPL
generality:
  - 0.68
  - 0.66
  - 0.64
  - 0.62
  - 0.6
  - 0.58
  - 0.56
slug: early-exit-loss
summary: An optimization technique in AI models that balances overall accuracy and computational efficiency.
title: Early Exit Loss
---

Early Exit Loss pertains to a strategy utilized in designing deep neural network architectures, specifically those utilizing early exiting. The crux of this concept is the creation of an optimal trade-off between computational cost and classification accuracy of multi-classification tasks in Deep Learning models. It primarily targets efficient inference on devices with limited computational resources. By introducing auxiliary classifiers at different layers of the architecture, a model may decide to exit early during the inference stage if the intermediate result reaches a certain confidence level. This allows the model to spend less computational resource where the prediction is easier, while maintaining accuracy.

Historically, the concept behind Early Exit Loss falls within the broader exploration of efficient neural network design, which gained traction as deep learning models grew increasingly complex and computationally demanding, particularly from around 2015 onwards. It became an essential strategy for deploying high-performance models in infrastructures with computational constraints.

While an exact originator for 'Early Exit Loss' per se is not definitively known, many researchers have contributed to the underlying ideas. Notably, the 'BranchyNet' model proposed by researchers Ankur Garg and Jonathan K. Su in 2016 had a significant impact in promoting the concept of early-exit architectures.
