---
generality:
- 0.8
- 0.785
- 0.77
- 0.755
- 0.74
- 0.725
- 0.71
slug: markov-blanket
summary: A concept in probabilistic graphical models representing a node's minimal
  set of dependencies, crucial for inferring the node's behavior in a network.
title: Markov Blanket
---

The Markov Blanket of a node within a probabilistic graphical model, such as a Bayesian network, consists of the node's parents, children, and the other parents of its children, which collectively form the minimal set of variables needed to render the node conditionally independent of the rest of the network. Its significance lies in simplifying the computation for probability distributions and reducing complexity in both inference and learning tasks within AI systems. By focusing only on the Markov Blanket, an AI can efficiently perform tasks like feature selection, causal reasoning, and inference, making it a critical component in the design and analysis of complex models.

The concept of Markov Blanket was first used in the context of AI and Bayesian networks in the mid-to-late 1980s, gaining prominence as probabilistic graphical models became popular in the 1990s with the rise of more advanced AI algorithms and computational power.

Key figures in the development and application of the Markov Blanket concept include Judea Pearl, whose work in probabilistic reasoning and causal inference greatly impacted the understanding and utilization of Bayesian networks, along with other pioneers in the field of AI and ML.