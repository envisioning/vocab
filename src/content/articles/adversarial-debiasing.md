---
category: CORE, IMPL
generality:
  - 0.715
  - 0.69
  - 0.675
  - 0.66
  - 0.645
  - 0.62
  - 0.605
slug: adversarial-debiasing
summary: ML technique aimed at reducing bias in models by using adversarial training, where one network tries to predict sensitive attributes and another tries to prevent it.
title: Adversarial Debiasing
---

Adversarial debiasing involves a setup where two neural networks are trained in opposition to each other to mitigate bias. The first network, called the "adversary," attempts to predict a protected attribute (like race or gender) from the data. Simultaneously, the main network, which performs the primary task (such as classification), is trained not only to improve its performance on this task but also to minimize the adversary’s ability to predict the protected attribute. This dynamic creates a balancing act where the main network learns to make decisions that are less influenced by the sensitive attribute, thus reducing bias. This method leverages the adversarial training framework popularized in Generative Adversarial Networks (GANs) but applies it to the problem of fairness in machine learning. By iteratively refining both networks, adversarial debiasing can lead to fairer models that perform well on their primary tasks while being less discriminatory.

The concept of adversarial debiasing emerged in the mid-2010s, building on the success of GANs introduced in 2014 by Ian Goodfellow and his colleagues. It gained traction as the AI and machine learning community became increasingly aware of and focused on the ethical implications of biased models around 2017-2018.

The technique builds on foundational work by Ian Goodfellow and others in adversarial training with GANs. Researchers such as Brian Hu Zhang, Blake Lemoine, and Margaret Mitchell have significantly contributed to the development and application of adversarial debiasing methods, especially in exploring fairness and ethical AI. Their work in integrating adversarial training to mitigate biases has helped in advancing the practical application of these concepts in various machine learning domains.