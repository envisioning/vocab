---
title: Policy Gradient
summary: Class of algorithms in RL that optimizes the parameters of a policy directly through gradient ascent on expected future rewards.
---
Policy gradient methods are crucial in reinforcement learning (RL) for solving problems where the action space is continuous or the policy cannot easily be expressed as a value function. Unlike value-based methods that first estimate the value of taking an action in a given state and derive a policy based on these values, policy gradient methods directly adjust the policy's parameters by computing gradients that are expected to increase the total reward. These methods are especially useful because they can inherently learn stochastic policies, allowing for exploration of the action space. Common implementations of policy gradient include REINFORCE and Actor-Critic algorithms, where the latter uses additional value function approximations to reduce the variance of the gradient estimates.

Historical Overview:
The concept of policy gradient in reinforcement learning emerged prominently in the late 1990s and early 2000s. Significant attention was garnered with the introduction of the REINFORCE algorithm by Williams in 1992, which provided a foundation for future developments in policy gradient methods.

Key Contributors:
Ronald J. Williams was pivotal in the development of policy gradient methods with his formulation of the REINFORCE algorithm. Later contributions by researchers like Richard S. Sutton further advanced the theoretical framework, particularly through the development and refinement of Actor-Critic methods, integrating value-based approaches with policy gradient techniques to enhance learning stability and efficiency.