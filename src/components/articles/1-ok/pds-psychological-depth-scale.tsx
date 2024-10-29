"use client"
import { useState, useEffect } from "react";
import { Layers, Brain, Waves, Check, X } from "lucide-react";

interface Scenario {
  id: number;
  description: string;
  level: "surface" | "middle" | "deep";
  feedback: string;
}

const PDSExplorer = () => {
  const [currentLevel, setCurrentLevel] = useState<"surface" | "middle" | "deep">("surface");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);

  const scenarios: Scenario[] = [
    {
      id: 1,
      description: "Feeling annoyed at traffic",
      level: "surface",
      feedback: "Daily reactions are surface-level experiences"
    },
    {
      id: 2,
      description: "Recurring fear of abandonment",
      level: "middle",
      feedback: "Personal patterns reflect middle-level psychology"
    },
    {
      id: 3,
      description: "Core belief about self-worth",
      level: "deep",
      feedback: "Fundamental beliefs represent deep psychological structures"
    }
  ];

  useEffect(() => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setCurrentScenario(randomScenario);
    
    return () => {
      setCurrentScenario(null);
    };
  }, [score]);

  const handleLevelSelect = (selectedLevel: "surface" | "middle" | "deep") => {
    if (!currentScenario) return;
    
    if (selectedLevel === currentScenario.level) {
      setScore(prev => prev + 1);
      setFeedback("Correct! " + currentScenario.feedback);
    } else {
      setFeedback("Try again. Think about the depth of this experience.");
    }
    setCurrentLevel(selectedLevel);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Psychological Depth Scale Explorer</h1>
        <p className="text-gray-600">Score: {score}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {currentScenario && (
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <Brain className="w-8 h-8 text-blue-500" />
              <p className="text-lg font-medium">{currentScenario.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleLevelSelect("surface")}
                className={`p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors
                  ${currentLevel === "surface" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                aria-label="Surface Level"
              >
                <Waves className="w-6 h-6" />
                <span>Surface</span>
              </button>

              <button
                onClick={() => handleLevelSelect("middle")}
                className={`p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors
                  ${currentLevel === "middle" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                aria-label="Middle Level"
              >
                <Layers className="w-6 h-6" />
                <span>Middle</span>
              </button>

              <button
                onClick={() => handleLevelSelect("deep")}
                className={`p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors
                  ${currentLevel === "deep" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                aria-label="Deep Level"
              >
                <Brain className="w-6 h-6" />
                <span>Deep</span>
              </button>
            </div>
          </div>
        )}

        <div className={`mt-6 p-4 rounded-lg text-center ${feedback.includes("Correct") ? "bg-green-100" : "bg-gray-100"}`}>
          <p className="text-gray-700">{feedback}</p>
        </div>
      </div>
    </div>
  );
};

export default PDSExplorer;