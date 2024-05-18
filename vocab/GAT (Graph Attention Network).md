---
title: GAT (Graph Attention Network)
summary: Type of neural network that applies attention mechanisms directly to graphs to dynamically prioritize information from different nodes in the graph.
---
GATs introduce an attention-based architecture to the field of graph neural networks (GNNs), allowing for node features to be aggregated in a way that is weighted by the importance of their neighbors, thus enabling more nuanced feature learning. Each node in a graph computes a coefficient that indicates the importance of its neighboring nodes, using a self-attention strategy. This attention mechanism is particularly useful in graph-structured data because it can manage varying node degrees and capture complex inter-node relationships in large-scale networks. GATs have been found effective in tasks such as node classification, link prediction, and graph classification, adapting well to both transductive and inductive learning problems.

Historical Overview:
The concept of Graph Attention Networks was introduced in 2017 by Petar Veličković and his team. It quickly gained popularity as it addressed some limitations of earlier graph neural network models, such as the inability to account for the differing importance of nodes within a neighborhood.

Key Contributors:
The development of the GAT model is primarily credited to Petar Veličković, along with his collaborators Guillem Cucurull, Arantxa Casanova, Adriana Romero, Pietro Lio, and Yoshua Bengio at DeepMind and the University of Cambridge. Their work has significantly influenced the way researchers approach problems involving graph-structured data in artificial intelligence.