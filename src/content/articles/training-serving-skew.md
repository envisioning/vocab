---
title: Training Serving Skew
summary: A discrepancy that occurs when the data distributions used during the training of a model differ from those encountered during its serving or inference phase.
slug: training-serving-skew
---

Training serving skew is a critical issue in AI systems where the learned model may produce inaccurate predictions or decisions due to discrepancies between the data it was trained on and the data it encounters in production. This divergence can stem from a variety of sources, such as changes in data distribution over time, noise or biases that weren't present in the training data, or differences in preprocessing steps applied during training versus serving. Addressing training serving skew is essential for maintaining model performance and reliability, often requiring strategies like continuous model monitoring, retraining with up-to-date data, or employing domain adaptation techniques. It is a prevalent concern in areas like real-time prediction systems, autonomous vehicles, and any application where environmental or data dynamics might shift post-deployment.

The term "training serving skew" began to gain traction around the early 2000s as ML applications in various industries highlighted discrepancies between operational and training environments. It became more well-known as industries increasingly deployed models in high-stakes domains such as finance, healthcare, and autonomous systems, where maintaining model accuracy is critical.

Key contributors to the understanding and mitigation of training serving skew include researchers and theorists in the fields of ML and AI, notably those involved in developing robust, adaptive ML models and those focused on model evaluation techniques, though no single group or individual can be credited with originating the term. Nonetheless, many industry leaders and academic projects have continually highlighted the importance of this issue in deploying AI systems.