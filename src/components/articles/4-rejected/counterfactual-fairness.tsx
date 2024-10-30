"use client"
import { useState, useEffect } from "react";
import { User, Users, Briefcase, GraduationCap, CreditCard, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

interface Scenario {
  id: number;
  title: string;
  icon: JSX.Element;
  fairPrediction: string;
  unfairPrediction: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Job Application",
    icon: <Briefcase className="w-6 h-6" />,
    fairPrediction: "Highly qualified for the position",
    unfairPrediction: "May not fit company culture",
  },
  {
    id: 2,
    title: "University Admission",
    icon: <GraduationCap className="w-6 h-6" />,
    fairPrediction: "Strong academic potential",
    unfairPrediction: "Might struggle with coursework",
  },
  {
    id: 3,
    title: "Loan Approval",
    icon: <CreditCard className="w-6 h-6" />,
    fairPrediction: "Good candidate for loan",
    unfairPrediction: "High risk of default",
  },
];

/**
 * CounterfactualFairnessExplorer: A component to teach Counterfactual Fairness
 * through an interactive "Fairness Mirror" simulation.
 */
const CounterfactualFairnessExplorer: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [isAltered, setIsAltered] = useState<boolean>(false);
  const [isFair, setIsFair] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleAppearance = () => {
    setIsAltered((prev) => !prev);
  };

  const handleToggleFairness = () => {
    setIsFair((prev) => !prev);
  };

  const handleNextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
  };

  const handlePrevScenario = () => {
    setCurrentScenario((prev) => (prev - 1 + SCENARIOS.length) % SCENARIOS.length);
  };

  const handleReset = () => {
    setIsAltered(false);
    setIsFair(true);
    setCurrentScenario(0);
  };

  const scenario = SCENARIOS[currentScenario];

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">The Fairness Mirror</h1>
      <div className="flex items-center justify-center mb-4">
        <User className={`w-20 h-20 ${isAltered ? 'text-blue-500' : 'text-gray-700'}`} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevScenario}
          className="p-2 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous scenario"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{scenario.title}</h2>
          {scenario.icon}
        </div>
        <button
          onClick={handleNextScenario}
          className="p-2 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next scenario"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold mb-2">AI Prediction:</h3>
        <p>{isFair ? scenario.fairPrediction : scenario.unfairPrediction}</p>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleToggleAppearance}
          className={`px-4 py-2 rounded ${
            isAltered ? 'bg-blue-500 text-white' : 'bg-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {isAltered ? 'Revert Appearance' : 'Alter Appearance'}
        </button>
        <button
          onClick={handleToggleFairness}
          className={`px-4 py-2 rounded ${
            isFair ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {isFair ? 'Fair Prediction' : 'Unfair Prediction'}
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <RefreshCw className="w-4 h-4 inline-block mr-2" />
          Reset
        </button>
      </div>
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <h3 className="font-semibold mb-2">Learning Point:</h3>
        <p>
          Counterfactual Fairness ensures that AI predictions remain consistent
          regardless of changes in protected attributes like appearance.
        </p>
      </div>
    </div>
  );
};

export default CounterfactualFairnessExplorer;