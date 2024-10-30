"use client"
import { useState, useEffect } from "react";
import { Brain, ChefHat, Eye, Send, RefreshCw } from "lucide-react";

interface ComponentProps {}

type Scenario = {
  input: string;
  output: string;
  explanation: string[];
};

const SCENARIOS: Scenario[] = [
  {
    input: "The food was delicious and the service was excellent.",
    output: "Positive",
    explanation: ["Positive words: delicious, excellent", "No negative words"],
  },
  {
    input: "The movie was boring and too long.",
    output: "Negative",
    explanation: ["Negative words: boring", "Criticism: too long"],
  },
  {
    input: "The weather is nice today.",
    output: "Positive",
    explanation: ["Positive word: nice", "No negative context"],
  },
];

/**
 * AIDecisionMaker Component
 * 
 * This component simulates the inference-time reasoning process of an AI model
 * for sentiment analysis. It allows students to input text and see how the model
 * processes it to determine sentiment.
 */
const AIDecisionMaker: React.FC<ComponentProps> = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [explanation, setExplanation] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeNeurons, setActiveNeurons] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isProcessing) {
        processInput();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isProcessing, input]);

  const processInput = () => {
    const scenario = SCENARIOS.find((s) => s.input.toLowerCase() === input.toLowerCase());
    if (scenario) {
      setOutput(scenario.output);
      setExplanation(scenario.explanation);
    } else {
      setOutput("Neutral");
      setExplanation(["No strong sentiment detected"]);
    }
    setActiveNeurons(Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)));
    setIsProcessing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setOutput("");
    setExplanation([]);
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setExplanation([]);
    setActiveNeurons([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">AI Sentiment Analyzer</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter a sentence..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Enter a sentence for sentiment analysis"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
            aria-label="Analyze sentiment"
          >
            <Send size={24} />
          </button>
        </div>
      </form>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Model Brain</h2>
        <div className="flex justify-center items-center space-x-2">
          {activeNeurons.map((value, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full ${
                value > 5 ? "bg-blue-500" : "bg-gray-300"
              } transition-colors duration-300`}
              aria-label={`Neuron ${index + 1} ${value > 5 ? "active" : "inactive"}`}
            />
          ))}
        </div>
      </div>

      {output && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Output</h2>
          <p className="text-lg font-medium text-blue-600">{output}</p>
        </div>
      )}

      {explanation.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Explanation</h2>
          <ul className="list-disc pl-5">
            {explanation.map((item, index) => (
              <li key={index} className="text-gray-600">{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="text-blue-500" />
          <span className="text-gray-600">AI Model</span>
        </div>
        <div className="flex items-center space-x-2">
          <ChefHat className="text-green-500" />
          <span className="text-gray-600">Expert System</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 focus:outline-none focus:text-blue-700"
          aria-label="Reset input and output"
        >
          <RefreshCw size={20} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default AIDecisionMaker;