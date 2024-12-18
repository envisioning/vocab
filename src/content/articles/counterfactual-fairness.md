---
slug: counterfactual-fairness
summary: ML concept that ensures decisions remain fair by being unaffected by sensitive attributes, such as race or gender, in hypothetical scenarios where these attributes are altered.
title: Counterfactual Fairness
---

Counterfactual fairness addresses biases in algorithmic decision-making by considering how decisions would change if an individual's sensitive attributes were different. It uses counterfactual reasoning, which involves creating a hypothetical scenario where only the sensitive attribute is altered, and then checking if the decision outcome changes. If the decision remains the same, the model is deemed counterfactually fair. This approach ensures that the model's decisions are not indirectly influenced by sensitive attributes through correlated variables, thereby addressing complex dependencies and providing a robust framework for fairness in AI systems.

The concept of counterfactual fairness was introduced in 2017, gaining attention as fairness in AI and machine learning became a critical concern. The rise of AI applications in socially impactful domains like hiring, lending, and law enforcement highlighted the need for rigorous fairness criteria, leading to the development of counterfactual fairness to address these ethical challenges.

The primary contributors to the development of counterfactual fairness are Moritz Hardt, Eric Price, and Nati Srebro, whose 2017 paper laid the foundational framework for this concept. Their work built on earlier research in causal inference and fairness in machine learning, integrating these fields to address the nuanced issues of fairness in algorithmic decisions.