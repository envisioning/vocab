"use client"
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, User, Users, Award, RefreshCw, Smile, Frown } from "lucide-react";

interface JugglingPattern {
  id: number;
  name: string;
  difficulty: number;
  baseReward: number;
}

interface PerformanceState {
  currentReward: number;
  crowdSatisfaction: number;
  currentPattern: number;
  skillLevel: number;
}

const JUGGLING_PATTERNS: JugglingPattern[] = [
  { id: 1, name: "Basic Cascade", difficulty: 1, baseReward: 10 },
  { id: 2, name: "Reverse Cascade", difficulty: 2, baseReward: 20 },
  { id: 3, name: "Mills Mess", difficulty: 3, baseReward: 30 },
  { id: 4, name: "Factory", difficulty: 4, baseReward: 40 },
];

export default function PolicyGradientLearner() {
  const [performance, setPerformance] = useState<PerformanceState>({
    currentReward: 0,
    crowdSatisfaction: 50,
    currentPattern: 1,
    skillLevel: 1,
  });
  const [learningRate, setLearningRate] = useState<number>(0.5);
  const [isPerforming, setIsPerforming] = useState<boolean>(false);
  const [gradientDirection, setGradientDirection] = useState<number>(0);

  useEffect(() => {
    if (isPerforming) {
      const performInterval = setInterval(() => {
        updatePerformance();
      }, 1000);

      return () => clearInterval(performInterval);
    }
  }, [isPerforming, performance]);

  const updatePerformance = () => {
    const pattern = JUGGLING_PATTERNS[performance.currentPattern - 1];
    const successProbability = Math.min(performance.skillLevel / pattern.difficulty, 1);
    const isSuccessful = Math.random() < successProbability;

    const newReward = isSuccessful ? pattern.baseReward : -pattern.baseReward / 2;
    const newGradient = newReward > performance.currentReward ? 1 : -1;

    setPerformance(prev => ({
      ...prev,
      currentReward: newReward,
      crowdSatisfaction: Math.max(0, Math.min(100, prev.crowdSatisfaction + (isSuccessful ? 5 : -5))),
      skillLevel: prev.skillLevel + (isSuccessful ? learningRate * 0.1 : 0),
    }));
    setGradientDirection(newGradient);
  };

  const selectPattern = (patternId: number) => {
    setPerformance(prev => ({ ...prev, currentPattern: patternId }));
  };

  const resetPerformance = () => {
    setIsPerforming(false);
    setPerformance({
      currentReward: 0,
      crowdSatisfaction: 50,
      currentPattern: 1,
      skillLevel: 1,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <User className="mx-auto w-16 h-16 text-blue-500" />
        <div className="mt-4 flex justify-center items-center gap-4">
          {gradientDirection > 0 && <ArrowUp className="text-green-500 animate-bounce" />}
          {gradientDirection < 0 && <ArrowDown className="text-red-500 animate-bounce" />}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span>Crowd Satisfaction</span>
          <div className="flex items-center">
            {performance.crowdSatisfaction >= 50 ? (
              <Smile className="text-green-500 w-5 h-5" />
            ) : (
              <Frown className="text-gray-500 w-5 h-5" />
            )}
            <span className="ml-2">{performance.crowdSatisfaction}%</span>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${performance.crowdSatisfaction}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {JUGGLING_PATTERNS.map(pattern => (
          <button
            key={pattern.id}
            onClick={() => selectPattern(pattern.id)}
            className={`p-4 rounded-lg border transition-colors duration-300 ${
              performance.currentPattern === pattern.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
            aria-pressed={performance.currentPattern === pattern.id}
          >
            {pattern.name}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="block mb-2">Learning Rate: {learningRate}</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={learningRate}
          onChange={(e) => setLearningRate(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsPerforming(!isPerforming)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          {isPerforming ? "Stop" : "Start"} Performance
        </button>
        <button
          onClick={resetPerformance}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}