---
title: Policy Parameters
summary: Variables in a ML model, particularly in RL, that define the behavior of the policy by determining the actions an agent takes in different states.
---
In reinforcement learning, a policy is a strategy used by an agent to decide the next action based on the current state. Policy parameters are the weights or factors within the policy that are adjusted during training to optimize the agent's performance. These parameters can be part of a neural network (in deep reinforcement learning) or other function approximators. The goal is to find the optimal set of parameters that maximize cumulative rewards over time. Policy parameters are crucial in both model-free and model-based reinforcement learning, influencing how the policy generalizes across different states and learns from interactions with the environment.

Historical overview:
The concept of policy parameters has been integral to reinforcement learning since the field's early development. While reinforcement learning itself has roots going back to the 1950s with research on adaptive behavior and control theory, the formalization of policy parameters became more prominent with the advent of more complex algorithms in the 1980s and 1990s. The rise of deep reinforcement learning in the 2010s, particularly following the success of algorithms like Deep Q-Network (DQN) and policy gradient methods, brought significant attention to the optimization of policy parameters.

Key contributors:
Key contributors to the development and understanding of policy parameters include Richard Sutton and Andrew Barto, who authored the seminal book "Reinforcement Learning: An Introduction," which lays much of the groundwork for modern reinforcement learning. Additionally, John Schulman, who developed Proximal Policy Optimization (PPO) and Trust Region Policy Optimization (TRPO), made significant advancements in optimizing policy parameters efficiently in high-dimensional spaces.