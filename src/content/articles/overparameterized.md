---
category: CORE, ARCH
generality:
  - 0.63
  - 0.605
  - 0.58
  - 0.555
  - 0.53
  - 0.505
  - 0.48
slug: overparameterized
summary: ML model that has more parameters than the number of data points available for training.
title: Overparameterized
---

In machine learning, an overparameterized model has a number of parameters that exceeds the amount of training data. This can lead to concerns about overfitting, where the model learns to perform very well on the training data but generalizes poorly to unseen data. However, recent research, particularly in deep learning, has shown that overparameterized models can achieve remarkable generalization performance, attributed to their capacity to capture complex patterns in data and the use of regularization techniques to mitigate overfitting. These models leverage the implicit regularization effects of stochastic gradient descent (SGD) and other optimization algorithms, which help in finding parameters that generalize well despite the high parameter count.

The term overparameterized became significant with the rise of deep learning in the early 2010s. While overparameterization was traditionally seen as problematic due to the risk of overfitting, the success of deep neural networks like AlexNet in 2012 demonstrated that highly parameterized models could perform exceptionally well, shifting the perception of overparameterization in machine learning.

Key figures in the understanding and advancement of overparameterized models include Geoffrey Hinton, Yann LeCun, and Yoshua Bengio, who were instrumental in the development of deep learning techniques. Additionally, researchers like Zhi-Qin John Xu and others have contributed to theoretical insights into why overparameterized models can generalize well despite their complexity.
