---
title: hillclimb
summary: A search algorithm that iteratively moves towards local optima by making incremental changes to a current solution.
slug: hillclimb
---

Hill climbing is a local search algorithm used extensively in AI due to its simplicity and efficiency in solving optimization problems. The algorithm starts with an arbitrary solution and iteratively makes small changes to improve the current state, evaluating successive states using an evaluation function. The primary advantage of hill climbing lies in its ability to find solutions without needing an exhaustive exploration of the entire solution space, which is particularly advantageous in high-dimensional problems. However, it is prone to getting stuck in local optima and does not guarantee finding the global optimum. Variants such as stochastic hill climbing and simulated annealing have been developed to mitigate these limitations by incorporating randomness or allowing occasional "downhill" moves.

The concept and formalization of hill climbing trace back to the mid-20th century, aligning with the rise of interest in AI during the 1950s and 1960s. The method gained prominence as computational resources expanded and optimization problems became critical in various AI applications.

Allen Newell and Herbert A. Simon were pivotal in the development of hill climbing algorithms as part of their research on problem-solving, particularly through their work on the Logic Theorist and General Problem Solver, early AI programs designed to mimic human cognitive processes. Their contributions established foundational principles for heuristic search strategies in AI.