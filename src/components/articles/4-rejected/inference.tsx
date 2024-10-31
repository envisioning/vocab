"use client"
import { useState, useEffect } from "react";
import { Search, Brain } from "lucide-react";

interface Case {
  id: number;
  clues: string[];
  pattern: string;
  solution: string;
}

interface ComponentProps {}

const TRAINING_CASES: Case[] = [
  {
    id: 1,
    clues: ["Paw prints", "Empty food bowl", "Scratched furniture"],
    pattern: "Pet behavior",
    solution: "Cat was here"
  },
  {
    id: 2,
    clues: ["Wet floor", "Open window", "Puddles"],
    pattern: "Weather event",
    solution: "Rain came in"
  }
];

const NEW_CASES: Case[] = [
  {
    id: 3,
    clues: ["Paw prints", "Yarn scattered", "Empty food bowl"],
    pattern: "Pet behavior",
    solution: "Cat was here"
  }
];

/**
 * AI Detective Agency - Teaching Inference through interactive mystery solving
 */
export default function InferenceDetective({}: ComponentProps) {
  const [phase, setPhase] = useState<number>(1);
  const [selectedClues, setSelectedClues] = useState<string[]>([]);
  const [patternIdentified, setPatternIdentified] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (feedback) setFeedback("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleClueSelect = (clue: string) => {
    if (selectedClues.includes(clue)) {
      setSelectedClues(prev => prev.filter(c => c !== clue));
    } else {
      setSelectedClues(prev => [...prev, clue]);
    }
  };

  const handlePatternCheck = () => {
    const currentCase = phase === 1 ? TRAINING_CASES[0] : NEW_CASES[0];
    if (selectedClues.length >= 2) {
      const isCorrect = currentCase.pattern === patternIdentified;
      setFeedback(isCorrect ? "Excellent detective work!" : "Try analyzing the patterns again");
      setScore(prev => isCorrect ? prev + 10 : prev);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Search className="text-blue-500" />
          AI Detective Agency
        </h1>
        <div className="flex items-center gap-2">
          <Brain className="text-gray-600" />
          <span className="text-lg font-semibold">Score: {score}</span>
        </div>
      </header>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {phase === 1 ? "Training Room" : "Inference Bureau"}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">Available Clues</h3>
              <div className="space-y-2">
                {(phase === 1 ? TRAINING_CASES[0] : NEW_CASES[0]).clues.map((clue, index) => (
                  <button
                    key={index}
                    onClick={() => handleClueSelect(clue)}
                    className={`w-full p-2 rounded ${
                      selectedClues.includes(clue)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    } transition duration-300`}
                    aria-pressed={selectedClues.includes(clue)}
                  >
                    {clue}
                  </button>
                ))}
              </div>
            </div>

            <div className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">Pattern Recognition</h3>
              <select
                value={patternIdentified}
                onChange={(e) => setPatternIdentified(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select pattern...</option>
                <option value="Pet behavior">Pet behavior</option>
                <option value="Weather event">Weather event</option>
              </select>
              
              <button
                onClick={handlePatternCheck}
                className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Check Pattern
              </button>
            </div>
          </div>

          {feedback && (
            <div className={`mt-4 p-3 rounded ${
              feedback.includes("Excellent") ? "bg-green-100" : "bg-red-100"
            }`}>
              {feedback}
            </div>
          )}
        </div>

        {phase === 1 && score >= 20 && (
          <button
            onClick={() => setPhase(2)}
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition duration-300"
          >
            Proceed to Inference Bureau
          </button>
        )}
      </div>
    </div>
  );
}