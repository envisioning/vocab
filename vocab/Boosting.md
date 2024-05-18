---
title: "Boosting"
summary: "ML ensemble technique that combines multiple weak learners to form a strong learner, aiming to improve the accuracy of predictions."
---
Boosting is a significant ensemble method in machine learning that focuses on converting a collection of weak learners into a strong one. A weak learner is defined as a classifier that performs slightly better than random guessing. The core idea behind boosting is to iteratively train weak classifiers with respect to a distribution and to add them to a final model where they vote on the final prediction. The distribution of data points is adjusted at each iteration so that the weights of incorrectly classified instances are increased, thereby forcing subsequent classifiers to focus more on difficult cases. This process reduces bias and variance, leading to improved model accuracy. AdaBoost (Adaptive Boosting) is one of the most well-known boosting algorithms, which adjusts the weights of incorrectly classified data points at each iteration and combines many weak learners to improve performance.

Historical Overview: The concept of boosting was first introduced in 1990 by Michael Kearns and Leslie Valiant. However, the first practical boosting algorithm, AdaBoost, was introduced by Yoav Freund and Robert Schapire in 1996, which significantly increased the popularity and application of boosting methods in machine learning.

Key Contributors: Yoav Freund and Robert Schapire are key figures in the development of boosting techniques, particularly for their work on AdaBoost, which laid the groundwork for many variations and improvements in boosting algorithms. Their contributions have been pivotal in demonstrating the practicality and effectiveness of boosting in improving machine learning models.

