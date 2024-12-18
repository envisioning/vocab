---
slug: surrogate-objective
summary: Alternative goal used to approximate or replace a primary objective in optimization problems, especially when the primary objective is difficult to evaluate directly.
title: Surrogate Objective
---

In machine learning and optimization, a surrogate objective is employed when the primary objective function is either expensive to compute, noisy, or difficult to measure. This approach is commonly used in reinforcement learning, where the true objective (e.g., the long-term reward) is replaced by a more manageable objective that is easier to optimize. For instance, in policy gradient methods, the true objective of maximizing expected reward is approximated by a surrogate objective that simplifies the optimization process while still guiding the model towards better performance. This technique allows for more efficient and practical training of models by reducing computational costs and improving convergence properties.

The concept of surrogate objectives has been used since the early days of optimization theory, but it gained significant traction in the field of machine learning in the 1990s and 2000s with the advent of more complex learning algorithms and reinforcement learning methods.

Significant contributors include Richard S. Sutton and Andrew G. Barto, who popularized the use of surrogate objectives in reinforcement learning through their work on policy gradient methods and the development of foundational texts such as "Reinforcement Learning: An Introduction". Additionally, the broader optimization community has extensively explored surrogate objectives, with contributions from scholars like John N. Tsitsiklis and Dimitri P. Bertsekas.
