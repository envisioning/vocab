---
slug: machine-unlearning
summary: Process by which an ML model is systematically modified to forget specific data, ensuring that the data no longer influences the model's behavior or decisions.
title: Machine Unlearning
---

Machine unlearning addresses the challenge of removing the influence of specific data points from a trained model without necessitating a complete retraining from scratch. This concept is particularly significant in contexts where data privacy laws, such as the GDPR, mandate the right to erasure ("right to be forgotten"), requiring that personal data be removable from models upon request. The process involves identifying and quantifying the contributions of the data to be forgotten to the model's parameters and subsequently adjusting these parameters to negate the data's impact. Efficient machine unlearning techniques aim to preserve the performance of the model while ensuring compliance with privacy requirements and reducing computational costs.

The concept of machine unlearning is relatively new, having emerged prominently in the mid-2010s as a response to increasing concerns about privacy and data governance. The term itself started gaining traction around 2015, as discussions around data privacy intensified and the need for dynamic data management in AI systems became clear.

While machine unlearning is a collective advancement influenced by many researchers in the field of machine learning and privacy, specific seminal works include those by Cao and Yang, who formalized some of the first frameworks and algorithms for machine unlearning. Their contributions laid the groundwork for ongoing research into efficient and scalable unlearning methods.