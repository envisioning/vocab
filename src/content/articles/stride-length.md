---
slug: stride-length
summary: Refers to the number of pixels by which the filter or kernel moves across the input data during convolution operations in convolutional neural networks (CNNs).
title: Stride Length
---

2. \*\*  
   In convolutional neural networks (CNNs), stride length defines how much the kernel shifts when sliding over the input matrix (image or feature map) during convolution. A stride of 1 means the kernel moves by one pixel at a time, leading to high overlap and preserving much of the spatial resolution of the input, but at the cost of computational complexity. Conversely, larger strides (e.g., 2 or more) reduce the output dimensions, effectively downsampling the input and lowering computational requirements, though potentially losing some finer details. Stride length plays a crucial role in balancing the trade-off between computational efficiency and the ability to capture detailed features in an image.

The concept of stride was formally introduced with the development of CNNs, particularly around the late 1980s and early 1990s, when Yann LeCun developed LeNet. The importance of stride in network design gained popularity in the early 2010s with the resurgence of deep learning and CNN architectures like AlexNet (2012), which used stride for both convolutional and pooling layers.

Yann LeCun, known for his work on CNNs, was instrumental in formalizing the convolution operation, which includes stride as a key parameter. Later advancements by figures like Alex Krizhevsky (developer of AlexNet) further explored and optimized stride in deep learning models.
