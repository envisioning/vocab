---
category: CORE, DATA
generality:
- 0.875
- 0.87
- 0.855
- 0.84
- 0.835
- 0.83
- 0.825
slug: learnability
summary: Capacity of an algorithm or model to effectively learn from data, often measured by how well it can generalize from training data to unseen data.
title: Learnability
---

**Expert-level explanation:** Learnability is a core concept in machine learning theory, focusing on how well a machine learning algorithm can infer patterns from a limited set of training examples and perform well on new, unseen data. It is closely tied to generalization and is often studied under frameworks like the Probably Approximately Correct (PAC) learning model. Learnability evaluates whether a hypothesis class (set of possible models) can be learned efficiently, given finite data, and how complexity and noise in the data affect the learning process. It also considers the trade-offs between sample size, computational complexity, and error rates to determine the feasibility of learning in various settings. Factors such as overfitting, underfitting, and model complexity are integral to understanding the learnability of a system.

**Historical overview:** The formal study of learnability began in the late 1980s, particularly with the introduction of the PAC learning framework by Leslie Valiant in 1984. The concept gained momentum as machine learning theory advanced in the 1990s and early 2000s, with deeper explorations of how different classes of problems (e.g., convex vs. non-convex) affect learnability.

**Key contributors:** Leslie Valiant is the primary figure associated with the concept of learnability, thanks to his development of PAC learning theory in 1984. Other significant contributors include Vladimir Vapnik and Alexey Chervonenkis, whose work on the VC dimension provided essential tools for understanding the complexity and capacity of learning models in relation to their generalization abilities.