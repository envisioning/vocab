---
title: Bias-Variance Dilemma
summary: Fundamental problem in supervised ML that involves a trade-off between a model’s ability to minimize error due to bias and error due to variance.
---
In machine learning, the bias-variance dilemma highlights the challenges in achieving a model that simultaneously minimizes both bias and variance, crucial for optimal performance. Bias refers to errors introduced by approximating complex real-world problems with simpler models; it manifests when the model is too simplistic to capture the underlying data patterns. Variance, on the other hand, refers to the model's sensitivity to small fluctuations in the training set. High variance can cause an algorithm to model the random noise in the training data, rather than the intended outputs (overfitting). Ideally, one seeks to balance these two types of errors to minimize the total expected error of the model, but improving one typically worsens the other.

Historical overview:
The terms bias and variance were formally defined in the context of machine learning in the 1990s, though the conceptual underpinnings date back to earlier statistical theories. The bias-variance tradeoff became a cornerstone concept in the field of machine learning and statistics by the late 1990s, especially with the popularization of complex models like neural networks which are particularly prone to high variance.

Key contributors:
Key theoretical contributions to understanding and formalizing the bias-variance dilemma came from statisticians and computer scientists such as Leo Breiman and Andrew Ng. Their work, along with many others, has provided a deep understanding of the impact of bias and variance on machine learning algorithms and guided the development of techniques to mitigate the dilemma, such as cross-validation and regularization.