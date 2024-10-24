---
category: GOV, CORE
generality:
- 0.6
- 0.585
- 0.57
- 0.555
- 0.54
- 0.525
- 0.51
slug: tem-trusted-execution-monitor
summary: Security component that ensures the integrity and confidentiality of code and data within a computer system by managing and protecting execution environments.
title: TEM (Trusted Execution Monitor)
---

Expert-level Explanation: A Trusted Execution Monitor (TEM) operates as a safeguard within a computing system to enforce security policies and ensure that sensitive computations are isolated from potentially untrusted parts of the system. It accomplishes this by creating secure enclaves where code and data can be executed and stored without interference from malicious software or unauthorized users. TEMs provide mechanisms to protect these secure enclaves from tampering, even in the presence of higher-privileged malware. This isolation is critical for applications requiring high levels of security, such as financial transactions, secure communications, and personal data protection. By ensuring that only authenticated and authorized code can run within these enclaves, TEMs significantly enhance the overall security posture of the system.

Historical Overview: The concept of secure execution environments has been around since the early 2000s, with more advanced implementations emerging in the 2010s as the need for stronger security measures in computing systems grew. The term "Trusted Execution Monitor" started gaining traction with the development of hardware-assisted security technologies such as Intel's Software Guard Extensions (SGX) and ARM's TrustZone, both of which helped popularize the concept.

Key Contributors: Key contributors to the development of Trusted Execution Monitors include major technology companies like Intel and ARM, which have developed hardware and software solutions to support secure execution environments. Intel's SGX, introduced in 2015, and ARM's TrustZone, introduced in 2003, are notable examples of technologies that embody the principles of TEM. Researchers and engineers from these companies, along with academic contributions from institutions focusing on computer security, have been pivotal in advancing this field.