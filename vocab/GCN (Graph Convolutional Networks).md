---
title: GCN (Graph Convolutional Networks)
summary: Class of neural networks designed to operate on graph-structured data, leveraging convolutional layers to aggregate and transform features from graph nodes and their neighbors.
---
Graph Convolutional Networks extend the principles of convolutional neural networks (CNNs) to graph data, enabling the modeling of relationships and structures inherent in graph-structured datasets. GCNs aggregate information from a node’s local neighborhood, effectively capturing the spatial dependencies between connected nodes. This is achieved through convolution-like operations on graphs, where node features are iteratively combined and transformed using the adjacency matrix of the graph. GCNs have shown remarkable performance in tasks such as node classification, link prediction, and graph classification, finding applications in social network analysis, molecular biology, recommendation systems, and more. By leveraging the inherent structure of graphs, GCNs can efficiently learn representations that encapsulate both node features and their topological relationships.

Historical Overview:
The concept of applying convolutional operations to graph-structured data began gaining traction around 2013, with the term "Graph Convolutional Networks" being formalized in a seminal 2016 paper by Thomas Kipf and Max Welling. The approach gained significant popularity due to its success in various benchmark tasks and its applicability to a wide range of graph-related problems.

Key Contributors:
The key contributors to the development of Graph Convolutional Networks are Thomas Kipf and Max Welling, whose 2016 paper titled "Semi-Supervised Classification with Graph Convolutional Networks" laid the foundational framework for GCNs. Their work has been pivotal in popularizing the concept and inspiring subsequent research and advancements in the field.