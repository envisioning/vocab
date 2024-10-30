"use client"
import { useState, useEffect } from "react";
import { Brain, Box, ChefHat, Map, ArrowRight, Compass, Apple, Book, AlertCircle } from "lucide-react";

interface WorldModelState {
  currentScenario: number;
  isExploring: boolean;
  predictions: string[];
  userGuess: string;
  feedback: string;
}

interface Scenario {
  id: number;
  title: string;
  context: string;
  prediction: string;
  explanation: string;
  icon: JSX.Element;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "The Tourist Navigator",
    context: "A tourist predicts a coffee shop around the corner based on city patterns",
    prediction: "High likelihood of finding coffee near business districts",
    explanation: "Models learn patterns like business clustering in cities",
    icon: <Map className="w-8 h-8" />
  },
  {
    id: 2,
    title: "The Intuitive Chef",
    context: "A chef creates a new dish without a recipe",
    prediction: "Sweet potato will work similarly to regular potato",
    explanation: "Models transfer knowledge between similar items",
    icon: <ChefHat className="w-8 h-8" />
  }
];

const WorldModelExplorer = () => {
  const [state, setState] = useState<WorldModelState>({
    currentScenario: 0,
    isExploring: false,
    predictions: [],
    userGuess: "",
    feedback: ""
  });

  useEffect(() => {
    if (state.isExploring) {
      const timer = setInterval(() => {
        setState(prev => ({
          ...prev,
          currentScenario: (prev.currentScenario + 1) % SCENARIOS.length
        }));
      }, 8000);

      return () => clearInterval(timer);
    }
  }, [state.isExploring]);

  const handlePredictionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentScenario = SCENARIOS[state.currentScenario];
    const isCorrect = state.userGuess.toLowerCase().includes(currentScenario.prediction.toLowerCase());
    
    setState(prev => ({
      ...prev,
      feedback: isCorrect ? "Great thinking! That's how world models work!" : "Think about patterns and similarities...",
      predictions: [...prev.predictions, state.userGuess]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <header className="flex items-center gap-4 mb-8">
        <Brain className="w-10 h-10 text-blue-500" />
        <h1 className="text-2xl font-bold">General World Model Explorer</h1>
      </header>

      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <div className="flex items-center gap-4 mb-4">
          {SCENARIOS[state.currentScenario].icon}
          <h2 className="text-xl font-semibold">{SCENARIOS[state.currentScenario].title}</h2>
        </div>
        
        <p className="mb-4 text-gray-700">{SCENARIOS[state.currentScenario].context}</p>

        <form onSubmit={handlePredictionSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={state.userGuess}
              onChange={(e) => setState(prev => ({ ...prev, userGuess: e.target.value }))}
              placeholder="What would you predict?"
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              aria-label="Enter your prediction"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-700"
            >
              Predict
            </button>
          </div>
        </form>

        {state.feedback && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <p className="font-medium">{state.feedback}</p>
            </div>
            <p className="mt-2 text-gray-600">{SCENARIOS[state.currentScenario].explanation}</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setState(prev => ({ ...prev, isExploring: !prev.isExploring }))}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:ring-2 focus:ring-green-700"
        aria-label={state.isExploring ? "Stop auto-advance" : "Start auto-advance"}
      >
        {state.isExploring ? "Stop Exploring" : "Start Exploring"}
      </button>
    </div>
  );
};

export default WorldModelExplorer;