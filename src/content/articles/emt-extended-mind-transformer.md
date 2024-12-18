---
slug: emt-extended-mind-transformer
summary: Transformer model architecture that integrates external memory systems to enhance the model's ability to handle long-range dependencies and maintain relevant information over extended inputs.
title: EMT (Extended Mind Transformer)
---

Technically, EMTs build upon the core transformer architecture by introducing a k-nearest neighbor (kNN) retrieval mechanism. This enables the model to retrieve and attend to key external memories during inference, effectively augmenting the self-attention process with external data that the model decides is important. By retrieving external information through top-k attention, the model overcomes traditional transformer limitations in handling long sequences or complex tasks where extensive context is necessary. This method significantly enhances inference efficiency and retrieval accuracy, especially in scenarios where direct self-attention over long sequences would be computationally prohibitive​ ([ar5iv](https://ar5iv.org/abs/2406.02332))​([ar5iv](https://ar5iv.org/pdf/2406.02332)).

The concept of the **Extended Mind** in cognitive science, proposed by Clark and Chalmers in 1998, influences the EMT framework. It suggests that cognition can extend beyond the brain to include external tools and environments. The EMT architecture mirrors this idea, allowing external memory to become part of the model’s decision-making process​([ar5iv](https://ar5iv.org/abs/2406.02332)).

This concept gained traction recently, with major contributions from **Phoebe Klett** and **Thomas Ahle** from Normal Computing, who published a key paper in 2023 that refined and implemented these ideas within transformer models​([Normal Computing](https://www.normalcomputing.com/blog-posts/supersizing-transformers-going-beyond-rag-with-extended-minds-for-llms))​([ar5iv](https://ar5iv.org/pdf/2406.02332)).
