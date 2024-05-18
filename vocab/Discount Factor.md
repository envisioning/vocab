---
title: Discount Factor
summary: Multiplicative factor used to reduce future values or rewards to their present value in decision-making processes, particularly in reinforcement learning.
---
In reinforcement learning (RL), the discount factor, typically denoted as γ (gamma), is crucial for evaluating future rewards by weighting them less as they become more distant. This parameter ranges between 0 and 1, where a value closer to 0 places more emphasis on immediate rewards, while a value near 1 makes the agent consider future rewards more heavily. The discount factor ensures that the cumulative reward, which the RL agent aims to maximize, is finite and manageable, preventing infinite sums in cases of ongoing tasks. In financial contexts, the discount factor serves a similar purpose by translating future cash flows or earnings to their present value, accounting for the time value of money, which is fundamental for investment analysis and valuation.

Historical Overview:
The concept of discounting future rewards can be traced back to the early developments of time preference theory in economics during the 19th century. In reinforcement learning, the formal introduction of the discount factor was pivotal in the 1980s, particularly with the publication of foundational texts and research papers on Markov Decision Processes (MDPs) and dynamic programming by Richard Bellman.

Key Contributors:
Richard Bellman is a significant figure in the development of the discount factor concept within dynamic programming and reinforcement learning. His work in the 1950s laid the groundwork for many modern RL algorithms that utilize the discount factor. Additionally, economists like Paul Samuelson contributed to the understanding of discounting in economic theory with his work on the discounted utility model.