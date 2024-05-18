---
title: Double Descent
summary: Phenomenon in ML where the prediction error on test data initially decreases, increases, and then decreases again as model complexity grows.
---
Double descent describes a counterintuitive pattern observed in the performance of machine learning models, particularly deep learning models, as their complexity increases. Traditionally, it was believed that increasing a model's complexity (e.g., adding more parameters) beyond a certain point would lead to overfitting, where the model learns the noise in the training data rather than the underlying distribution, thus performing poorly on new, unseen data. However, the double descent curve reveals a different trend: after reaching a peak of high error (the overfitting point), the error decreases again as complexity continues to increase. This suggests that very large models enter a new regime where they generalize better, even though they have enough capacity to fit all training data. The phenomenon is closely linked to the interplay between model capacity, dataset size, and the training methodology.

Historical Overview:
The concept of double descent was formally described and gained attention in 2019 through research by Belkin et al., although observations consistent with the phenomenon were reported in earlier studies. It challenged the classical U-shaped bias-variance tradeoff curve that dominated statistical learning theory.

Key Contributors:
Mikhail Belkin, along with his colleagues at Ohio State University and other institutions, played a crucial role in identifying and formalizing the double descent phenomenon. Their work has prompted a reevaluation of some foundational theories in machine learning regarding how models generalize and the implications of model complexity.