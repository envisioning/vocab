---
title: "Ensemble Learning"
summary: "ML paradigm where multiple models (often called "weak learners") are trained to solve the same problem and combined to improve the accuracy of predictions."
---
Ensemble learning capitalizes on the idea that a group of weak learners can come together to form a strong learner, thereby improving model performance, especially in complex problem spaces where a single model may struggle. This technique is fundamental in reducing bias and variance, two core issues in machine learning model performance. By aggregating the predictions of several models, ensemble methods can often achieve higher accuracy than any individual model. Common approaches include bagging, which builds multiple models (usually of the same type) from different subsamples of the training dataset, and boosting, which builds models sequentially by adjusting the weights of instances based on the prediction error of the previous model. Another popular method is stacking, which involves combining different types of models and using a meta-model to learn how to best combine their predictions.

Historical Overview: The concept of ensemble learning emerged prominently in the late 1990s, with the introduction of algorithms like AdaBoost in 1996, which demonstrated the practical benefits of boosting. Bagging was introduced around the same time, with Random Forests, an extension of bagging, becoming popular in the early 2000s.

Key Contributors: Yoav Freund and Robert Schapire are key figures in the development of ensemble learning, particularly for their work on AdaBoost. Leo Breiman, another significant contributor, is known for his work on bagging and the Random Forest algorithm. These individuals, among others, have laid the foundational work for what has become a critical area in machine learning research and application.

