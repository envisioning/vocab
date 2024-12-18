---
slug: ttt-test-time-training
summary: ML approach where the model adapts itself during the inference phase using auxiliary tasks and additional training data available at test time to improve performance.
title: TTT (Test-Time Training)
---

Test-Time Training (TTT) enhances a model's performance by allowing it to adjust its parameters during the testing phase using supplementary tasks. This strategy leverages the availability of additional information at test time, which is typically not used in conventional machine learning paradigms that strictly separate training and inference phases. TTT typically employs a self-supervised or auxiliary task to fine-tune the model using the test instance itself or related data available at test time. This continuous adaptation helps in mitigating distribution shifts and improving robustness and accuracy, especially in dynamic or previously unseen environments. TTT is particularly useful in scenarios where the test data distribution may differ from the training data distribution, such as in real-world applications with non-stationary data or evolving conditions.

The concept of TTT emerged in the early 2020s, building upon the foundations of domain adaptation and transfer learning. It gained traction as researchers sought more resilient and adaptive models capable of handling real-time changes and distributional shifts during deployment.

Notable contributors to the development of TTT include researchers like Stefano Ermon and Jure Leskovec from Stanford University, whose work has been pivotal in formalizing and advancing this concept through influential papers and empirical studies. Their contributions have helped establish the theoretical underpinnings and practical applications of TTT in various machine learning domains.