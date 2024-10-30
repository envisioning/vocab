"use client";
import { useState, useEffect } from "react";
import { ChefHat, Book, ArrowRight, CheckCircle, XCircle, Brain, CookingPot } from "lucide-react";

interface Recipe {
  id: number;
  name: string;
  difficulty: number;
  ingredients: string[];
  success: boolean;
}

interface KitchenState {
  currentScenario: number;
  recipeInProgress: boolean;
  generatedRecipes: Recipe[];
  masterChefThinking: boolean;
}

const HyperChefKitchen = () => {
  const [kitchenState, setKitchenState] = useState<KitchenState>({
    currentScenario: 0,
    recipeInProgress: false,
    generatedRecipes: [],
    masterChefThinking: false,
  });

  const scenarios = [
    { id: 1, name: "Beginner Cook", complexity: "Low" },
    { id: 2, name: "Health-Conscious", complexity: "Medium" },
    { id: 3, name: "Expert Chef", complexity: "High" },
  ];

  const generateRecipe = (scenarioId: number): Recipe => ({
    id: Math.random(),
    name: `Recipe ${scenarioId}`,
    difficulty: scenarioId,
    ingredients: ["ingredient1", "ingredient2"],
    success: Math.random() > 0.3,
  });

  const handleScenarioSelect = (scenarioId: number) => {
    setKitchenState(prev => ({
      ...prev,
      currentScenario: scenarioId,
      masterChefThinking: true,
    }));

    setTimeout(() => {
      const newRecipe = generateRecipe(scenarioId);
      setKitchenState(prev => ({
        ...prev,
        masterChefThinking: false,
        generatedRecipes: [...prev.generatedRecipes, newRecipe],
      }));
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold">HyperChef Kitchen</h2>
        </div>
        <Brain className="w-8 h-8 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Select Cooking Scenario</h3>
          <div className="space-y-3">
            {scenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => handleScenarioSelect(scenario.id)}
                className={`w-full p-3 rounded-lg transition-colors duration-300 ${
                  kitchenState.currentScenario === scenario.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-pressed={kitchenState.currentScenario === scenario.id}
              >
                <div className="flex items-center justify-between">
                  <span>{scenario.name}</span>
                  <span className="text-sm opacity-75">
                    {scenario.complexity}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Recipe Generation</h3>
          <div className="space-y-4">
            {kitchenState.masterChefThinking ? (
              <div className="flex items-center gap-2 text-gray-600">
                <CookingPot className="w-6 h-6 animate-spin" />
                <span>Master Chef is analyzing...</span>
              </div>
            ) : (
              kitchenState.generatedRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  className="border p-3 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium">{recipe.name}</span>
                    <div className="text-sm text-gray-500">
                      Difficulty: {recipe.difficulty}
                    </div>
                  </div>
                  {recipe.success ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Book className="w-6 h-6 text-blue-500" />
          <h3 className="font-semibold">Learning Points</h3>
        </div>
        <p className="text-sm text-gray-600">
          Just as our Master Chef adapts recipes for different skill levels,
          a hypernetwork generates specialized weights for different scenarios.
        </p>
      </div>
    </div>
  );
};

export default HyperChefKitchen;