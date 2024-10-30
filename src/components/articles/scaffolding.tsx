"use client"
import { useState, useEffect } from "react";
import { Pool, LifeBuoy, User, ArrowRight, Award, RefreshCcw } from "lucide-react";

interface SwimmerState {
  lane: number;
  progress: number;
  success: number;
}

interface SupportLevel {
  id: number;
  name: string;
  description: string;
  successRate: number;
}

const SUPPORT_LEVELS: SupportLevel[] = [
  { id: 0, name: "Full Support", description: "Full flotation suit", successRate: 0.95 },
  { id: 1, name: "High Support", description: "Arm floaties", successRate: 0.8 },
  { id: 2, name: "Medium Support", description: "Kickboard", successRate: 0.6 },
  { id: 3, name: "No Support", description: "Independent", successRate: 0.4 },
];

export default function ScaffoldingSimulator() {
  const [difficulty, setDifficulty] = useState<number>(1);
  const [swimmer, setSwimmer] = useState<SwimmerState>({
    lane: 0,
    progress: 0,
    success: 0,
  });
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<number | null>(null);

  useEffect(() => {
    let animationFrame: number;
    let success = 0;

    const simulate = () => {
      if (isSimulating) {
        setSwimmer((prev) => {
          const currentSuccess = Math.random() < 
            (SUPPORT_LEVELS[prev.lane].successRate / difficulty);
          
          if (currentSuccess) success++;
          
          const newProgress = prev.progress + 1;
          if (newProgress >= 100) {
            setIsSimulating(false);
            return { ...prev, progress: 100, success };
          }
          
          return { ...prev, progress: newProgress, success };
        });
        
        animationFrame = requestAnimationFrame(simulate);
      }
    };

    if (isSimulating) {
      animationFrame = requestAnimationFrame(simulate);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isSimulating, difficulty]);

  const handleLaneChange = (laneId: number) => {
    if (!isSimulating) {
      setSwimmer({ lane: laneId, progress: 0, success: 0 });
    }
  };

  const handleReset = () => {
    setIsSimulating(false);
    setSwimmer({ lane: 0, progress: 0, success: 0 });
    setPrediction(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
        <Pool className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">Scaffolding Learning Simulator</h1>
        <RefreshCcw
          className="w-6 h-6 cursor-pointer hover:text-blue-500 transition-colors duration-300"
          onClick={handleReset}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {SUPPORT_LEVELS.map((level) => (
          <div
            key={level.id}
            onClick={() => handleLaneChange(level.id)}
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
              swimmer.lane === level.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <LifeBuoy className={`w-6 h-6 ${level.id === swimmer.lane ? "text-blue-500" : "text-gray-400"}`} />
              <span className="font-medium">{level.name}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{level.description}</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${swimmer.lane === level.id ? swimmer.progress : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <span>Difficulty:</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="w-32"
          />
          <span>{difficulty.toFixed(1)}x</span>
        </label>

        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          {isSimulating ? "Stop" : "Start"} Simulation
        </button>

        {swimmer.progress === 100 && (
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-green-500" />
            <span>Success Rate: {(swimmer.success)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}