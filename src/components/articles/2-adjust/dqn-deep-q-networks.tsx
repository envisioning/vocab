"use client"
import { useState, useEffect } from "react";
import { Chef, Brain, Book, Timer, Sparkles, ArrowRight, Utensils, Cookie, ThumbsUp, ThumbsDown } from "lucide-react";

interface Recipe {
  id: number;
  name: string;
  difficulty: number;
  rewards: number;
  ingredients: string[];
}

interface GameState {
  episode: number;
  score: number;
  currentRecipe: Recipe | null;
  memory: Recipe[];
  explorationRate: number;
}

const INITIAL_RECIPES: Recipe[] = [
  { id: 1, name: "Simple Sandwich", difficulty: 1, rewards: 10, ingredients: ["bread", "cheese"] },
  { id: 2, name: "Complex Pasta", difficulty: 3, rewards: 30, ingredients: ["pasta", "sauce", "herbs"] },
  { id: 3, name: "Gourmet Steak", difficulty: 5, rewards: 50, ingredients: ["meat", "spices", "butter"] },
];

/**
 * DQNKitchenTrainer - Interactive component teaching DQN through cooking metaphor
 */
export default function DQNKitchenTrainer() {
  const [gameState, setGameState] = useState<GameState>({
    episode: 0,
    score: 0,
    currentRecipe: null,
    memory: [],
    explorationRate: 1.0,
  });

  const [isTraining, setIsTraining] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    if (!isTraining) return;

    const trainingInterval = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        episode: prev.episode + 1,
        explorationRate: Math.max(0.1, prev.explorationRate * 0.95),
        currentRecipe: selectRecipe(prev.explorationRate),
      }));
    }, 2000);

    return () => clearInterval(trainingInterval);
  }, [isTraining]);

  const selectRecipe = (explorationRate: number): Recipe => {
    if (Math.random() < explorationRate) {
      // Explore: random recipe
      return INITIAL_RECIPES[Math.floor(Math.random() * INITIAL_RECIPES.length)];
    } else {
      // Exploit: best known recipe
      return INITIAL_RECIPES.reduce((a, b) => (a.rewards > b.rewards ? a : b));
    }
  };

  const handleAttemptRecipe = (success: boolean) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + (success ? (prev.currentRecipe?.rewards || 0) : -5),
      memory: [...prev.memory, prev.currentRecipe!].slice(-5),
    }));
    setFeedback(success ? "Great choice!" : "Keep learning!");
  };

  return (
    <div className="flex flex-col p-6 bg-gray-50 rounded-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Chef className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">DQN Kitchen Trainer</h1>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-gray-600" />
          <span>Episode: {gameState.episode}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5" />
            <span>Current Kitchen State</span>
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-blue-500" />
              <span>Recipe: {gameState.currentRecipe?.name || "Selecting..."}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-500" />
              <span>Exploration Rate: {(gameState.explorationRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="flex items-center gap-2 mb-4">
            <Book className="w-5 h-5" />
            <span>Experience Memory</span>
          </h2>
          <div className="space-y-2">
            {gameState.memory.map((recipe, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <ArrowRight className="w-4 h-4" />
                <span>{recipe.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setIsTraining(!isTraining)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label={isTraining ? "Pause Training" : "Start Training"}
        >
          <Timer className="w-5 h-5 inline mr-2" />
          {isTraining ? "Pause Training" : "Start Training"}
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleAttemptRecipe(true)}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
            aria-label="Success"
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleAttemptRecipe(false)}
            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
            aria-label="Failure"
          >
            <ThumbsDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="mt-4 text-center text-gray-700">{feedback}</div>
      )}
    </div>
  );
}