"use client"
import { useState, useEffect } from "react";
import { Image, FileText, Check, X, AlertCircle, Search, ThumbsUp, ThumbsDown } from "lucide-react";

interface Case {
  id: number;
  description: string;
  correctIcon: string;
  possibleMatches: string[];
  difficulty: 1 | 2 | 3 | 4;
  hints: string[];
}

interface MatchAttempt {
  caseId: number;
  selectedIcon: string;
  confidence: number;
  isCorrect: boolean;
}

const CASES: Case[] = [
  {
    id: 1,
    description: "Looking for a circular shape with bright colors",
    correctIcon: "Image",
    possibleMatches: ["Image", "FileText", "Search"],
    difficulty: 1,
    hints: ["Focus on basic shapes", "Color is key"]
  },
  {
    id: 2, 
    description: "Need something that can process both text and visuals",
    correctIcon: "Search",
    possibleMatches: ["Search", "FileText", "AlertCircle"],
    difficulty: 2,
    hints: ["Think about dual capabilities", "What can handle multiple types?"]
  },
  // Add more cases...
];

const IconMap: {[key: string]: any} = {
  Image,
  FileText,
  Check,
  X,
  AlertCircle,
  Search,
  ThumbsUp,
  ThumbsDown
};

/**
 * ITMDetective - An educational component teaching Image-Text Matching through
 * an interactive detective agency simulation
 */
export default function ITMDetective() {
  const [currentCase, setCurrentCase] = useState<Case>(CASES[0]);
  const [attempts, setAttempts] = useState<MatchAttempt[]>([]);
  const [confidence, setConfidence] = useState<number>(50);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
      setFeedback("");
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleMatch = (selectedIcon: string) => {
    const isCorrect = selectedIcon === currentCase.correctIcon;
    const attempt: MatchAttempt = {
      caseId: currentCase.id,
      selectedIcon,
      confidence,
      isCorrect
    };

    setAttempts([...attempts, attempt]);
    setFeedback(isCorrect ? "Great match!" : "Try again!");

    if (isCorrect && currentCase.id < CASES.length) {
      setTimeout(() => {
        setCurrentCase(CASES[currentCase.id]);
        setConfidence(50);
      }, 1000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ITM Detective Agency</h1>
        <p className="text-gray-600">Case #{currentCase.id} - Difficulty Level {currentCase.difficulty}</p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <section className="bg-white p-4 rounded-lg" role="region" aria-label="Case Description">
          <h2 className="text-lg font-semibold mb-3">Witness Description</h2>
          <p className="text-gray-700">{currentCase.description}</p>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Match Confidence
              <input 
                type="range"
                min="0"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full mt-2"
                aria-label="Confidence Level"
              />
            </label>
            <span className="text-sm text-gray-500">{confidence}%</span>
          </div>
        </section>

        <section className="bg-white p-4 rounded-lg" role="region" aria-label="Possible Matches">
          <h2 className="text-lg font-semibold mb-3">Possible Matches</h2>
          <div className="grid grid-cols-3 gap-4">
            {currentCase.possibleMatches.map((iconName) => {
              const IconComponent = IconMap[iconName];
              return (
                <button
                  key={iconName}
                  onClick={() => handleMatch(iconName)}
                  className="p-4 border rounded-lg hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  aria-label={`Select ${iconName}`}
                >
                  <IconComponent className="w-8 h-8 mx-auto text-gray-600" />
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {feedback && (
        <div 
          role="alert" 
          className={`mt-4 p-3 rounded-lg text-center ${
            feedback.includes("Great") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {feedback}
        </div>
      )}

      <button
        onClick={() => setShowHint(true)}
        className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Need a hint?
      </button>

      {showHint && (
        <div className="mt-2 text-sm text-gray-600">
          {currentCase.hints[0]}
        </div>
      )}
    </div>
  );
}