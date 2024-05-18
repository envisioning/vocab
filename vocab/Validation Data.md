---
title: Validation Data
summary: Subset of data used to assess the performance of a model during the training phase, separate from the training data itself.
---
Validation data plays a crucial role in the development of machine learning models by providing an unbiased evaluation of a model's performance during the iterative process of training. This data set is used to fine-tune model parameters, adjust hyperparameters, and prevent overfitting—a scenario where a model is tuned too closely to the training data and performs poorly on new, unseen data. It acts as a middle ground between training data (used to teach the model) and test data (used to evaluate the model after training is complete), helping to ensure that any improvements in the model's learning algorithm are actually resulting in a more effective general-purpose model.

Historical overview:
The concept of splitting data into training, validation, and test sets became more formalized with the advent of more complex models in the 1990s, especially in neural networks where the risk of overfitting is significant due to the model's depth and complexity.

Key contributors:
Although the use of validation in model training has been a part of statistical practices for decades, its current form in machine learning has been shaped significantly by researchers in the field of neural networks. Key figures such as Geoffrey Hinton, Yann LeCun, and Yoshua Bengio have contributed to refining the techniques that utilize validation data effectively within deep learning paradigms.