---
title: "Diffusion"
summary: "Class of generative models used to create high-quality, diverse samples of data by iteratively adding and then reversing noise."
---
Diffusion models work by gradually introducing noise to a data sample until it is transformed into a random noise distribution, then learning to reverse this process to generate new data samples from noise. This technique is especially prominent in generating realistic images, audio, and other forms of multimedia content. The process involves training a neural network to denoise data, essentially teaching it the distribution of the original dataset. Through this, diffusion models can generate new samples that are remarkably similar to the original data. Their flexibility and capacity to produce high-fidelity outputs have made them a popular choice for tasks requiring high levels of detail and creativity, such as text-to-image synthesis, enhancing image resolution, and creating art or music.

Historical overview: The concept of diffusion models in the context of generative models has been around for several years, but it saw a significant rise in popularity and development in the late 2010s and early 2020s. The theoretical foundations relate to earlier works in denoising autoencoders and score-based generative modeling, with the term "diffusion models" becoming more commonly used in the AI community around 2020.

Key contributors: While it's challenging to pinpoint a single group or individual responsible for the development of diffusion models due to the collaborative and iterative nature of AI research, Jonathan Ho and Tim Salimans are among the researchers who have made significant contributions to advancing diffusion models. Their works, especially in the context of improving and applying these models for various generative tasks, have been influential in demonstrating the models' potential and versatility in creating high-quality generative outputs.

