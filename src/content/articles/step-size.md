---
title: Step Size  
summary: The parameter in optimization algorithms that determines the magnitude of each update step in the search for a minimum or maximum of a function.
slug: step-size
---  

In AI, particularly within optimization contexts like gradient descent, step size, often referred to as learning rate, is a critical hyperparameter that dictates how much to change the model's parameters in response to the estimated error each time they are updated. A well-chosen step size helps in accelerating the convergence of the learning algorithm to the optimal solution while avoiding issues like overshooting minima. Its significance lies in balancing the speed and stability of convergence; too large a step size could lead to oscillations around the minimum, while too small could result in very slow convergence or getting stuck in local minima. Selecting an appropriate step size is thus a key consideration in training neural networks, as it directly affects the efficiency and effectiveness of the learning process.

The concept of step size in optimization algorithms, including its implementation in gradient descent, gained traction in the mid-20th century, though it became increasingly popular in the context of ML as more sophisticated deep learning models emerged in the 2000s and beyond. Its adoption grew as researchers and practitioners recognized its impact on training neural networks efficiently.

R. W. Sargent and H. P. Williams are among the pivotal figures who contributed to the foundational theories of optimization algorithms, including concepts like step size. Their work laid the groundwork for its applications in modern ML and AI, influencing generations of researchers and practitioners tackling complex optimization challenges.