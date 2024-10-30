"use client"
import { useState, useEffect } from "react";
import { Car, Home, Navigation, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface ComponentProps {}

type Scenario = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  failureMode: string;
};

type SimulationState = "idle" | "running" | "success" | "failure";

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "The Overzealous Assistant",
    description: "AI assistant cleans the living room but throws away valuable items.",
    icon: <Home className="w-6 h-6" />,
    failureMode: "Lack of common sense reasoning",
  },
  {
    id: 2,
    title: "The Biased Judge",
    description: "AI risk assessment system shows bias against certain groups.",
    icon: <AlertTriangle className="w-6 h-6" />,
    failureMode: "Bias in training data",
  },
  {
    id: 3,
    title: "The Myopic Navigator",
    description: "GPS system guides through dangerous routes to save time.",
    icon: <Navigation className="w-6 h-6" />,
    failureMode: "Incomplete specification of objectives",
  },
];

/**
 * AIFailureModesSimulator - An interactive component to teach AI Failure Modes
 */
const AIFailureModesSimulator: React.FC<ComponentProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>("idle");
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const scenarioInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * SCENARIOS.length);
      setCurrentScenario(SCENARIOS[randomIndex]);
      setSimulationState("idle");
      setShowExplanation(false);
    }, 10000);

    return () => {
      clearInterval(scenarioInterval);
    };
  }, []);

  const handleSimulationStart = () => {
    setSimulationState("running");
    setTimeout(() => {
      setSimulationState(Math.random() > 0.5 ? "success" : "failure");
    }, 3000);
  };

  const handleExplanationToggle = () => {
    setShowExplanation(!showExplanation);
  };

  if (!currentScenario) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">AI Failure Modes Simulator</h1>
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
        <div className="flex items-center mb-4">
          {currentScenario.icon}
          <h2 className="text-xl font-semibold ml-2">{currentScenario.title}</h2>
        </div>
        <p className="mb-4">{currentScenario.description}</p>
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSimulationStart}
            disabled={simulationState !== "idle"}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            aria-label="Start simulation"
          >
            {simulationState === "idle" ? "Start Simulation" : "Simulating..."}
          </button>
        </div>
        {simulationState === "success" && (
          <div className="flex items-center justify-center text-green-500 mb-4">
            <CheckCircle className="w-6 h-6 mr-2" />
            <span>AI performed as expected</span>
          </div>
        )}
        {simulationState === "failure" && (
          <div className="flex items-center justify-center text-red-500 mb-4">
            <XCircle className="w-6 h-6 mr-2" />
            <span>AI failure detected</span>
          </div>
        )}
        {simulationState !== "idle" && (
          <button
            onClick={handleExplanationToggle}
            className="text-blue-500 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-expanded={showExplanation}
          >
            {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </button>
        )}
        {showExplanation && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-semibold mb-2">Failure Mode:</h3>
            <p>{currentScenario.failureMode}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFailureModesSimulator;