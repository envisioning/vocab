---
slug: actor-critic-models
summary: 'Reinforcement learning architecture that includes two components: an actor
  that determines the actions to take and a critic that evaluates those actions to
  improve the policy.'
title: Actor-Critic Models
---

Actor-Critic models blend the strengths of value-based and policy-based reinforcement learning approaches. The actor component is responsible for selecting actions based on a policy, which can be stochastic or deterministic. The critic component, on the other hand, evaluates the action chosen by the actor by computing a value function, typically the expected return or advantage. This evaluation guides the actor to adjust its policy to maximize long-term rewards. The primary advantage of this architecture is that it reduces variance in policy gradient estimates and can handle continuous action spaces effectively. This architecture is essential in applications such as robotics, game playing, and autonomous driving, where the ability to refine and improve policy decisions through feedback is critical.

The concept of Actor-Critic models emerged in the 1980s, with key developments in the late 1980s and 1990s as reinforcement learning research matured. The term and framework gained significant popularity with the rise of deep learning and its application in deep reinforcement learning around 2015.

The development of Actor-Critic models is attributed to Richard S. Sutton, who introduced the term in the context of temporal-difference learning. Further significant contributions were made by researchers such as Andrew Barto and John Tsitsiklis, who helped refine the algorithms. More recent advancements in deep Actor-Critic models have been driven by teams at institutions like DeepMind and OpenAI.