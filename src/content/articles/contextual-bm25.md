---
slug: contextual-bm25
summary: Widely used probabilistic ranking function for assessing document relevance in search queries based on a bag-of-words model.
title: Contextual BM25
---

BM25 (Best Matching 25) is a popular probabilistic ranking function used to estimate the relevance of documents in search queries. It is part of the Okapi family and functions as a bag-of-words model. Contextual BM25 builds on this by integrating context-aware mechanisms, such as word embeddings or deep learning models, to better capture semantic nuances and relationships between terms in a query and documents. Traditional BM25 relies heavily on term frequency, inverse document frequency, and document length normalization, whereas the contextual variant seeks to address BM25's limitations by making the retrieval process sensitive to word meanings in different contexts. This adjustment allows for more sophisticated ranking, particularly in cases where the query words have ambiguous meanings or when long-range dependencies exist between terms.

BM25 was introduced in the mid-1990s as an enhancement of traditional probabilistic retrieval models. Around the late 2010s, the idea of "contextual" models gained popularity with advances in neural networks and embeddings (e.g., BERT, Word2Vec). Contextual BM25 emerged during this period as researchers explored hybrid methods that could merge the efficiency of traditional BM25 with the depth of contextualized embeddings.

The original BM25 algorithm was developed by Stephen Robertson and Karen Sparck Jones in the 1990s. The contextual enhancement of BM25 owes its development to the broader NLP community's work on embeddings and context-aware models, with researchers such as Jacob Devlin (creator of BERT) and Tomas Mikolov (developer of Word2Vec) indirectly contributing to the concept by providing tools for embedding-based contextual understanding.
