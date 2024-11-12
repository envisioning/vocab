---
title: Minimax
summary: A decision-making strategy in game theory and AI that aims to minimize the possible losses in worst-case scenarios by maximizing the worst-case outcome.
slug: minimax
---

The Minimax algorithm is central to decision-making processes in AI, particularly in adversarial environments like game-playing AI, such as chess or tic-tac-toe. It operates on the principle of minimizing the possible loss for a worst-case scenario, effectively finding the action for a player that maximizes the minimum payoff. In AI, the algorithm recursively anticipates opponent moves, evaluates board states by assigning utility values, and selects the optimal move that ensures the highest benefit, assuming the opposition acts optimally to minimize this benefit. This ensures robust planning under uncertainty and aligns with the concept of Nash equilibrium in zero-sum games.

The concept of Minimax in the context of game theory was introduced in the early 20th century, specifically gaining attention in 1928 with John von Neumann's work on zero-sum games. It became particularly relevant in the field of AI and computer science around the late 1950s to 1960s with the advent of algorithms for computer chess.

Key contributors to the development of the Minimax algorithm concept include John von Neumann, who laid the theoretical foundations through game theory. Later, researchers in AI, such as Claude Shannon, contributed to practical applications and strategy development in computer-based decision-making systems.