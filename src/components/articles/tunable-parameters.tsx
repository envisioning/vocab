"use client"
import { useState, useEffect } from "react";
import { Sliders, Target, History, RefreshCw } from "lucide-react";

interface Parameter {
  name: string;
  value: number;
  weight: number;
}

interface WaveformPoint {
  x: number;
  y: number;
}

interface ComponentProps {}

const INITIAL_PARAMETERS: Parameter[] = [
  { name: "Bass", value: 50, weight: 0.3 },
  { name: "Treble", value: 50, weight: 0.2 },
  { name: "Reverb", value: 50, weight: 0.25 },
  { name: "Volume", value: 50, weight: 0.25 },
];

const TARGET_PATTERN: WaveformPoint[] = Array.from({ length: 50 }, (_, i) => ({
  x: i,
  y: Math.sin(i * 0.2) * 30 + 50,
}));

export default function TunableParameters({}: ComponentProps) {
  const [parameters, setParameters] = useState<Parameter[]>(INITIAL_PARAMETERS);
  const [currentPattern, setCurrentPattern] = useState<WaveformPoint[]>([]);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number[]>([]);

  useEffect(() => {
    updateCurrentPattern();
    return () => {
      setCurrentPattern([]);
    };
  }, [parameters]);

  const updateCurrentPattern = () => {
    const newPattern = TARGET_PATTERN.map((point) => ({
      x: point.x,
      y: parameters.reduce((acc, param) => {
        return acc + (param.value - 50) * param.weight * Math.sin(point.x * 0.1);
      }, point.y),
    }));
    setCurrentPattern(newPattern);
    calculateScore(newPattern);
  };

  const calculateScore = (pattern: WaveformPoint[]) => {
    const totalDifference = pattern.reduce((acc, point, i) => {
      return acc + Math.abs(point.y - TARGET_PATTERN[i].y);
    }, 0);
    const newScore = Math.max(0, 100 - (totalDifference / pattern.length));
    setScore(newScore);
    setAttempts((prev) => [...prev, newScore].slice(-10));
  };

  const handleSliderChange = (index: number, value: number) => {
    const newParameters = [...parameters];
    newParameters[index].value = value;
    setParameters(newParameters);
  };

  const resetParameters = () => {
    setParameters(INITIAL_PARAMETERS);
    setAttempts([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sliders className="text-blue-500" />
          AI Sound Engineer
        </h1>
        <button
          onClick={resetParameters}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
          aria-label="Reset parameters"
        >
          <RefreshCw className="text-gray-600" />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Target className="text-green-500" />
          <span className="font-semibold">Match Score: {score.toFixed(1)}%</span>
        </div>
        <div className="h-40 bg-gray-100 rounded-lg p-4 relative">
          {[currentPattern, TARGET_PATTERN].map((pattern, idx) => (
            <svg
              key={idx}
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 50 100"
              preserveAspectRatio="none"
            >
              <path
                d={`M ${pattern.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                fill="none"
                stroke={idx === 0 ? "#3B82F6" : "#22C55E"}
                strokeWidth="2"
              />
            </svg>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {parameters.map((param, idx) => (
          <div key={param.name} className="flex items-center gap-4">
            <span className="w-20">{param.name}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={param.value}
              onChange={(e) => handleSliderChange(idx, Number(e.target.value))}
              className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label={`Adjust ${param.name}`}
            />
            <span className="w-12 text-right">{param.value}%</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <History className="text-blue-500" />
          <span className="font-semibold">Progress History</span>
        </div>
        <div className="h-20 bg-gray-100 rounded-lg p-2">
          <div className="h-full flex items-end gap-1">
            {attempts.map((attempt, idx) => (
              <div
                key={idx}
                className="flex-1 bg-blue-500 rounded-t transition-all duration-300"
                style={{ height: `${attempt}%` }}
                aria-label={`Attempt ${idx + 1}: ${attempt.toFixed(1)}%`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}