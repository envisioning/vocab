---
title: NARS (Non-Axiomatic Reasoning System)
summary: A resource-bounded, experience-grounded reasoning framework that performs defeasible inference and adaptive belief revision under the Assumption of Insufficient Knowledge and Resources.
slug: nars-non-axiomatic-reasoning-system
---

NARS is an implemented formal framework (based on Non-Axiomatic Logic, NAL) that models intelligent reasoning when knowledge and computational resources are limited, using explicit representations of uncertainty and revision rules to make and update beliefs incrementally.

Designed by Pei Wang, NARS operationalizes the Assumption of Insufficient Knowledge and Resources (AIKR) by providing algorithms and data structures for attention-limited, time-bounded inference and learning. Its core formalism, NAL, represents truth-values as a pair (frequency, confidence) derived from observed evidence rather than as single Bayesian probabilities; inference is governed by a repertoire of local truth-value transformation and belief-revision rules (e.g., deduction, induction, abduction, revision) that are resilient to inconsistency and incompleteness. NARS also integrates mechanisms for priority/attention allocation, memory budgeting, and forgetting, making it suitable for open-world, continual learning scenarios where agents must trade off depth of reasoning against real-time constraints. Compared with purely probabilistic or symbolic systems, NARS emphasizes adaptive, defeasible reasoning and explicit resource-awareness, making it applicable to autonomous agents, cognitive modeling, and domains requiring continual, real-time knowledge integration.

First proposed in the late 1990s by Pei Wang, the idea and implementations of NARS gained broader attention through the 2000s and 2010s as the AI community increasingly studied resource-bounded, continual, and cognitive approaches to reasoning.

Key contributors include Pei Wang (originator and principal developer), the researchers who formalized and extended Non-Axiomatic Logic, and the OpenNARS community and other implementers who have produced reference systems, experimental extensions, and application-focused ports.