"use client"
import { useState, useEffect } from "react";
import { Sliders, Target, AlertTriangle, CheckCircle, RefreshCcw } from "lucide-react";

interface Scenario {
  id: number;
  description: string;
  aiAction: string;
  humanImpact: string;
  isAligned: boolean;
}

interface HumanValues {
  privacy: number;
  fairness: number;
  environment: number;
  jobPreservation: number;
}

const INITIAL_VALUES: HumanValues = {
  privacy: 50,
  fairness: 50,
  environment: 50,
  jobPreservation: 50,
};

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    description: "AI-powered recruitment system",
    aiAction: "Optimizes for efficiency in hiring process",
    humanImpact: "May overlook diverse candidates",
    isAligned: false,
  },
  {
    id: 2,
    description: "Smart home energy management",
    aiAction: "Maximizes energy savings",
    humanImpact: "Balances comfort and sustainability",
    isAligned: true,
  },
  {
    id: 3,
    description: "Autonomous vehicle navigation",
    aiAction: "Chooses fastest route through busy areas",
    humanImpact: "Increases traffic in residential zones",
    isAligned: false,
  },
];

/**
 * AlignmentSimulator - An interactive component to teach AI alignment concepts
 */
const AlignmentSimulator = () => {
  const [values, setValues] = useState<HumanValues>(INITIAL_VALUES);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      timer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * SCENARIOS.length);
        setCurrentScenario(SCENARIOS[randomIndex]);
        setIsSimulating(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isSimulating]);

  const handleValueChange = (key: keyof HumanValues, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setCurrentScenario(null);
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setCurrentScenario(null);
    setIsSimulating(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">AI Alignment Simulator</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Human Values</h2>
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="mb-2">
            <label htmlFor={key} className="block text-sm font-medium">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="range"
              id={key}
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleValueChange(key as keyof HumanValues, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSimulate}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 flex items-center"
        disabled={isSimulating}
      >
        <Target className="mr-2" />
        Simulate Scenario
      </button>

      <button
        onClick={handleReset}
        className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
      >
        <RefreshCcw className="mr-2" />
        Reset
      </button>

      {isSimulating && (
        <div className="mt-4 text-center">
          <Sliders className="animate-spin inline-block" />
          <p>Simulating scenario...</p>
        </div>
      )}

      {currentScenario && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{currentScenario.description}</h3>
          <p><strong>AI Action:</strong> {currentScenario.aiAction}</p>
          <p><strong>Human Impact:</strong> {currentScenario.humanImpact}</p>
          <div className="mt-2">
            {currentScenario.isAligned ? (
              <p className="text-green-500 flex items-center">
                <CheckCircle className="mr-2" />
                Aligned with human values
              </p>
            ) : (
              <p className="text-red-500 flex items-center">
                <AlertTriangle className="mr-2" />
                Misaligned with human values
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlignmentSimulator;