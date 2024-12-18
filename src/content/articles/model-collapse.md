---
slug: model-collapse
summary: Phenomenon where a ML model, particularly in unsupervised or generative learning, repeatedly produces identical or highly similar outputs despite varying inputs, leading to a loss of diversity in the generated data.
title: Model Collapse
---

Model collapse is often encountered in the training of Generative Adversarial Networks (GANs) or other generative models where the model, instead of learning to produce a wide variety of outputs, begins to generate the same or very similar outputs irrespective of different inputs. This occurs due to an imbalance during training, where the generator learns a narrow distribution that is easy to fool the discriminator with, but fails to capture the full diversity of the data distribution. This problem can severely impact the quality and utility of the model, as the outputs no longer represent the range of possible data points in the training set.

The concept of model collapse has been recognized since the early development of GANs in the mid-2010s, following the 2014 introduction of GANs by Ian Goodfellow et al. As GANs and other generative models became more sophisticated, researchers identified and began addressing the issue of collapse in order to improve model performance.

Ian Goodfellow, who introduced GANs, played a crucial role in highlighting and understanding the challenges related to model collapse. Subsequent research by various AI and machine learning researchers has focused on mitigating this problem through techniques like improved training algorithms, architectural changes, and regularization methods.
