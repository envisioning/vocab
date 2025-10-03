---
title: Bag of Words (text representation)
summary: A document representation that encodes text as an unordered multiset of token counts, ignoring word order and grammar while capturing term presence and frequency.
slug: bag-of-words-text-representation
---

A document representation that encodes text as an unordered multiset of token counts, ignoring word order and grammar while capturing term presence and frequency.

The bag-of-words model is a simple but powerful vector-space representation that maps a document to a high-dimensional sparse vector whose dimensions correspond to vocabulary tokens and whose values are typically raw counts, term-frequency (TF), or weighted scores such as TF–IDF; it embodies an exchangeability assumption (words are independent of order) and underpins many classical ML (Machine Learning) pipelines—enabling efficient application of linear classifiers (e.g., logistic regression, SVM), generative models (e.g., multinomial Naive Bayes), and statistical retrieval methods. Its significance lies in computational simplicity, interpretability, and compatibility with sparse linear algebra (and techniques like hashing/truncated SVD for dimensionality reduction), making it a robust baseline for text classification, information retrieval, topic modeling (as an input to LSA/PLSA), and feature engineering; however, it discards syntactic structure and sequence information, motivating n-gram extensions and ultimately the shift toward context-aware dense representations (embeddings and Transformer-based models) when capture of semantics and order is required.

First use: concepts trace to the 1950s (term‑frequency indexing by H. P. Luhn); the representation was popularized with vector-space and TF–IDF work in the 1960s–1970s (Gerard Salton) and became a standard NLP/ML baseline through the 1990s with widespread adoption in text classification and IR.

Key contributors: Hans Peter Luhn (early term‑frequency ideas), Gerard Salton (vector space model and term weighting), Karen Spärck Jones (IDF and IR foundations), and later ML/NLP practitioners such as McCallum & Nigam (text classification with multinomial models) and educators/researchers like Christopher D. Manning and Hinrich Schütze who formalized and taught its use and limitations.