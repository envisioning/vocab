"use client"
import { useState, useEffect } from "react";
import { Chef, CookingPot, Battery, Brain, Coins, BarChart2 } from "lucide-react";

interface TrainingStats {
  accuracy: number;
  cost: number;
  attempts: number;
}

const INITIAL_BUDGET = 1000;
const COST_PER_ATTEMPT = {
  ingredients: 50,
  energy: 30,
  expertise: 70,
};

const calculateAccuracyGain = (attempts: number): number => {
  return Math.min(95, 40 + (attempts * 5) / (1 + attempts * 0.1));
};

export default function AITrainingKitchen() {
  const [budget, setBudget] = useState<number>(INITIAL_BUDGET);
  const [stats, setStats] = useState<TrainingStats>({
    accuracy: 40,
    cost: 0,
    attempts: 0,
  });
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [selectedResources, setSelectedResources] = useState<{
    ingredients: number;
    energy: number;
    expertise: number;
  }>({ ingredients: 1, energy: 1, expertise: 1 });

  useEffect(() => {
    if (isTraining) {
      const totalCost =
        COST_PER_ATTEMPT.ingredients * selectedResources.ingredients +
        COST_PER_ATTEMPT.energy * selectedResources.energy +
        COST_PER_ATTEMPT.expertise * selectedResources.expertise;

      if (budget >= totalCost) {
        const trainingInterval = setInterval(() => {
          setStats((prev) => ({
            attempts: prev.attempts + 1,
            cost: prev.cost + totalCost,
            accuracy: calculateAccuracyGain(prev.attempts + 1),
          }));
          setBudget((prev) => prev - totalCost);
          setIsTraining(false);
        }, 1000);

        return () => clearInterval(trainingInterval);
      } else {
        setIsTraining(false);
      }
    }
  }, [isTraining, budget, selectedResources]);

  const handleResourceChange = (
    resource: "ingredients" | "energy" | "expertise",
    value: number
  ) => {
    setSelectedResources((prev) => ({
      ...prev,
      [resource]: Math.max(1, Math.min(5, value)),
    }));
  };

  const totalCost =
    COST_PER_ATTEMPT.ingredients * selectedResources.ingredients +
    COST_PER_ATTEMPT.energy * selectedResources.energy +
    COST_PER_ATTEMPT.expertise * selectedResources.expertise;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">AI Training Kitchen</h2>
        <div className="flex items-center justify-center gap-2">
          <Coins className="text-blue-500" />
          <span>Budget: {budget} coins</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <CookingPot className="mb-2 text-blue-500" />
          <label className="text-sm mb-1">Ingredients</label>
          <input
            type="range"
            min="1"
            max="5"
            value={selectedResources.ingredients}
            onChange={(e) =>
              handleResourceChange("ingredients", parseInt(e.target.value))
            }
            className="w-full"
            aria-label="Adjust ingredients quantity"
          />
          <span>{selectedResources.ingredients}x</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <Battery className="mb-2 text-blue-500" />
          <label className="text-sm mb-1">Energy</label>
          <input
            type="range"
            min="1"
            max="5"
            value={selectedResources.energy}
            onChange={(e) =>
              handleResourceChange("energy", parseInt(e.target.value))
            }
            className="w-full"
            aria-label="Adjust energy level"
          />
          <span>{selectedResources.energy}x</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <Brain className="mb-2 text-blue-500" />
          <label className="text-sm mb-1">Expertise</label>
          <input
            type="range"
            min="1"
            max="5"
            value={selectedResources.expertise}
            onChange={(e) =>
              handleResourceChange("expertise", parseInt(e.target.value))
            }
            className="w-full"
            aria-label="Adjust expertise level"
          />
          <span>{selectedResources.expertise}x</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-blue-500" />
          <span>Accuracy: {stats.accuracy.toFixed(1)}%</span>
        </div>
        <div>Total Cost: {totalCost} coins</div>
        <button
          onClick={() => setIsTraining(true)}
          disabled={isTraining || budget < totalCost}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-300"
          aria-label="Start training"
        >
          Train
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        Attempts: {stats.attempts} | Total Spent: {stats.cost} coins
      </div>
    </div>
  );
}