---
slug: verifier-theory
summary: Concept in computational complexity theory that focuses on the role of a verifier in determining the correctness of a solution to a problem within a given complexity class.
title: Verifier Theory
---

In computational complexity, verifier theory explores how a computational process, called a verifier, can validate the correctness of proposed solutions to problems. A verifier takes as input a problem instance and a purported solution (or certificate) and determines whether the solution satisfies the problem's requirements. This theory is crucial for understanding classes like NP (nondeterministic polynomial time), where a verifier can check the correctness of solutions in polynomial time, even if finding those solutions might be computationally intensive. The verifier’s role is central in defining complexity classes, understanding decision problems, and developing algorithms for efficiently verifying solutions to hard problems.

The concept of verifier theory dates back to the early developments in computational complexity theory in the 1970s, notably with the formal definition of NP-completeness by Stephen Cook in 1971. It gained significant attention with the introduction of the P vs NP problem, which hinges on the distinction between efficiently finding a solution and efficiently verifying one.

Key contributors to verifier theory include Stephen Cook, who introduced the concept of NP-completeness, and Richard Karp, who further developed the theory by identifying 21 NP-complete problems. Additionally, Leonid Levin independently arrived at similar conclusions around the same time, contributing to the foundational understanding of computational complexity and verifiability.
