---
title: DTW (Dynamic Time Warping)
summary: Algorithm used to measure similarity between two time series by aligning them in a nonlinear fashion, allowing for comparisons even when there are shifts and distortions in time.
---
Dynamic Time Warping (DTW) is a robust technique commonly employed in time series analysis and pattern recognition to find an optimal match between two sequences of data that may vary in speed. Unlike straightforward distance metrics like Euclidean distance, DTW accounts for variations in time or speed, making it especially useful in applications where the timing of events differs between sequences. DTW works by warping the time axis of the sequences to align them, minimizing the total distance between corresponding points. This is achieved through dynamic programming, ensuring an efficient and optimal solution. DTW is widely used in speech recognition, gesture recognition, and other domains where the temporal dimension plays a crucial role in the analysis.

Historical Overview:
DTW was first introduced in the late 1960s and early 1970s, gaining significant attention in 1978 with the work of Hiroaki Sakoe and Seibi Chiba, who refined the algorithm and applied it to speech recognition. The method has since evolved and expanded into various fields, becoming a staple technique for time series comparison.

Key Contributors:
The development of DTW is primarily attributed to Hiroaki Sakoe and Seibi Chiba, who published a seminal paper in 1978 that detailed the algorithm's application to speech recognition. Their work laid the foundation for numerous advancements and adaptations of DTW across different domains.