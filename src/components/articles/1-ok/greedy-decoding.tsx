"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Brain, TextCursor, Zap, Play, Pause, RotateCcw } from "lucide-react";

interface Sentence {
  vocabulary: string[];
  probSequence: number[][];
}

const GreedyDecoding = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [currentProbabilities, setCurrentProbabilities] = useState<number[]>([]);
  const [currentSentence, setCurrentSentence] = useState<Sentence>();

  // Define all possible sentences and their corresponding vocabularies and probabilities
  const sentences = [
    {
      text: "The cat sits on the mat",
      vocabulary: ["The", "cat", "sits", "on", "the", "mat"],
      probSequence: [
        [0.8, 0.05, 0.03, 0.04, 0.06, 0.02],
        [0.02, 0.45, 0.40, 0.05, 0.05, 0.03],
        [0.02, 0.05, 0.45, 0.35, 0.08, 0.05],
        [0.02, 0.05, 0.05, 0.70, 0.13, 0.05],
        [0.02, 0.05, 0.05, 0.03, 0.75, 0.10],
        [0.02, 0.05, 0.05, 0.03, 0.05, 0.80],
      ]
    },
    {
      text: "The dog runs in the park",
      vocabulary: ["The", "dog", "runs", "in", "the", "park"],
      probSequence: [
        [0.8, 0.05, 0.03, 0.04, 0.06, 0.02],
        [0.02, 0.45, 0.40, 0.05, 0.05, 0.03],
        [0.02, 0.05, 0.45, 0.35, 0.08, 0.05],
        [0.02, 0.05, 0.05, 0.70, 0.13, 0.05],
        [0.02, 0.05, 0.05, 0.03, 0.75, 0.10],
        [0.02, 0.05, 0.05, 0.03, 0.05, 0.80],
      ]
    },
    {
      text: "The bird flies through the sky",
      vocabulary: ["The", "bird", "flies", "through", "the", "sky"],
      probSequence: [
        [0.8, 0.05, 0.03, 0.04, 0.06, 0.02],
        [0.02, 0.45, 0.40, 0.05, 0.05, 0.03],
        [0.02, 0.05, 0.45, 0.35, 0.08, 0.05],
        [0.02, 0.05, 0.05, 0.70, 0.13, 0.05],
        [0.02, 0.05, 0.05, 0.03, 0.75, 0.10],
        [0.02, 0.05, 0.05, 0.03, 0.05, 0.80],
      ]
    },
    {
      text: "The fish swims in the pond",
      vocabulary: ["The", "fish", "swims", "in", "the", "pond"],
      probSequence: [
        [0.8, 0.05, 0.03, 0.04, 0.06, 0.02],
        [0.02, 0.45, 0.40, 0.05, 0.05, 0.03],
        [0.02, 0.05, 0.45, 0.35, 0.08, 0.05],
        [0.02, 0.05, 0.05, 0.70, 0.13, 0.05],
        [0.02, 0.05, 0.05, 0.03, 0.75, 0.10],
        [0.02, 0.05, 0.05, 0.03, 0.05, 0.80],
      ]
    },
    {
      text: "The child plays with the toy",
      vocabulary: ["The", "child", "plays", "with", "the", "toy"],
      probSequence: [
        [0.8, 0.05, 0.03, 0.04, 0.06, 0.02],
        [0.02, 0.45, 0.40, 0.05, 0.05, 0.03],
        [0.02, 0.05, 0.45, 0.35, 0.08, 0.05],
        [0.02, 0.05, 0.05, 0.70, 0.13, 0.05],
        [0.02, 0.05, 0.05, 0.03, 0.75, 0.10],
        [0.02, 0.05, 0.05, 0.03, 0.05, 0.80],
      ]
    },
    {
      text: "The sun shines in the sky",
      vocabulary: ["The", "sun", "shines", "in", "the", "sky"],
      probSequence: [
        [0.8, 0.05, 0.03, 0.04, 0.06, 0.02],
        [0.02, 0.45, 0.40, 0.05, 0.05, 0.03],
        [0.02, 0.05, 0.45, 0.35, 0.08, 0.05],
        [0.02, 0.05, 0.05, 0.70, 0.13, 0.05],
        [0.02, 0.05, 0.05, 0.03, 0.75, 0.10],
        [0.02, 0.05, 0.05, 0.03, 0.05, 0.80],
      ]
    },
    {
      text: "The wind blows through the trees",
      vocabulary: ["The", "wind", "blows", "through", "the", "trees"],
      probSequence: [
        [0.8, 0.05, 0.03, 0.04, 0.06, 0.02],
        [0.02, 0.45, 0.40, 0.05, 0.05, 0.03],
        [0.02, 0.05, 0.45, 0.35, 0.08, 0.05],
        [0.02, 0.05, 0.05, 0.70, 0.13, 0.05],
        [0.02, 0.05, 0.05, 0.03, 0.75, 0.10],
        [0.02, 0.05, 0.05, 0.03, 0.05, 0.80],
      ]
    },
    {
      text: "The rain falls on the ground",
      vocabulary: ["The", "rain", "falls", "on", "the", "ground"],
      probSequence: [
        [0.8, 0.05, 0.03, 0.04, 0.06, 0.02],
        [0.02, 0.45, 0.40, 0.05, 0.05, 0.03],
        [0.02, 0.05, 0.45, 0.35, 0.08, 0.05],
        [0.02, 0.05, 0.05, 0.70, 0.13, 0.05],
        [0.02, 0.05, 0.05, 0.03, 0.75, 0.10],
        [0.02, 0.05, 0.05, 0.03, 0.05, 0.80],
      ]
    },
    {
      text: "The car drives down the road",
      vocabulary: ["The", "car", "drives", "down", "the", "road"],
      probSequence: [
        [0.8, 0.05, 0.03, 0.04, 0.06, 0.02],
        [0.02, 0.45, 0.40, 0.05, 0.05, 0.03],
        [0.02, 0.05, 0.45, 0.35, 0.08, 0.05],
        [0.02, 0.05, 0.05, 0.70, 0.13, 0.05],
        [0.02, 0.05, 0.05, 0.03, 0.75, 0.10],
        [0.02, 0.05, 0.05, 0.03, 0.05, 0.80],
      ]
    },
    {
      text: "The book sits on the shelf",
      vocabulary: ["The", "book", "sits", "on", "the", "shelf"],
      probSequence: [
        [0.8, 0.05, 0.03, 0.04, 0.06, 0.02],
        [0.02, 0.45, 0.40, 0.05, 0.05, 0.03],
        [0.02, 0.05, 0.45, 0.35, 0.08, 0.05],
        [0.02, 0.05, 0.05, 0.70, 0.13, 0.05],
        [0.02, 0.05, 0.05, 0.03, 0.75, 0.10],
        [0.02, 0.05, 0.05, 0.03, 0.05, 0.80],
      ]
    },
  ];

  // Select random sentence on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setCurrentSentence(sentences[randomIndex]);
  }, []);

  useEffect(() => {
    if (!isPlaying || !currentSentence) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= currentSentence.probSequence.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSentence]);

  useEffect(() => {
    if (!currentSentence) {
      return;
    }

    setCurrentProbabilities(currentSentence.probSequence[currentStep]);
    const maxIndex = currentSentence.probSequence[currentStep].indexOf(
      Math.max(...currentSentence.probSequence[currentStep])
    );
    setSelectedTokens((prev) => [...prev.slice(0, currentStep), currentSentence.vocabulary[maxIndex]]);
  }, [currentStep, currentSentence]);

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedTokens([]);
    setIsPlaying(true);
    // Optionally select a new random sentence on reset
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setCurrentSentence(sentences[randomIndex]);
  };

  if (!currentSentence) {
    return null;
  }

  const isComplete = currentStep >= currentSentence.probSequence.length - 1;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="text-blue-600 w-6 h-6" />
          <h2 className="text-2xl font-bold text-blue-900">Greedy Decoding</h2>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <TextCursor className="text-blue-500 w-5 h-5" />
          <p className="text-blue-800">
            Selecting the most probable next token at each step
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-2 mb-4">
            {selectedTokens.map((token, idx) => (
              <div
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md flex items-center gap-1"
              >
                {token}
                <ArrowRight className="w-4 h-4" />
              </div>
            ))}
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Deciding...
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {currentSentence.vocabulary.map((token, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md text-center transition-all duration-300 ${currentProbabilities[idx] === Math.max(...currentProbabilities)
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-gray-50"
                  }`}
              >
                <div className="text-sm font-medium">{token}</div>
                <div className="text-xs text-gray-600">
                  {(currentProbabilities[idx] * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          {!isComplete && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Play
                </>
              )}
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>1. Model calculates probabilities for each possible next token</li>
          <li>2. Selects the token with highest probability</li>
          <li>3. Repeats process for next position</li>
          <li>4. Continues until sequence is complete</li>
        </ul>
      </div>
    </div>
  );
};

export default GreedyDecoding;