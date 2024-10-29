"use client"
import { useState, useEffect } from "react";
import { Key, Footprints, Laptop, Scissors, Brain, Check, X } from "lucide-react";

interface Scenario {
  id: number;
  title: string;
  icon: JSX.Element;
  simpleExplanation: string;
  complexExplanation: string;
}

interface ComponentProps {}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Lost Keys",
    icon: <Key className="w-8 h-8" />,
    simpleExplanation: "They're where you usually put them",
    complexExplanation: "A thief moved them and put them back elsewhere",
  },
  {
    id: 2,
    title: "Animal Tracks",
    icon: <Footprints className="w-8 h-8" />,
    simpleExplanation: "It's a local horse",
    complexExplanation: "It's an escaped zoo zebra from 50 miles away",
  },
  {
    id: 3,
    title: "Computer Issues",
    icon: <Laptop className="w-8 h-8" />,
    simpleExplanation: "Battery is dead",
    complexExplanation: "Motherboard failure + RAM issues + virus",
  },
];

export default function OccamsRazorSimulator({}: ComponentProps) {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [selectedExplanation, setSelectedExplanation] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
      setSelectedExplanation("");
      setFeedback("");
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleExplanationSelect = (explanation: string) => {
    setSelectedExplanation(explanation);
    if (explanation === SCENARIOS[currentScenario].simpleExplanation) {
      setScore((prev) => prev + 1);
      setFeedback("Correct! The simpler explanation is often the best choice.");
    } else {
      setFeedback("Remember Occam's Razor: the simplest explanation is usually best.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg" role="main">
      <header className="flex items-center gap-4 mb-8">
        <Scissors className="w-10 h-10 text-blue-500" />
        <h1 className="text-2xl font-bold">Occam's Razor Explorer</h1>
      </header>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {SCENARIOS[currentScenario].icon}
          <h2 className="text-xl font-semibold">{SCENARIOS[currentScenario].title}</h2>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleExplanationSelect(SCENARIOS[currentScenario].simpleExplanation)}
            className="w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition duration-300"
            aria-label="Select simple explanation"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-500" />
              <span>Simple: {SCENARIOS[currentScenario].simpleExplanation}</span>
            </div>
          </button>

          <button
            onClick={() => handleExplanationSelect(SCENARIOS[currentScenario].complexExplanation)}
            className="w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition duration-300"
            aria-label="Select complex explanation"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-gray-500" />
              <span>Complex: {SCENARIOS[currentScenario].complexExplanation}</span>
            </div>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-blue-100 rounded-lg" role="alert">
          <div className="flex items-center gap-2">
            {selectedExplanation === SCENARIOS[currentScenario].simpleExplanation ? (
              <Check className="w-6 h-6 text-green-500" />
            ) : (
              <X className="w-6 h-6 text-gray-500" />
            )}
            <p>{feedback}</p>
          </div>
        </div>
      )}

      <div className="mt-6 text-right">
        <p className="text-lg">
          Score: <span className="font-bold text-blue-500">{score}</span>
        </p>
      </div>
    </div>
  );
}