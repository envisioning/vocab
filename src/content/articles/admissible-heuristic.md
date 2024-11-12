---
title: Admissible Heuristic
summary: A heuristic is considered admissible if it never overestimates the cost of reaching the goal in search algorithms, ensuring an optimal solution.
slug: admissible-heuristic
---

An admissible heuristic is a fundamental concept in AI, particularly within search algorithms like A* search, where it provides an estimate of the minimum cost from the current state to the goal. The core requirement of an admissible heuristic is that it always understates or precisely estimates the cost, never overstating it, which guarantees the optimality of the solutions found by algorithms such as A*. This characteristic makes admissible heuristics crucial in ensuring the efficiency and effectiveness of search processes in AI applications like pathfinding, puzzle-solving, and automated planning. Theoretical underpinnings link admissibility to the concept of consistency (or monotonicity), which further ensures not only optimality but also that the search algorithm performs efficiently without unnecessary exploration of paths.

The concept of admissible heuristics gained traction in the 1960s as part of the broader development of heuristic search strategies, particularly with the formalization and widespread recognition of the A* algorithm in the late 1960s and early 1970s.

One of the key figures in the development of admissible heuristics and related algorithms is Peter Hart, along with Nils Nilsson and Bertram Raphael, who were instrumental in formalizing these concepts through their work on the A* search algorithm. Their contributions laid the groundwork for the formulation and application of heuristics in AI search problems.