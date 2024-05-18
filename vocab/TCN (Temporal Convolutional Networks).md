---
title: TCN (Temporal Convolutional Networks)
summary: Type of neural network designed to handle sequential data by applying convolutional operations over time.
---
Temporal Convolutional Networks (TCNs) use convolutional layers, typically with dilated convolutions, to capture temporal dependencies in sequence data. Unlike Recurrent Neural Networks (RNNs), TCNs maintain the same input and output lengths, allowing for more efficient parallel computation and avoiding the vanishing gradient problem often associated with RNNs. TCNs leverage causal convolutions to ensure that the output at any time step only depends on current and past inputs, not future ones, making them suitable for time series forecasting, natural language processing, and other sequential tasks. The architecture of TCNs involves multiple layers of convolution with increasing dilation factors, which expands the receptive field exponentially, enabling the network to learn long-term dependencies effectively.

Historical Overview:
The concept of TCNs was first introduced in a more formalized manner in a 2018 paper by Shaojie Bai, J. Zico Kolter, and Vladlen Koltun. While convolutional approaches to sequential data existed earlier, this work established TCNs as a robust alternative to RNNs by demonstrating their efficacy in various tasks.

Key Contributors:
The significant contributors to the development and popularization of TCNs are Shaojie Bai, J. Zico Kolter, and Vladlen Koltun, whose 2018 paper highlighted the advantages of TCNs over traditional recurrent models in handling sequential data. Their work has paved the way for broader adoption and further research into convolutional methods for temporal data.