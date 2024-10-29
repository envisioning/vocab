"use client"
import { useState, useEffect } from "react";
import { Activity, BarChart, Zap, RefreshCw, AlertTriangle } from "lucide-react";

interface ComponentProps {}

type Metric = {
  accuracy: number;
  speed: number;
  efficiency: number;
};

type Stressor = {
  name: string;
  icon: JSX.Element;
  impact: Partial<Metric>;
};

const INITIAL_METRIC: Metric = { accuracy: 100, speed: 100, efficiency: 100 };

const STRESSORS: Stressor[] = [
  { name: "Data Complexity", icon: <BarChart />, impact: { accuracy: -10, speed: -5 } },
  { name: "Resource Constraint", icon: <Zap />, impact: { speed: -15, efficiency: -10 } },
  { name: "Distribution Shift", icon: <RefreshCw />, impact: { accuracy: -20, efficiency: -5 } },
];

/**
 * AIFitnessTracker: A component that visualizes AI performance degradation over time.
 */
const AIFitnessTracker: React.FC<ComponentProps> = () => {
  const [metrics, setMetrics] = useState<Metric>(INITIAL_METRIC);
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [appliedStressors, setAppliedStressors] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        setMetrics((prevMetrics) => ({
          accuracy: Math.max(prevMetrics.accuracy - 0.5, 0),
          speed: Math.max(prevMetrics.speed - 0.3, 0),
          efficiency: Math.max(prevMetrics.efficiency - 0.2, 0),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleToggleSimulation = () => setIsRunning((prev) => !prev);

  const handleReset = () => {
    setMetrics(INITIAL_METRIC);
    setTime(0);
    setAppliedStressors([]);
  };

  const handleApplyStressor = (stressor: Stressor) => {
    if (appliedStressors.includes(stressor.name)) return;
    setMetrics((prevMetrics) => ({
      accuracy: Math.max(prevMetrics.accuracy + (stressor.impact.accuracy || 0), 0),
      speed: Math.max(prevMetrics.speed + (stressor.impact.speed || 0), 0),
      efficiency: Math.max(prevMetrics.efficiency + (stressor.impact.efficiency || 0), 0),
    }));
    setAppliedStressors((prev) => [...prev, stressor.name]);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">AI Fitness Tracker</h2>
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handleToggleSimulation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isRunning ? "Pause" : "Start"} Simulation
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Reset
        </button>
        <div className="text-lg font-semibold">Time: {time}s</div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2 capitalize">{key}</h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${value}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
            <p className="text-center">{value.toFixed(1)}%</p>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Apply Stressors</h3>
        <div className="flex space-x-2">
          {STRESSORS.map((stressor) => (
            <button
              key={stressor.name}
              onClick={() => handleApplyStressor(stressor)}
              disabled={appliedStressors.includes(stressor.name)}
              className="flex items-center bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stressor.icon}
              <span className="ml-2">{stressor.name}</span>
            </button>
          ))}
        </div>
      </div>
      {Object.values(metrics).some((value) => value < 20) && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Performance Critical!</p>
          <p>AI system performance has degraded significantly. Consider retraining or maintenance.</p>
        </div>
      )}
    </div>
  );
};

export default AIFitnessTracker;