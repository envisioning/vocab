"use client"
import { useState, useEffect } from "react";
import { Brain, BookOpen, Zap, Lightbulb, ArrowRight, ArrowLeft } from "lucide-react";

interface AIStage {
  level: number;
  skills: string[];
  output: string;
}

const INITIAL_STAGES: AIStage[] = [
  { level: 1, skills: ["Basic shapes"], output: "Simple circle" },
  { level: 2, skills: ["Basic shapes", "Colors"], output: "Colorful geometric pattern" },
  { level: 3, skills: ["Basic shapes", "Colors", "Perspective"], output: "3D landscape sketch" },
  { level: 4, skills: ["Shapes", "Colors", "Perspective", "Textures"], output: "Detailed nature scene" },
  { level: 5, skills: ["Advanced techniques", "Style fusion"], output: "Novel art form" },
];

const CHALLENGES = ["Draw a portrait", "Create a fantasy creature", "Design a futuristic city"];

/**
 * AIEvolutionSimulator: An interactive component demonstrating Open-Ended AI concepts
 * for 15-18 year old students.
 */
const AIEvolutionSimulator: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [challenge, setChallenge] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prev) => (prev < INITIAL_STAGES.length - 1 ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (challenge) {
      const timer = setTimeout(() => {
        setResponse(generateResponse(currentStage, challenge));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [challenge, currentStage]);

  const handleChallengeSelect = (selectedChallenge: string) => {
    setChallenge(selectedChallenge);
  };

  const handleStageChange = (direction: "next" | "prev") => {
    setCurrentStage((prev) => {
      if (direction === "next" && prev < INITIAL_STAGES.length - 1) return prev + 1;
      if (direction === "prev" && prev > 0) return prev - 1;
      return prev;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Evolution Simulator</h1>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => handleStageChange("prev")}
          disabled={currentStage === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          aria-label="Previous stage"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-xl font-semibold">Stage: {currentStage + 1}</div>
        <button
          onClick={() => handleStageChange("next")}
          disabled={currentStage === INITIAL_STAGES.length - 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          aria-label="Next stage"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">AI Capabilities</h2>
          <ul className="list-disc pl-5">
            {INITIAL_STAGES[currentStage].skills.map((skill, index) => (
              <li key={index} className="mb-1">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">AI Output</h2>
          <div className="flex items-center justify-center h-32 bg-gray-200 rounded">
            <p className="text-lg text-center">{INITIAL_STAGES[currentStage].output}</p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Challenge the AI</h2>
        <div className="flex space-x-4">
          {CHALLENGES.map((c, index) => (
            <button
              key={index}
              onClick={() => handleChallengeSelect(c)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      {challenge && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">AI Response</h2>
          <p>{response}</p>
        </div>
      )}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          This simulator demonstrates how an Open-Ended AI evolves and adapts over time, showcasing its ability to
          learn new skills and tackle increasingly complex challenges.
        </p>
      </div>
    </div>
  );
};

const generateResponse = (stage: number, challenge: string): string => {
  const responses = [
    "I'm still learning basic shapes. I can't tackle this challenge yet.",
    "I can use colors now, but this challenge is still too advanced for me.",
    "I can attempt a basic version of this challenge using my current skills.",
    "I can create a detailed response to this challenge using my expanded skillset.",
    "I can generate a unique and creative solution to this challenge, combining and inventing techniques as needed.",
  ];
  return responses[stage];
};

export default AIEvolutionSimulator;