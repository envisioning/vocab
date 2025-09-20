---
title: NFs (Normalizing Flows)
summary: A family of generative models that construct complex probability densities by composing invertible, differentiable transformations whose Jacobian determinants are tractable for exact-likelihood evaluation.
slug: nfs-normalizing-flows
---

A concise formulation: a generative modeling approach that transforms a simple base distribution into a target distribution via a sequence of invertible, differentiable maps, enabling exact likelihood computation through the change-of-variables formula.

In technical detail, flows rely on the change-of-variables identity p*X(x) = p_Z(f^{-1}(x)) · |det J*{f^{-1}}(x)|, so expressive density modeling is achieved by composing multiple bijections f = f_K ∘ ... ∘ f_1 where each layer is chosen to make both the inverse mapping and the Jacobian determinant computationally tractable. This design trade-off—between expressivity, invertibility, and Jacobian structure—drives most architectural choices in ML (Machine Learning) applications: coupling layers (NICE, RealNVP) and invertible 1×1 convolutions (Glow) permit scalable image models, autoregressive flows (MAF/IAF) trade sampling vs. density-evaluation cost, and continuous-time formulations (FFJORD/continuous normalizing flows) replace discrete compositions with neural ODEs to allow unrestricted transformations at the price of ODE-solver cost. Normalizing flows are used for exact-likelihood generative modeling, likelihood-based anomaly detection, expressive variational posteriors in variational inference, and as components in hybrid architectures for images, audio, and scientific data where principled density estimates and tractable sampling or inference are required.

First appearances of the core invertible-transform idea trace to work around 2014 (NICE) with the term and formal flow-based variational methods popularized in 2015 (Rezende & Mohamed); widespread adoption and architectural innovation occurred between 2016–2018 with RealNVP, MAF/IAF, Glow and the later continuous-flow extensions.

Key contributors include Danilo Rezende and Shakir Mohamed (formalizing normalizing flows for variational inference), Laurent Dinh, Jascha Sohl-Dickstein and Samy Bengio (NICE, RealNVP), Diederik P. Kingma and Prafulla Dhariwal (Glow), George Papamakarios, Theo Pavlakou and Iain Murray (MAF), and Will Grathwohl et al. (FFJORD), with implementations and extensions coming from groups across academia and industry (e.g., University of Toronto, DeepMind, Google Brain) driving practical and theoretical advances.
