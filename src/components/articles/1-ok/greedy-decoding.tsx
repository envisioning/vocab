"use client";

import React, { useState, useEffect } from "react";
import { Brain, Check, X, Pause, Play } from "lucide-react";

const EXAMPLES = [
  {
    title: "Writing a Story",
    sequence: [
      {
        prompt: "Once",
        options: [
          { token: "upon", probability: 0.75 },
          { token: "there", probability: 0.15 },
          { token: "when", probability: 0.1 },
        ],
      },
      {
        prompt: "Once upon",
        options: [
          { token: "a", probability: 0.85 },
          { token: "the", probability: 0.1 },
          { token: "my", probability: 0.05 },
        ],
      },
      {
        prompt: "Once upon a",
        options: [
          { token: "time", probability: 0.8 },
          { token: "day", probability: 0.15 },
          { token: "night", probability: 0.05 },
        ],
      },
    ],
  },
  {
    title: "Weather Description",
    sequence: [
      {
        prompt: "The",
        options: [
          { token: "sun", probability: 0.45 },
          { token: "rain", probability: 0.3 },
          { token: "wind", probability: 0.25 },
        ],
      },
      {
        prompt: "The sun",
        options: [
          { token: "shines", probability: 0.65 },
          { token: "glows", probability: 0.2 },
          { token: "sets", probability: 0.15 },
        ],
      },
      {
        prompt: "The sun shines",
        options: [
          { token: "brightly", probability: 0.5 },
          { token: "warmly", probability: 0.3 },
          { token: "softly", probability: 0.2 },
        ],
      },
    ],
  },
  {
    title: "Code Completion",
    sequence: [
      {
        prompt: "def",
        options: [
          { token: "calculate", probability: 0.4 },
          { token: "process", probability: 0.35 },
          { token: "analyze", probability: 0.25 },
        ],
      },
      {
        prompt: "def calculate",
        options: [
          { token: "_average", probability: 0.45 },
          { token: "_sum", probability: 0.3 },
          { token: "_total", probability: 0.25 },
        ],
      },
      {
        prompt: "def calculate_average",
        options: [
          { token: "(numbers):", probability: 0.7 },
          { token: "(data):", probability: 0.2 },
          { token: "(values):", probability: 0.1 },
        ],
      },
    ],
  },
];

const GreedyDecodingDemo = () => {
  const [currentExample, setCurrentExample] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightedOption, setHighlightedOption] = useState(null);
  const [showAllOptions, setShowAllOptions] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      if (!showAllOptions) {
        setShowAllOptions(true);
        return;
      }

      if (highlightedOption === null) {
        setHighlightedOption(0);
        return;
      }

      // Reset and move to next step
      const nextStep = () => {
        setHighlightedOption(null);
        setShowAllOptions(false);
        setCurrentStep((prev) => prev + 1);
      };

      // Reset and move to next example
      const nextExample = () => {
        setHighlightedOption(null);
        setShowAllOptions(false);
        setCurrentStep(0);
        setCurrentExample((prev) => (prev + 1) % EXAMPLES.length);
      };

      // If we've highlighted the chosen option, move to next step or example
      if (currentStep >= EXAMPLES[currentExample].sequence.length - 1) {
        setTimeout(nextExample, 1000);
      } else {
        setTimeout(nextStep, 1000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    currentExample,
    currentStep,
    highlightedOption,
    showAllOptions,
    isPaused,
  ]);

  const currentSequence = EXAMPLES[currentExample].sequence[currentStep];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Greedy Decoding</h2>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
        >
          {isPaused ? (
            <Play className="w-4 h-4" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="mb-4 text-lg text-blue-600 font-medium">
        Example: {EXAMPLES[currentExample].title}
      </div>

      {/* Main visualization area */}
      <div className="mb-8">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-lg font-mono">{currentSequence.prompt}_</p>
        </div>

        <div className="space-y-4">
          {currentSequence.options.map((option, idx) => (
            <div
              key={option.token}
              className={`transform transition-all duration-500 ${
                showAllOptions
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              <div
                className={`flex items-center justify-between p-3 rounded-lg border
                  ${
                    highlightedOption === idx
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {highlightedOption === idx ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-mono">{option.token}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${option.probability * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16">
                    {(option.probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          {EXAMPLES[currentExample].sequence.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx === currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Example {currentExample + 1} of {EXAMPLES.length}
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-gray-700">
        <p className="font-medium mb-2">How Greedy Decoding Works:</p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>
            At each step, the model considers multiple possible next tokens
          </li>
          <li>It always selects the token with the highest probability</li>
          <li>
            The selection is "greedy" because it picks the local best choice
          </li>
          <li>This process continues until the sequence is complete</li>
        </ul>
      </div>
    </div>
  );
};

export default GreedyDecodingDemo;
