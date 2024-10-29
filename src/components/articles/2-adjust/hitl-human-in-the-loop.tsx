"use client"
import { useState, useEffect } from "react";
import { Bot, User, Check, X, RefreshCw } from "lucide-react";

interface ComponentProps {}

type Scenario = {
  id: number;
  description: string;
  aiSuggestion: string;
  correctDecision: "approve" | "reject";
};

type Decision = "approve" | "reject" | null;

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    description: "Customer requests a refund for a damaged product.",
    aiSuggestion: "Approve refund based on policy.",
    correctDecision: "approve",
  },
  {
    id: 2,
    description: "Unusual login attempt from a new location.",
    aiSuggestion: "Block access and request verification.",
    correctDecision: "approve",
  },
  {
    id: 3,
    description: "AI detects a potential fraudulent transaction.",
    aiSuggestion: "Decline transaction and flag account.",
    correctDecision: "approve",
  },
];

/**
 * HITLDecisionMaker - A component that demonstrates Human-in-the-Loop (HITL) concept
 * through an interactive decision-making scenario.
 */
const HITLDecisionMaker: React.FC<ComponentProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [decision, setDecision] = useState<Decision>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [aiAccuracy, setAiAccuracy] = useState<number>(70);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentScenario < SCENARIOS.length - 1) {
        setCurrentScenario((prev) => prev + 1);
        setDecision(null);
        setFeedback("");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentScenario, decision]);

  const handleDecision = (choice: Decision) => {
    setDecision(choice);
    const scenario = SCENARIOS[currentScenario];
    if (choice === scenario.correctDecision) {
      setFeedback("Good decision! The AI suggestion was correct.");
      setAiAccuracy((prev) => Math.min(prev + 5, 100));
    } else {
      setFeedback("The AI suggestion wasn't optimal in this case.");
      setAiAccuracy((prev) => Math.max(prev - 5, 0));
    }
  };

  const resetScenarios = () => {
    setCurrentScenario(0);
    setDecision(null);
    setFeedback("");
    setAiAccuracy(70);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">HITL Decision Maker</h2>
      <div className="mb-4">
        <p className="font-semibold">Scenario:</p>
        <p>{SCENARIOS[currentScenario].description}</p>
      </div>
      <div className="mb-4 flex items-center">
        <Bot className="mr-2 text-blue-500" />
        <p>
          <span className="font-semibold">AI Suggestion:</span>{" "}
          {SCENARIOS[currentScenario].aiSuggestion}
        </p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Your Decision:</p>
        <div className="flex space-x-4 mt-2">
          <button
            onClick={() => handleDecision("approve")}
            className={`px-4 py-2 rounded ${
              decision === "approve"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-800"
            } transition duration-300`}
            aria-label="Approve decision"
          >
            <Check className="inline-block mr-1" /> Approve
          </button>
          <button
            onClick={() => handleDecision("reject")}
            className={`px-4 py-2 rounded ${
              decision === "reject"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            } transition duration-300`}
            aria-label="Reject decision"
          >
            <X className="inline-block mr-1" /> Reject
          </button>
        </div>
      </div>
      {feedback && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          <User className="inline-block mr-2" />
          {feedback}
        </div>
      )}
      <div className="mb-4">
        <p className="font-semibold">AI Accuracy:</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${aiAccuracy}%` }}
            aria-valuenow={aiAccuracy}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>
      <button
        onClick={resetScenarios}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
        aria-label="Reset scenarios"
      >
        <RefreshCw className="inline-block mr-1" /> Reset
      </button>
    </div>
  );
};

export default HITLDecisionMaker;