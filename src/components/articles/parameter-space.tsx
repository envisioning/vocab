"use client"
import { useState, useEffect } from "react";
import { Cookie, Dumbbell, Home, ChevronRight, X, Check, RefreshCw } from "lucide-react";

interface Parameter {
  name: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

interface Scenario {
  icon: JSX.Element;
  title: string;
  parameters: Parameter[];
  target: number[];
  description: string;
}

const SCENARIOS: Scenario[] = [
  {
    icon: <Cookie className="w-6 h-6" />,
    title: "Perfect Cookie Recipe",
    parameters: [
      { name: "Sugar", value: 50, min: 0, max: 100, unit: "g" },
      { name: "Flour", value: 50, min: 0, max: 100, unit: "g" },
      { name: "Temperature", value: 180, min: 150, max: 220, unit: "°C" }
    ],
    target: [75, 60, 190],
    description: "Find the perfect balance of ingredients for the ultimate cookie!"
  },
  {
    icon: <Dumbbell className="w-6 h-6" />,
    title: "Character Stats",
    parameters: [
      { name: "Strength", value: 5, min: 1, max: 10, unit: "pts" },
      { name: "Agility", value: 5, min: 1, max: 10, unit: "pts" },
      { name: "Intelligence", value: 5, min: 1, max: 10, unit: "pts" }
    ],
    target: [8, 7, 6],
    description: "Create the perfect character build!"
  }
];

const ParameterSpaceExplorer = () => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [parameters, setParameters] = useState<Parameter[]>(SCENARIOS[0].parameters);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const calculateScore = () => {
    const target = SCENARIOS[currentScenario].target;
    const current = parameters.map(p => p.value);
    const distance = target.reduce((acc, val, idx) => {
      return acc + Math.abs(val - current[idx]);
    }, 0);
    return Math.max(0, 100 - (distance * 5));
  };

  useEffect(() => {
    const newScore = calculateScore();
    setScore(newScore);
    setFeedback(newScore > 80 ? "Excellent!" : newScore > 60 ? "Getting closer!" : "Keep exploring!");

    return () => {
      setScore(0);
      setFeedback("");
    };
  }, [parameters]);

  const handleParameterChange = (index: number, value: number) => {
    const newParameters = [...parameters];
    newParameters[index].value = value;
    setParameters(newParameters);
  };

  const handleReset = () => {
    setParameters(SCENARIOS[currentScenario].parameters);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {SCENARIOS[currentScenario].icon}
          <h2 className="text-xl font-bold">{SCENARIOS[currentScenario].title}</h2>
        </div>
        <button
          onClick={handleReset}
          className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
          aria-label="Reset parameters"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {parameters.map((param, index) => (
          <div key={param.name} className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor={param.name} className="font-medium">
                {param.name}
              </label>
              <span className="text-gray-600">
                {param.value} {param.unit}
              </span>
            </div>
            <input
              type="range"
              id={param.name}
              value={param.value}
              min={param.min}
              max={param.max}
              onChange={(e) => handleParameterChange(index, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label={`Adjust ${param.name}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Optimization Score</p>
            <p className="text-2xl font-bold text-blue-500">{score}%</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Feedback</p>
            <p className="text-gray-600">{feedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterSpaceExplorer;