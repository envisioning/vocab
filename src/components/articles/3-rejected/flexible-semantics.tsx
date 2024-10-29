"use client"
import { useState, useEffect } from "react";
import { MessageCircle, Users, Briefcase, School, ThumbsUp, AlertCircle } from "lucide-react";

interface Scenario {
  context: string;
  icon: JSX.Element;
  phrase: string;
  appropriateVersion: string;
}

const SCENARIOS: Scenario[] = [
  {
    context: "Friends Chat",
    icon: <MessageCircle className="w-8 h-8" />,
    phrase: "This is lit!",
    appropriateVersion: "This is excellent!"
  },
  {
    context: "School Presentation",
    icon: <School className="w-8 h-8" />,
    phrase: "The experiment was super cool",
    appropriateVersion: "The experiment yielded fascinating results"
  },
  {
    context: "Job Interview",
    icon: <Briefcase className="w-8 h-8" />,
    phrase: "I'm good at stuff",
    appropriateVersion: "I possess relevant skills"
  }
];

export default function FlexibleSemantics() {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleTranslation = (e: React.FormEvent) => {
    e.preventDefault();
    const current = SCENARIOS[currentScenario];
    
    if (userInput.toLowerCase() === current.appropriateVersion.toLowerCase()) {
      setScore(prev => prev + 10);
      setFeedback("Perfect translation! +10 points");
    } else if (userInput.length > 0) {
      setFeedback("Try again! Consider the context.");
    }
    
    setTimeout(() => setFeedback(""), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg" role="main">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Context Shifter: Master Flexible Semantics
      </h1>

      <div className="mb-8 p-4 bg-white rounded-lg shadow transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
          {SCENARIOS[currentScenario].icon}
          <h2 className="text-xl font-semibold text-gray-700">
            {SCENARIOS[currentScenario].context}
          </h2>
        </div>

        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p className="text-gray-700">Original phrase:</p>
          <p className="font-medium">{SCENARIOS[currentScenario].phrase}</p>
        </div>

        <form onSubmit={handleTranslation} className="space-y-4">
          <div>
            <label htmlFor="translation" className="block text-gray-700 mb-2">
              Translate this phrase to fit the context:
            </label>
            <input
              type="text"
              id="translation"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type your translation..."
              aria-label="Translation input"
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition duration-300"
          >
            Check Translation
          </button>
        </form>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-green-500" />
          <span className="font-bold text-gray-700">Score: {score}</span>
        </div>
        {feedback && (
          <div className="flex items-center gap-2 text-green-500">
            <AlertCircle className="w-5 h-5" />
            <span>{feedback}</span>
          </div>
        )}
      </div>
    </div>
  );
}