"use client"
import { useState, useEffect } from "react";
import { Coffee, Mountain, Play, Pause, RefreshCw, ThermometerSnowflake } from "lucide-react";

interface Scenario {
  id: number;
  type: "coffee" | "mountain";
  current: number;
  target: number;
  rate: number;
}

interface ConvergenceProps {}

const INITIAL_SCENARIOS: Scenario[] = [
  { id: 1, type: "coffee", current: 90, target: 25, rate: 0.1 },
  { id: 2, type: "mountain", current: 100, target: 0, rate: 0.15 }
];

/**
 * Interactive convergence learning component for students
 * Demonstrates convergence through coffee cooling and mountain descent scenarios
 */
const ConvergenceLearning: React.FC<ConvergenceProps> = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [predictions, setPredictions] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setScenarios(prev => prev.map(scenario => ({
        ...scenario,
        current: scenario.current - (scenario.current - scenario.target) * scenario.rate * speed
      })));
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  const handlePrediction = (id: number, value: number) => {
    setPredictions(prev => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    setScenarios(INITIAL_SCENARIOS);
    setPredictions({});
    setIsRunning(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Convergence Explorer</h2>
          <div className="space-x-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
              aria-label={isRunning ? "Pause simulation" : "Start simulation"}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition duration-300"
              aria-label="Reset simulation"
            >
              <RefreshCw size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {scenarios.map(scenario => (
            <div key={scenario.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center gap-2 mb-4">
                {scenario.type === "coffee" ? (
                  <Coffee className="text-gray-600" />
                ) : (
                  <Mountain className="text-gray-600" />
                )}
                <h3 className="text-lg font-semibold">
                  {scenario.type === "coffee" ? "Coffee Cooling" : "Mountain Descent"}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ThermometerSnowflake className="text-blue-500" />
                  <span className="text-2xl font-bold">
                    {scenario.current.toFixed(1)}°
                  </span>
                </div>

                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{
                      width: `${((scenario.current - scenario.target) / (INITIAL_SCENARIOS[scenario.id - 1].current - scenario.target)) * 100}%`
                    }}
                  />
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full"
                  aria-label="Simulation speed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConvergenceLearning;