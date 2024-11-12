---
title: Auxiliary Loss
summary: An additional loss function used during model training to improve learning and generalization by addressing secondary tasks or adding regularization.
slug: auxiliary-loss
---

Auxiliary loss refers to the incorporation of an additional objective function during the training of a neural network, often used to facilitate better learning of the primary task by simultaneously optimizing related secondary tasks or by acting as regularizers. The primary significance of auxiliary losses is in addressing model shortcomings, such as overfitting by keeping the model from focusing too narrowly on the primary task. This can lead to improved feature learning within the network. For instance, in multitasking scenarios, auxiliary losses might include objectives related to the prediction of different but related data properties, thereby enhancing the main task's performance. The theoretical backing for auxiliary loss stems from multitask learning frameworks, which argue that training on related tasks can provide beneficial inductive biases that lead to better generalization.

The notion of employing auxiliary losses gained significant traction with neural network research in the mid-2010s, although the conceptual underpinnings of using multiple objectives date back to earlier AI studies on hierarchical and multitask learning in the 1990s.

Key contributors to the development and popularization of auxiliary loss include the deep learning researchers like Yoshua Bengio and his team, who have extensively explored ways in which auxiliary losses can enhance deep neural network training through better signal leveraging from multiple tasks.