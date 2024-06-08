---
title: PQ (Product Quantization)
summary: Technique used in large-scale vector quantization for efficient similarity search and data compression by decomposing high-dimensional vectors into smaller sub-vectors and quantizing each sub-vector separately.
---
Product quantization (PQ) is pivotal in the realm of similarity search and large-scale machine learning. It addresses the challenge of searching through massive datasets by breaking down high-dimensional vectors into smaller, more manageable sub-vectors. Each sub-vector is quantized independently, and the combination of these quantized sub-vectors approximates the original high-dimensional vector. This approach drastically reduces the memory footprint and computational complexity, enabling faster similarity searches. PQ is particularly effective in applications such as image retrieval, where it allows for approximate nearest neighbor (ANN) searches that are both computationally efficient and memory-conservative. The sub-vector quantization results in a significant reduction of the search space, thus expediting the retrieval process without substantial loss of accuracy.

Historical Overview:
Product quantization was first introduced in 2011 by Hervé Jégou, Matthijs Douze, and Cordelia Schmid in their seminal paper "Product Quantization for Nearest Neighbor Search". The technique gained popularity rapidly due to its efficiency and effectiveness in large-scale machine learning and information retrieval tasks, becoming a cornerstone method for ANN searches.

Key Contributors:
The primary contributors to the development of product quantization are Hervé Jégou, Matthijs Douze, and Cordelia Schmid, who proposed the method in their 2011 paper. Their work laid the foundation for subsequent research and advancements in efficient high-dimensional data processing and similarity search techniques.