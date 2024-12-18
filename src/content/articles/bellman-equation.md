---
slug: bellman-equation
summary: Recursive formula used to find the optimal policy in decision-making processes, particularly in the context of dynamic programming and RL.
title: Bellman Equation
---

The Bellman equation, integral to dynamic programming, articulates the principle of optimality, which asserts that an optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision. In the context of reinforcement learning, it helps in determining the value function of a state, essentially describing the best possible expected future reward that can be achieved from that state. This value is calculated by taking into account the immediate reward from a chosen action and the discounted future rewards received from the next state, which is determined by the policy followed.

Introduced by Richard Bellman in the 1950s as part of his development of dynamic programming, the Bellman equation has been foundational in many areas of decision making, operations research, and control engineering. It gained prominence as it laid the groundwork for solving complex optimization problems by breaking them down into simpler, recursive subproblems.

Richard Bellman, an American applied mathematician, is the primary contributor to the development of the Bellman equation, having introduced it as a part of his broader work on dynamic programming. His contributions have profoundly influenced various fields, including economics, biology, and engineering, particularly in areas involving decision-making over time.