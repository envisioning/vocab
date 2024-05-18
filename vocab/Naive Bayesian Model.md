---
title: Naive Bayesian Model
summary: Probabilistic classifier that assumes strong (naive) independence between the features of a dataset.
---
The Naive Bayesian model is based on Bayes' theorem, which describes the probability of an event based on prior knowledge of conditions that might be related to the event. In the context of machine learning, this model is used to predict the probability that a given instance belongs to a particular class, based on the conditional probabilities of the input features. The assumption of feature independence dramatically simplifies the computation, allowing the model to perform well with a small amount of data and making it particularly effective for applications such as spam filtering and document classification.
Historical overview:

The concept of applying Bayesian methods for statistical classification can be traced back to the 1950s, but it gained prominence in the 1960s with the introduction of simple algorithms that applied these principles. The term "naive Bayes" became common in the late 1980s and 1990s as computational methods evolved to handle larger datasets efficiently.
Key contributors:

Although the underlying principles of Bayesian probability were formulated by Thomas Bayes in the 18th century, the adaptation of these principles into a simplified classifier model was contributed by numerous statisticians and computer scientists over the years. Notably, in the field of text categorization and spam filtering, researchers such as Andrew McCallum and Sahami (1998) made significant contributions to popularizing and improving the efficiency of the naive Bayesian models.