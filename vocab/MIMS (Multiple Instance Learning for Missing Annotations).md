---
title: "MIMS (Multiple Instance Learning for Missing Annotations)"
summary: "ML approach where training occurs on labeled bags of instances instead of individual instances, particularly useful when exact annotations are missing."
---
MIMS is a specialized adaptation of Multiple Instance Learning (MIL), a method particularly effective in scenarios where precise instance labels are unattainable but labels on groups of instances (bags) are available. This approach is crucial in fields like medical imaging or document classification, where exact annotations can be labor-intensive or impractical to obtain. In MIMS, the learning algorithm predicts whether a bag contains at least one instance of a particular class, thus learning from ambiguous or partial labeling. This technique addresses the challenge of incomplete supervision by leveraging the inherent structure within the data, enabling more robust models that can handle real-world data complexities where direct instance labeling isn't feasible.

Historical overview: The concept of Multiple Instance Learning emerged in the mid-1990s, with MIMS adaptations evolving as practical requirements for handling missing annotations in datasets became apparent. The approach gained popularity in the early 2000s as it proved effective in various applications where labels were difficult to define precisely.

Key contributors: The development of Multiple Instance Learning was initially proposed by Dietterich et al., in 1997, focusing on drug activity prediction. Since then, numerous researchers have extended and adapted MIL to various domains, including MIMS adaptations, though specific key figures in MIMS development are not as prominently documented as in the broader MIL field.

