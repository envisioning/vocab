"use client"
import { useState, useEffect } from "react";
import { Music, Users, Zap, Shuffle, Trophy, RefreshCcw } from "lucide-react";

interface DanceMetrics {
  crowdSatisfaction: number;
  stylePoints: number;
}

interface ScenarioType {
  id: number;
  name: string;
  description: string;
  optimalSettings: {
    energy: number;
    variety: number;
    risk: number;
  };
}

const SCENARIOS: ScenarioType[] = [
  {
    id: 1,
    name: "Slow Dance",
    description: "Romantic slow song playing",
    optimalSettings: { energy: 30, variety: 40, risk: 20 }
  },
  {
    id: 2,
    name: "Party Mode",
    description: "Fast-paced dance music",
    optimalSettings: { energy: 80, variety: 70, risk: 60 }
  },
  {
    id: 3,
    name: "Freestyle",
    description: "Experimental electronic beats",
    optimalSettings: { energy: 50, variety: 90, risk: 80 }
  }
];

const DJMixingConsole = () => {
  const [energy, setEnergy] = useState<number>(50);
  const [variety, setVariety] = useState<number>(50);
  const [risk, setRisk] = useState<number>(50);
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [metrics, setMetrics] = useState<DanceMetrics>({
    crowdSatisfaction: 0,
    stylePoints: 0
  });

  const calculateMetrics = () => {
    const optimal = SCENARIOS[currentScenario].optimalSettings;
    const energyDiff = Math.abs(optimal.energy - energy);
    const varietyDiff = Math.abs(optimal.variety - variety);
    const riskDiff = Math.abs(optimal.risk - risk);
    
    const satisfaction = Math.max(0, 100 - (energyDiff + varietyDiff + riskDiff) / 3);
    const style = Math.max(0, 100 - (energyDiff * 0.5 + varietyDiff * 0.3 + riskDiff * 0.2));
    
    setMetrics({
      crowdSatisfaction: Math.round(satisfaction),
      stylePoints: Math.round(style)
    });
  };

  useEffect(() => {
    const timer = setInterval(calculateMetrics, 500);
    return () => clearInterval(timer);
  }, [energy, variety, risk, currentScenario]);

  const handleReset = () => {
    setEnergy(50);
    setVariety(50);
    setRisk(50);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-xl shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">DJ Policy Parameters</h2>
        <p className="text-gray-600">Current Scenario: {SCENARIOS[currentScenario].name}</p>
        <p className="text-sm text-gray-500">{SCENARIOS[currentScenario].description}</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Zap className="w-6 h-6 text-blue-500" />
          <label className="flex-1">
            <span className="block text-sm font-medium mb-1">Energy Level</span>
            <input
              type="range"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              min="0"
              max="100"
              aria-label="Energy Level"
            />
          </label>
          <span className="w-12 text-right">{energy}%</span>
        </div>

        <div className="flex items-center gap-4">
          <Shuffle className="w-6 h-6 text-blue-500" />
          <label className="flex-1">
            <span className="block text-sm font-medium mb-1">Move Variety</span>
            <input
              type="range"
              value={variety}
              onChange={(e) => setVariety(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              min="0"
              max="100"
              aria-label="Move Variety"
            />
          </label>
          <span className="w-12 text-right">{variety}%</span>
        </div>

        <div className="flex items-center gap-4">
          <Music className="w-6 h-6 text-blue-500" />
          <label className="flex-1">
            <span className="block text-sm font-medium mb-1">Risk Taking</span>
            <input
              type="range"
              value={risk}
              onChange={(e) => setRisk(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              min="0"
              max="100"
              aria-label="Risk Taking"
            />
          </label>
          <span className="w-12 text-right">{risk}%</span>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            <span>{metrics.crowdSatisfaction}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-green-500" />
            <span>{metrics.stylePoints}%</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Next Scenario
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-gray-600 hover:text-blue-500 transition duration-300"
            aria-label="Reset parameters"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DJMixingConsole;