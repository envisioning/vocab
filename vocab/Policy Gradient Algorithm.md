---
title: Policy Gradient Algorithm
summary: Type of RL algorithm that optimizes the policy directly by computing gradients of expected rewards with respect to policy parameters.
---
Policy gradient algorithms aim to find the best policy, a strategy that defines the agent's actions based on its states, by optimizing it directly. Unlike value-based methods that estimate the value of actions or states, policy gradient methods adjust the parameters of the policy to maximize expected rewards. This is done by calculating the gradient of the expected reward concerning the policy parameters and using this gradient to update the policy parameters. This approach is advantageous in high-dimensional action spaces and for problems requiring stochastic policies. Algorithms like REINFORCE, Actor-Critic, and Proximal Policy Optimization (PPO) fall under this category, where the objective is to improve the policy iteratively based on the feedback from the environment.

Historical Overview:
The concept of policy gradient methods dates back to the late 1980s and early 1990s, but it gained significant traction in the early 2000s with advancements in computational power and the development of the REINFORCE algorithm by Ronald J. Williams in 1992. The advent of more sophisticated and practical implementations like PPO by OpenAI in 2017 further popularized policy gradient methods in modern reinforcement learning applications.

Key Contributors:
Significant contributions to the development and popularization of policy gradient methods include Ronald J. Williams, who introduced the REINFORCE algorithm. Later, Richard S. Sutton and Andrew G. Barto contributed to the theoretical underpinnings and practical aspects of reinforcement learning. More recently, researchers at OpenAI, including John Schulman, have advanced the field with algorithms like Proximal Policy Optimization (PPO), making policy gradient methods more robust and applicable to a wider range of problems.