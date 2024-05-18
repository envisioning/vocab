---
title: "Bagging"
summary: "ML ensemble technique that improves the stability and accuracy of machine learning algorithms by combining multiple models trained on different subsets of the same data set."
---
Bagging is a powerful ensemble learning method used to reduce variance and help prevent overfitting in predictive models, particularly in decision tree algorithms and their ensemble versions like Random Forests. It involves creating multiple versions of a predictor and using these to get an aggregated predictor. The method works by randomly selecting subsets of the training data with replacement, training a model on each subset, and then averaging the predictions for regression tasks or taking a majority vote for classification tasks. This approach allows the ensemble model to capture various aspects of the data's distribution, leading to a more robust and accurate prediction model.

Historical overview: The concept of Bagging was introduced by Leo Breiman in 1996 as a fundamental breakthrough in the field of machine learning that directly addressed the issues of variance and overfitting in decision trees.

Key contributors: The primary contributor to the development of Bagging is Leo Breiman, a statistician and computer scientist, who introduced and formalized the technique, significantly influencing the direction of ensemble learning methods in machine learning.

