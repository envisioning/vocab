---
title: "Catastrophic Forgetting"
summary: "Phenomenon where a neural network forgets previously learned information upon learning new data."
---
Catastrophic forgetting is a significant challenge in the field of machine learning, especially within neural networks, where the model's ability to retain previously learned knowledge deteriorates rapidly as it acquires new information. This issue is particularly prevalent in models trained sequentially on different tasks, where the neural network's weights are adjusted for the new task, thereby overwriting the information that was relevant to the previous tasks. Addressing catastrophic forgetting is crucial for developing AI systems capable of lifelong learning, where the model continuously learns from new data without losing its ability to perform on older tasks. Various strategies, such as experience replay, elastic weight consolidation, and progressive neural networks, have been proposed to mitigate this issue by preserving old knowledge while accommodating new information.

Historical overview: The term and the phenomenon have been known since the early days of neural network research, but it gained particular prominence in the 1980s and 1990s as researchers sought to develop models capable of sequential task learning.

Key contributors: While the issue of catastrophic forgetting has been acknowledged by numerous researchers, some notable contributions have come from French and McClelland who discussed this issue in the context of connectionist models in the early 1990s. Recent efforts to address catastrophic forgetting have involved many researchers across various institutions, making it a collective effort rather than the work of a few individuals.

