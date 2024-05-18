---
title: "RAG (Retrieval-Augmented Generation)"
summary: "Combines the retrieval of informative documents from a large corpus with the generative capabilities of neural models to enhance language model responses with real-world knowledge."
---
Retrieval-Augmented Generation (RAG) is a methodology in NLP that bridges the gap between traditional language models and information retrieval systems to produce more informed and contextually relevant text outputs. By integrating a document retrieval step into the generation process, RAG models can access a broad repository of texts during the generation phase, allowing them to pull in factual details or diverse perspectives that are not contained within the model's parameters. This approach leverages the strengths of both generative models, which can compose coherent and fluent text, and database-query mechanisms, which can provide specific, up-to-date information. The key innovation behind RAG is its ability to dynamically query a database based on the input query or context and use the retrieved documents to inform the generation process, enabling more accurate, informative, and context-aware responses.

The concept of Retrieval-Augmented Generation gained prominence around 2020, as part of a broader exploration into hybrid models that combine neural generative capabilities with external knowledge bases or databases. This approach was motivated by the desire to overcome the limitations of purely generative models, which may generate plausible but factually incorrect or outdated information.

Significant contributions to the development and refinement of RAG have been made by researchers at institutions like Google Research and Facebook AI Research (FAIR). Teams have focused on integrating RAG with large-scale language models such as GPT and BERT, enhancing their ability to leverage external datasets for more accurate and relevant text generation.

