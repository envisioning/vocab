---
title: "Cross Validation"
summary: "Statistical method used to estimate the skill of ML models on unseen data by partitioning the original dataset into a training set to train the model and a test set to evaluate it."
---
Cross-validation is a cornerstone technique in machine learning that addresses the need for assessing a model's ability to generalize to new, unseen data. It involves dividing the dataset into multiple subsets or "folds," then systematically using one fold for validation while the remaining folds are used for training. This process is repeated such that each fold serves as the validation set exactly once. The most common form of cross-validation is k-fold cross-validation, where the dataset is split into k subsets. The model's performance is then averaged over the rounds, providing a more robust estimate of its effectiveness than a single train-test split. This method helps mitigate overfitting and underfitting by ensuring that the model's performance is not dependent on the specific way the data is split. It is widely used in situations where the available data is limited and maximizes the amount of data that can be used for training the model.

The concept of cross-validation emerged in the field of statistics as early as the 1970s, gaining prominence in machine learning and data science in subsequent decades. Its development is attributed to the broader efforts within statistical research to validate models in a robust and repeatable way, especially in scenarios with limited datasets.

While the idea of cross-validation has been a collaborative development across many fields, one notable contributor is Bradley Efron, who introduced the related concept of the bootstrap method in 1979, which shares the principle of resampling. However, the development and popularization of cross-validation techniques are distributed across the broader statistical and machine learning communities without a singular figure being credited for its invention.

