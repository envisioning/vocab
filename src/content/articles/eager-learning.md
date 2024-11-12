---
title: Eager Learning  
summary: Eager learning refers to an approach where a model is built comprehensively from the training data before making predictions, often leading to the creation of an explicit global model.
slug: eager-learning
---

In ML, eager learning is characterized by the comprehensive processing of training data at the time of model creation, resulting in an explicit global model capable of generalizing from the data prior to prediction requests. This contrasts with lazy learning, where the system delays processing until a query is made. Eager learning typically involves the utilization of algorithms such as decision trees, neural networks, and support vector machines (SVMs), which require a full pass through the input data to formulate a predictive model. The advantage of eager learning is its efficiency at query time due to the pre-built model, though it may demand significant computational resources during the training phase. By proactively compiling the necessary hypotheses, eager learners often yield models that are rapidly deployable but might suffer in terms of flexibility compared to lazy methods when faced with new, unseen data variances.

The approach of eager learning gained recognition in the early 1990s with the increasing focus on building predictive models that were computationally efficient at runtime. Its methodologies became particularly popular as part of a larger push towards real-time decision-making systems in the mid-to-late 1990s, driven by advancements and applications in fields such as computer vision and natural language processing.

The development of eager learning has been influenced by contributions from various researchers in AI and ML, particularly by those working on decision trees and neural networks. Ross Quinlan's work on decision tree algorithms like C4.5 exemplifies foundational contributions, providing crucial insights and tools for implementing effective eager learning systems.