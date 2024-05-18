---
title: "SoftMax"
summary: "Function that converts a vector of numerical values into a vector of probabilities, where the probabilities of each value are proportional to the exponentials of the input numbers."
---
SoftMax function plays a crucial role in neural networks, particularly in classification problems where the output can be one of several classes. It is commonly used in the final layer of a neural network model to ensure that the output values are in a probability distribution format, meaning that each output value is between 0 and 1, and the sum of all the output values equals 1. This characteristic makes SoftMax particularly useful for multi-class classification problems, as it allows the model to give a probabilistic interpretation to the outputs, indicating the confidence level of the model in its prediction. The function computes the exponential (e^) of each input value, divides each by the sum of the exponentials of all the input values, thereby normalizing these values to range between 0 and 1.

The concept of the SoftMax function has been around since the early days of neural networks, gaining prominence in the late 1980s and early 1990s as part of the development of multinomial logistic regression and neural network classification models.

While the SoftMax function itself is a mathematical concept that has been known for a long time, its application to neural networks and machine learning was popularized by researchers in the field of deep learning. Notable figures include Geoffrey Hinton, Yann LeCun, and Yoshua Bengio, among others, who have contributed to the development and understanding of neural networks where SoftMax has been applied extensively.

