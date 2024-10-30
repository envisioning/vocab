"use client"
import { useState, useEffect } from "react";
import { ChefHat, Utensils, Server, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  version: number;
  performance: number;
  stage: 'testing' | 'staging' | 'production';
  health: 'good' | 'warning' | 'critical';
}

interface ComponentProps {}

interface DragItem {
  recipeId: string;
  sourceStage: string;
}

const INITIAL_RECIPES: Recipe[] = [
  { id: '1', name: 'Image Classifier', version: 1.0, performance: 95, stage: 'testing', health: 'good' },
  { id: '2', name: 'Text Generator', version: 2.1, performance: 82, stage: 'staging', health: 'warning' },
  { id: '3', name: 'Speech Model', version: 1.5, performance: 65, stage: 'production', health: 'critical' },
];

const ModelKitchen = ({}: ComponentProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecipes(prev => prev.map(recipe => ({
        ...recipe,
        performance: recipe.stage === 'production' 
          ? Math.max(recipe.performance - 5, 0) 
          : recipe.performance,
        health: recipe.performance < 70 ? 'critical' : recipe.performance < 85 ? 'warning' : 'good'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (recipeId: string, sourceStage: string) => {
    setDraggedItem({ recipeId, sourceStage });
  };

  const handleDrop = (targetStage: string) => {
    if (!draggedItem) return;

    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === draggedItem.recipeId) {
        const isCorrectMove = 
          (draggedItem.sourceStage === 'testing' && targetStage === 'staging') ||
          (draggedItem.sourceStage === 'staging' && targetStage === 'production');

        if (isCorrectMove) setScore(prev => prev + 10);
        return { ...recipe, stage: targetStage as 'testing' | 'staging' | 'production' };
      }
      return recipe;
    });

    setRecipes(updatedRecipes);
    setDraggedItem(null);
  };

  const getStageIcon = (stage: string) => {
    switch(stage) {
      case 'testing': return <ChefHat className="w-6 h-6" />;
      case 'staging': return <Utensils className="w-6 h-6" />;
      case 'production': return <Server className="w-6 h-6" />;
      default: return null;
    }
  };

  const getHealthIcon = (health: string) => {
    switch(health) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen" role="main">
      <div className="text-xl font-bold mb-4">Model Management Kitchen (Score: {score})</div>
      <div className="grid grid-cols-3 gap-4">
        {['testing', 'staging', 'production'].map((stage) => (
          <div
            key={stage}
            className="bg-white p-4 rounded-lg shadow-md"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage)}
          >
            <div className="flex items-center gap-2 mb-4">
              {getStageIcon(stage)}
              <h2 className="text-lg font-semibold capitalize">{stage}</h2>
            </div>
            <div className="space-y-2">
              {recipes
                .filter(recipe => recipe.stage === stage)
                .map(recipe => (
                  <div
                    key={recipe.id}
                    draggable
                    onDragStart={() => handleDragStart(recipe.id, recipe.stage)}
                    className="p-2 bg-gray-50 rounded border border-gray-200 cursor-move"
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex justify-between items-center">
                      <span>{recipe.name} v{recipe.version}</span>
                      {getHealthIcon(recipe.health)}
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded">
                      <div 
                        className="h-full bg-blue-500 rounded transition-all duration-300"
                        style={{ width: `${recipe.performance}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelKitchen;