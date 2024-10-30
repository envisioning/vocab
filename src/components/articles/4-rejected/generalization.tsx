"use client"
import { useState, useEffect } from "react";
import { ChefHat, BookOpen, Car, Brain, RefreshCw, Target } from "lucide-react";

interface ComponentProps {}

type Scenario = {
  id: number;
  name: string;
  icon: JSX.Element;
  description: string;
};

type AIState = {
  training: number;
  generalization: number;
};

const SCENARIOS: Scenario[] = [
  { id: 1, name: "Chef", icon: <ChefHat />, description: "Cook Italian dishes with new ingredients" },
  { id: 2, name: "Translator", icon: <BookOpen />, description: "Translate casual conversations" },
  { id: 3, name: "Car", icon: <Car />, description: "Navigate roads in a new state" },
];

/**
 * GeneralizationGame: An interactive component teaching the concept of generalization in AI
 */
const GeneralizationGame: React.FC<ComponentProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [aiState, setAIState] = useState<AIState>({ training: 0, generalization: 0 });
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    let trainingInterval: NodeJS.Timeout;
    if (isTraining) {
      trainingInterval = setInterval(() => {
        setAIState((prev) => ({
          ...prev,
          training: Math.min(prev.training + 10, 100),
        }));
      }, 500);
    }
    return () => clearInterval(trainingInterval);
  }, [isTraining]);

  useEffect(() => {
    let testingInterval: NodeJS.Timeout;
    if (isTesting) {
      testingInterval = setInterval(() => {
        setAIState((prev) => ({
          ...prev,
          generalization: Math.min(
            prev.generalization + Math.floor(Math.random() * 20),
            prev.training
          ),
        }));
      }, 500);
    }
    return () => clearInterval(testingInterval);
  }, [isTesting]);

  const handleTrain = () => {
    setIsTraining(true);
    setIsTesting(false);
  };

  const handleTest = () => {
    setIsTraining(false);
    setIsTesting(true);
  };

  const handleReset = () => {
    setIsTraining(false);
    setIsTesting(false);
    setAIState({ training: 0, generalization: 0 });
  };

  const handleNextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
    handleReset();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Generalization Game</h2>
      <div className="mb-4 flex items-center">
        <div className="mr-2">{SCENARIOS[currentScenario].icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{SCENARIOS[currentScenario].name}</h3>
          <p>{SCENARIOS[currentScenario].description}</p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Brain className="mr-2" />
          <span>Training Progress:</span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${aiState.training}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center">
          <Target className="mr-2" />
          <span>Generalization:</span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${aiState.generalization}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          onClick={handleTrain}
          disabled={isTraining}
        >
          Train AI
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
          onClick={handleTest}
          disabled={isTesting || aiState.training === 0}
        >
          Test Generalization
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300"
          onClick={handleNextScenario}
        >
          Next Scenario
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Train the AI in one scenario, then test its ability to generalize to new situations.
      </p>
    </div>
  );
};

export default GeneralizationGame;