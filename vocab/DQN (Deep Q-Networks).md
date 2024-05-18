---
title: DQN (Deep Q-Networks)
summary: RL technique that combines Q-learning with deep neural networks to enable agents to learn how to make optimal decisions from high-dimensional sensory inputs.
---
Deep Q-Networks (DQN) are pivotal in bridging traditional reinforcement learning with deep learning's power to handle complex, high-dimensional environments. This approach utilizes a deep neural network to approximate the Q-value function, which traditionally estimates the utility of taking a given action in a particular state. DQNs help overcome the challenges of direct Q-learning in environments with vast state and action spaces, as the neural network efficiently generalizes across similar states. This capability allows DQNs to operate effectively in scenarios such as video games or robotic control, where sensory inputs like images form the state space. DQNs use techniques like experience replay and target networks to stabilize learning and prevent the rapid forgetting of earlier learned states.

Historical Overview:
The concept of DQNs was introduced in 2013 by researchers at DeepMind, with their prominence rising sharply after the successful demonstration of their capabilities in playing Atari 2600 video games directly from pixel inputs in a landmark 2015 paper.

Key Contributors:
The development of DQNs is primarily attributed to the team at DeepMind, with significant contributions from researchers such as Volodymyr Mnih, who was the lead author on the foundational papers that detailed the application and theoretical underpinnings of DQNs. The integration of deep learning into reinforcement learning via DQNs marked a significant milestone in AI research, showcasing practical applications and robustness in complex, real-world-like environments.