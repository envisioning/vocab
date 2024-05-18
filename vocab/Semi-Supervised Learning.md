---
title: "Semi-Supervised Learning"
summary: "ML approach that uses a combination of a small amount of labeled data and a large amount of unlabeled data for training models."
---
Semi-supervised learning bridges the gap between supervised and unsupervised learning methods. It is particularly significant in scenarios where obtaining labeled data is expensive or labor-intensive, but large quantities of unlabeled data are readily available. By leveraging both labeled and unlabeled data, semi-supervised learning algorithms can improve learning accuracy with less human effort in labeling. These algorithms typically assume that the distribution of labeled data can inform the learning process about the structure of unlabeled data. Common techniques include self-training, where the model is initially trained with a small amount of labeled data then iteratively labels unlabeled data and retrains itself with these new labels, and co-training, where two models are trained separately on the same data and then make predictions together.

The concept of semi-supervised learning has been discussed since at least the 1970s, but it gained more pronounced attention and development with the advent of more powerful computing resources and larger datasets in the late 1990s and early 2000s.

Significant contributors to the field of semi-supervised learning include Yaroslav Ganin and Victor Lempitsky, who introduced the concept of domain adaptation in semi-supervised learning with their work on the Domain-Adversarial Training of Neural Networks (DANN) algorithm. Additionally, researchers such as Yoshua Bengio have contributed extensively to the theoretical frameworks that underpin semi-supervised learning methods.

