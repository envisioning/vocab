---
title: Q-Learning
summary: Model-free reinforcement learning algorithm that seeks to learn the value of actions in a given state, enabling an agent to maximize cumulative reward over time.
---
**Detailed Explanation:**  
Q-learning works by iteratively updating an action-value function, known as the Q-function, which estimates the expected utility (or reward) of taking a particular action in a specific state. The core idea is that the agent interacts with the environment by taking actions and receiving feedback in the form of rewards, which it uses to refine its Q-values. This process allows the agent to learn an optimal policy, even in environments where the model (i.e., the transition probabilities) is unknown. Q-learning is "off-policy," meaning it can learn from actions outside the current policy, making it robust for applications such as game playing, robotics, and navigation.

**Historical Overview:**  
Q-learning was introduced by Christopher Watkins in 1989 in his Ph.D. thesis. It gained popularity during the 1990s and 2000s as a foundational reinforcement learning algorithm and saw increased application with the rise of deep learning in the 2010s, particularly through its integration into Deep Q-Networks (DQN) in 2015.

**Key Contributors:**  
Christopher J.C.H. Watkins is the primary contributor to Q-learning, having developed the algorithm during his Ph.D. at the University of Cambridge. Later developments, particularly the use of deep neural networks to approximate the Q-function, were advanced by researchers such as Volodymyr Mnih, who introduced Deep Q-Networks (DQN) under the supervision of Demis Hassabis and colleagues at DeepMind.