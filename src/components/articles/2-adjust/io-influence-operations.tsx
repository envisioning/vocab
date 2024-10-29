"use client"
import { useState, useEffect } from "react";
import { Users, MessageCircle, Megaphone, Target, AlertTriangle } from "lucide-react";

interface ComponentProps {}

type Audience = {
  id: number;
  opinion: number;
};

type Tool = {
  id: number;
  name: string;
  icon: React.ReactNode;
  effect: number;
};

const TOOLS: Tool[] = [
  { id: 1, name: "Social Media", icon: <MessageCircle />, effect: 0.1 },
  { id: 2, name: "Advertising", icon: <Megaphone />, effect: 0.15 },
  { id: 3, name: "Public Event", icon: <Users />, effect: 0.2 },
];

/**
 * InfluenceSimulator: A component that teaches IO (Influence Operations) concepts
 * through an interactive simulation.
 */
const InfluenceSimulator: React.FC<ComponentProps> = () => {
  const [audience, setAudience] = useState<Audience[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [goal, setGoal] = useState<number>(75);
  const [consequences, setConsequences] = useState<string>("");

  useEffect(() => {
    initializeAudience();
    return () => {
      // Cleanup if needed
    };
  }, []);

  const initializeAudience = () => {
    const newAudience = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      opinion: Math.floor(Math.random() * 100),
    }));
    setAudience(newAudience);
  };

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const applyInfluence = () => {
    if (!selectedTool) return;

    const newAudience = audience.map((person) => ({
      ...person,
      opinion: Math.min(100, Math.max(0, person.opinion + selectedTool.effect * 100)),
    }));

    setAudience(newAudience);
    checkGoalAndConsequences(newAudience);
  };

  const checkGoalAndConsequences = (newAudience: Audience[]) => {
    const averageOpinion = newAudience.reduce((sum, person) => sum + person.opinion, 0) / newAudience.length;
    
    if (averageOpinion >= goal) {
      setConsequences("Goal achieved! But watch for potential backlash.");
    } else if (averageOpinion < 30) {
      setConsequences("Caution: Low approval might lead to resistance.");
    } else {
      setConsequences("");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Influence Operations Simulator</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Target Audience</h2>
        <div className="grid grid-cols-5 gap-2">
          {audience.map((person) => (
            <div
              key={person.id}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xs"
              style={{ backgroundColor: `hsl(${person.opinion}, 70%, 50%)` }}
              aria-label={`Person with ${person.opinion}% approval`}
            >
              {Math.round(person.opinion)}%
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Influence Tools</h2>
        <div className="flex space-x-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool)}
              className={`p-2 rounded ${
                selectedTool?.id === tool.id ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              aria-pressed={selectedTool?.id === tool.id}
            >
              {tool.icon}
              <span className="sr-only">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Goal: {goal}% Approval</h2>
        <input
          type="range"
          min="0"
          max="100"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          className="w-full"
          aria-label="Set approval goal"
        />
      </div>

      <button
        onClick={applyInfluence}
        disabled={!selectedTool}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Apply Influence
      </button>

      {consequences && (
        <div className="mt-4 p-2 bg-yellow-100 border border-yellow-300 rounded" role="alert">
          <AlertTriangle className="inline-block mr-2" />
          {consequences}
        </div>
      )}

      <button
        onClick={initializeAudience}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Reset Simulation
      </button>
    </div>
  );
};

export default InfluenceSimulator;