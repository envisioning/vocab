---
title: Q-Value
summary: Measure used in RL to represent the expected future rewards that an agent can obtain, starting from a given state and choosing a particular action.
---
In reinforcement learning, the Q-value, or action-value, quantifies the expected utility of taking a specific action in a given state, under a particular policy. This measure is crucial for agents to make decisions that maximize cumulative rewards. Q-values are updated iteratively through learning processes such as Q-learning or Deep Q-Networks (DQN), using the Bellman equation. This equation recursively adjusts Q-values based on the reward received for an action plus the highest Q-value for the next state, discounted by a factor that represents the importance of future rewards.

Historical overview:
The concept of Q-value was introduced in conjunction with the development of Q-learning by Christopher Watkins in his 1989 PhD thesis. It gained prominence in the early 1990s as a foundational element in various reinforcement learning algorithms.

Key contributors:
Christopher Watkins is credited with the development of the Q-learning algorithm, which centrally features the use of Q-values. His work laid the groundwork for many advances in reinforcement learning, including the exploration of efficient methods for updating Q-values in complex environments.