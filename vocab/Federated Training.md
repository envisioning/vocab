---
title: Federated Training
summary: Decentralized machine learning approach where multiple devices or nodes collaboratively train a shared model while keeping their data localized, rather than aggregating it centrally.
---
_Detailed Explanation:_ In federated training, the model is trained across many decentralized devices or servers, each holding its own data samples. Instead of sending raw data to a central server, each device trains the model locally and then only shares the model updates (e.g., gradients) with a central server, which aggregates these updates to improve the global model. This approach enhances privacy, as sensitive data never leaves the local devices, and it also reduces bandwidth usage and latency. Federated training is especially significant in environments where data privacy is crucial, such as in healthcare or finance, and is often used in edge computing scenarios like mobile devices, where user data is private and distributed.

_Historical Overview:_ The concept of federated training was introduced in 2016 by researchers at Google, who sought to address the challenges of privacy and efficiency in training machine learning models on distributed data.

_Key Contributors:_ The key contributors to the development of federated training include researchers at Google, particularly Brendan McMahan and his team, who were among the first to formalize the approach and demonstrate its potential with applications in mobile devices.