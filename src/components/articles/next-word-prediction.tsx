"use client"
import { useState, useEffect } from "react";
import { Clock, Send, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";

interface Scenario {
  era: string;
  year: string;
  text: string;
  correctWord: string;
  aiPredictions: string[];
}

interface ComponentProps {}

const SCENARIOS: Scenario[] = [
  {
    era: "Victorian Era",
    year: "1850",
    text: "Dearest Margaret, I hope this letter finds you in good",
    correctWord: "health",
    aiPredictions: ["spirits", "health", "condition"]
  },
  {
    era: "Roaring Twenties",
    year: "1920",
    text: "The automobile is truly a remarkable",
    correctWord: "invention",
    aiPredictions: ["machine", "invention", "achievement"]
  },
  {
    era: "Digital Age",
    year: "2000",
    text: "OMG, that new phone is so",
    correctWord: "cool",
    aiPredictions: ["cool", "awesome", "expensive"]
  }
];

/**
 * NextWordPredictor: Educational component teaching next word prediction
 * through historical context and interactive predictions
 */
export default function NextWordPredictor({}: ComponentProps) {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>("");
  const [showPredictions, setShowPredictions] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    setShowPredictions(false);
    setUserGuess("");
    setFeedback("");

    return () => {
      setShowPredictions(false);
      setUserGuess("");
    };
  }, [currentScenario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPredictions(true);
    if (userGuess.toLowerCase() === SCENARIOS[currentScenario].correctWord.toLowerCase()) {
      setFeedback("Great prediction!");
      setScore(prev => prev + 1);
    } else {
      setFeedback("Not quite - see how context matters!");
    }
  };

  const handleNext = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentScenario(0);
    setScore(0);
    setShowPredictions(false);
    setUserGuess("");
    setFeedback("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold">{SCENARIOS[currentScenario].era}</h2>
          <span className="text-gray-500">({SCENARIOS[currentScenario].year})</span>
        </div>
        <div className="text-green-500">Score: {score}/{SCENARIOS.length}</div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <p className="text-lg font-medium mb-4">
          {SCENARIOS[currentScenario].text}
          <span className="text-blue-500 animate-pulse">|</span>
        </p>

        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Predict the next word..."
            disabled={showPredictions}
            aria-label="Enter your prediction"
          />
          <button
            type="submit"
            disabled={showPredictions || !userGuess}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors duration-300"
            aria-label="Submit prediction"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {showPredictions && (
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-medium mb-2">AI Predictions:</h3>
            <div className="flex gap-2 flex-wrap">
              {SCENARIOS[currentScenario].aiPredictions.map((pred, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white rounded-full text-sm"
                >
                  {pred}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {feedback.includes("Great") ? (
              <ThumbsUp className="w-5 h-5 text-green-500" />
            ) : (
              <ThumbsDown className="w-5 h-5 text-gray-500" />
            )}
            <p className="text-gray-700">{feedback}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
          aria-label="Reset game"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        {showPredictions && currentScenario < SCENARIOS.length - 1 && (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
          >
            Next Era
          </button>
        )}
      </div>
    </div>
  );
}