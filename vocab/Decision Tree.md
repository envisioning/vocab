---
title: Decision Tree
summary: Flowchart-like tree structure where each internal node represents a "test" on an attribute, each branch represents the outcome of the test, and each leaf node represents a class label (decision taken after computing all attributes).
---
Decision Trees are a popular method used in machine learning for both classification and regression tasks. They mimic human decision-making processes by sequentially asking yes/no questions or making decisions based on certain values of input features, leading to a final prediction at the leaf nodes. Their structure allows for easy visualization and interpretation, making them particularly appealing for analytical purposes. Decision Trees work by selecting the best feature at each step to split the data into subsets, using metrics like Gini impurity or entropy for classification tasks, and variance reduction for regression. They can handle both numerical and categorical data but are prone to overfitting, especially with complex data or without proper pruning techniques.

The concept of Decision Trees has been around since the 1960s, with notable development and use in the ID3 algorithm by Ross Quinlan in the 1980s. Their popularity in machine learning has grown due to their simplicity and the intuitive nature of the model structure.

Ross Quinlan is a significant figure in the development of Decision Tree algorithms, particularly for his work on the ID3 algorithm and its successors, like C4.5 and C5.0, which introduced various improvements such as handling continuous attributes and pruning methods to reduce overfitting.

