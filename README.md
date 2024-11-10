# Envisioning Vocab

Vocab is a knowledge graph for all [ML (Machine Learning)](/vocab/ml-machine-learning) terms and concepts.

> The best time to get into AI was 20 years ago. The second best time is now.

## This will help you:

- Follow the conversation and more easily understand recent developments in the field.
- Advance your technological literacy and further your professional development.
- Engage critically with the most important technology of our lifetimes.

---

## How to use Envisioning AI:

- Start with the basics and build up your conceptual knowledge.
- Search for terms you are not familiar with.
- Navigate the entire knowledge graph.

The entire index has been co-created with different AI tools in order to create a comprehensive overview of the field with accurate and useful definitions. If you spot a mistake or want to suggest missing concepts, email us on hello@envisioning.io.

---

# Methodology

## Definitions

- Vocab articles are created by feeding each term into `GPT-4o` with instructions to create a comprehensive and accurate explanation of the term following a predefined style guide.

## Generality

- Each vocab term is assessed by `GPT-4o` in order to estimate its relative level of importance compared to the whole data set.
- The language model evaluates each term several times, and an average score is presented here.

## Year

- We estimate the first citation or reference of each article with `GPT-4o-mini` and sometimes `Claude 3.5`.
- These are manually compared against the time range indicated by article definitions.

## Impact

- Assessed by `GPT-4o-mini` to evaluate each concept's potential societal impact. Scores consider economic impact, social changes, ethical implications, and potential risks/benefits to society.
- Higher scores (near 1.0) indicate concepts with massive potential societal impact (like AGI), while lower scores suggest minimal direct societal influence.
- [Prompt](https://github.com/envisioning/vocab/blob/main/src/scripts/llm-impact.py).

## Complexity

- Assessed by `GPT-4o-mini` to measure technical and conceptual difficulty. Scores consider mathematical complexity, prerequisite knowledge needed, implementation difficulty, conceptual depth, and abstraction levels.
- Higher scores indicate advanced concepts requiring deep expertise, while lower scores represent more accessible foundational concepts.
- [Prompt](https://github.com/envisioning/vocab/blob/main/src/scripts/llm-complexity.py).

## Popularity

- Assessed by `GPT-4o-mini` to gauge current relevance and adoption. Scores factor in mainstream adoption, media coverage, industry usage, search volume, academic citations, and practical applications.
- Higher scores indicate widely recognized concepts with significant public interest, while lower scores represent more specialized or emerging topics.
- [Prompt](https://github.com/envisioning/vocab/blob/main/src/scripts/llm-popularity.py).

## Safety

- Assessed by `GPT-4o-mini` to evaluate AI safety implications. Scores consider potential misuse, robustness concerns, alignment challenges, safety research relevance, and catastrophic risk potential.
- Higher scores indicate concepts crucial to AI safety (like AI Alignment), while lower scores suggest minimal direct safety implications.
- [Prompt](https://github.com/envisioning/vocab/blob/main/src/scripts/llm-safety.py).

## Intersimilarity

- The degree of similarity between each article pair is estimated in order to identify relationships between different concepts.
- We use [TF-IDF](https://envisioning.io/vocab/tfidf-term-frequency-inverse-document-frequency) [vectorization](https://envisioning.io/vocab/vectorization) followed by [cosine similarity](https://envisioning.io/vocab/cosine-similarity/).

## Names

- Selected with `GPT-4o-mini`.

## Image

- GPT4o: Receives title and summary,
- Suggests image prompt for `FLUX 1.1 Pro`.

## Explainer

- Created generatively with `Claude 3.5 Sonnet` with significant human intervention.

## Fact Checking

- LLMs have remarkable self-knowledge. This is likely because of the amount of research papers and articles used in the training data. This minimizes the chances of hallucinations or factual mistakes, which has been validated by running most entries through a fact-checking [CustomGPT](https://chat.openai.com/g/g-T87zDPHN1-envisioning-ai).

---

# Visualizations

## [Graph](/vocab/graph/)

- Generative knowledge graph of all articles. Experimental but fully functional
- Connections are created based on node similarity, creating a semantic map of the corpus.

## [Sunflower](/vocab/sunflower/)

- Experimentental view in the shape of a Fibonacci spiral.

## [Grid](/vocab/grid/)

- Experimentental quadrant view of metadata.

---

# Learn more about ML

- https://fleuret.org/public/lbdl.pdf
- https://youtu.be/h0e2HAPTGF4
- https://aman.ai/primers/ai/top-30-papers/
- https://www.oreilly.com/radar/what-we-learned-from-a-year-of-building-with-llms-part-i/

#### (cc) [Envisioning](https://envisioning.io)
