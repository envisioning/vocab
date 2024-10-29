"use client"
import { useState, useEffect } from "react";
import { Maze, Mountain, Library, ArrowRight, Timer, Undo, Trophy, AlertCircle } from "lucide-react";

interface ScenarioType {
  id: number;
  title: string;
  icon: JSX.Element;
  description: string;
  blindAlleyIndicators: string[];
  resources: number;
}

const SCENARIOS: ScenarioType[] = [
  {
    id: 1,
    title: "Maze Explorer",
    icon: <Maze className="w-8 h-8" />,
    description: "Navigate through paths that may lead to dead ends",
    blindAlleyIndicators: ["No connecting paths ahead", "Circular pattern", "Narrowing options"],
    resources: 100
  },
  {
    id: 2,
    title: "Mountain Climb",
    icon: <Mountain className="w-8 h-8" />,
    description: "Find a route up the mountain avoiding unscalable walls",
    blindAlleyIndicators: ["Steep incline", "Loose rocks", "No visible holds"],
    resources: 100
  },
  {
    id: 3,
    title: "Library Search",
    icon: <Library className="w-8 h-8" />,
    description: "Search for books through various sections",
    blindAlleyIndicators: ["Unrelated categories", "Outdated sections", "Wrong classification"],
    resources: 100
  }
];

interface BlindAlleyExplorerProps {}

const BlindAlleyExplorer: React.FC<BlindAlleyExplorerProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>(SCENARIOS[0]);
  const [resources, setResources] = useState<number>(100);
  const [attempts, setAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isExploring, setIsExploring] = useState<boolean>(false);

  useEffect(() => {
    if (isExploring) {
      const interval = setInterval(() => {
        setResources(prev => Math.max(0, prev - 5));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isExploring]);

  const handleExplore = (indicator: string) => {
    setAttempts(prev => prev + 1);
    setIsExploring(true);
    
    if (indicator.includes("No connecting") || indicator.includes("Steep") || indicator.includes("Unrelated")) {
      setFeedback("Good catch! This is a blind alley - backtrack to save resources.");
      setResources(prev => Math.max(0, prev - 10));
    } else {
      setFeedback("Keep exploring - this path might lead somewhere.");
      setResources(prev => Math.max(0, prev - 20));
    }
  };

  const resetScenario = () => {
    setResources(100);
    setAttempts(0);
    setFeedback("");
    setIsExploring(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {currentScenario.icon}
          <h2 className="text-xl font-bold">{currentScenario.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <Timer className="w-5 h-5 text-blue-500" />
          <span className="font-mono">{resources}/100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Path Indicators</h3>
          <ul className="space-y-2">
            {currentScenario.blindAlleyIndicators.map((indicator, index) => (
              <li key={index}>
                <button
                  onClick={() => handleExplore(indicator)}
                  disabled={resources <= 0}
                  className="w-full text-left p-2 rounded hover:bg-blue-50 transition duration-300 flex items-center justify-between"
                  aria-label={`Explore path with ${indicator}`}
                >
                  <span>{indicator}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Progress Tracking</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-500" />
              <span>Attempts: {attempts}</span>
            </div>
            {feedback && (
              <div className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={resetScenario}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition duration-300"
        >
          <Undo className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={() => setCurrentScenario(SCENARIOS[(currentScenario.id % 3) + 1 - 1])}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Next Scenario
        </button>
      </div>
    </div>
  );
};

export default BlindAlleyExplorer;