"use client"
import { useState, useEffect } from "react";
import { Car, Gauge, Tool, Users, AlertTriangle, CheckCircle, Activity } from "lucide-react";

interface MLOpsMetrics {
  speed: number;
  maintenance: number;
  fuel: number;
  teamEfficiency: number;
}

interface Scenario {
  id: number;
  situation: string;
  options: string[];
  correctIndex: number;
  feedback: string[];
}

const INITIAL_METRICS: MLOpsMetrics = {
  speed: 80,
  maintenance: 90,
  fuel: 100,
  teamEfficiency: 85,
};

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    situation: "Model accuracy dropping. Performance degradation detected.",
    options: ["Push harder", "Schedule pit stop", "Ignore warning"],
    correctIndex: 1,
    feedback: [
      "Speed isn't everything in MLOps",
      "Good choice! Regular maintenance prevents failures",
      "Ignoring warnings leads to technical debt",
    ],
  },
];

const MLOpsRacingSimulator = () => {
  const [metrics, setMetrics] = useState<MLOpsMetrics>(INITIAL_METRICS);
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        fuel: Math.max(0, prev.fuel - 1),
        maintenance: Math.max(0, prev.maintenance - 0.5),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleDecision = (optionIndex: number) => {
    const scenario = SCENARIOS[currentScenario];
    const isCorrect = optionIndex === scenario.correctIndex;

    setMetrics((prev) => ({
      ...prev,
      teamEfficiency: isCorrect ? prev.teamEfficiency + 5 : prev.teamEfficiency - 5,
      maintenance: isCorrect ? 90 : prev.maintenance - 10,
    }));

    setFeedback(scenario.feedback[optionIndex]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2 bg-white p-4 rounded-lg">
          <Gauge className="text-blue-500" />
          <div>
            <h3 className="font-semibold">Model Performance</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2"
                style={{ width: `${metrics.speed}%` }}
                role="progressbar"
                aria-valuenow={metrics.speed}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-white p-4 rounded-lg">
          <Tool className="text-blue-500" />
          <div>
            <h3 className="font-semibold">Technical Debt</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 rounded-full h-2"
                style={{ width: `${metrics.maintenance}%` }}
                role="progressbar"
                aria-valuenow={metrics.maintenance}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Current Situation</h2>
        <p className="mb-4">{SCENARIOS[currentScenario].situation}</p>
        <div className="grid grid-cols-3 gap-4">
          {SCENARIOS[currentScenario].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleDecision(index)}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              aria-label={option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="flex items-center">
            <AlertTriangle className="mr-2 text-blue-500" />
            {feedback}
          </p>
        </div>
      )}
    </div>
  );
};

export default MLOpsRacingSimulator;