"use client"
import { useState, useEffect } from "react";
import { Circle, ArrowRight, Coffee, Pizza, Sandwich, Salad, ChefHat, Brain } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  position: { x: number; y: number };
  popularity: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

interface ComponentProps {}

const INITIAL_RECIPES: Recipe[] = [
  { id: "1", name: "Pizza", ingredients: ["cheese", "tomato", "flour"], position: { x: 100, y: 100 }, popularity: 0.8 },
  { id: "2", name: "Pasta", ingredients: ["flour", "egg", "tomato"], position: { x: 200, y: 150 }, popularity: 0.7 },
  { id: "3", name: "Salad", ingredients: ["tomato", "lettuce", "cucumber"], position: { x: 150, y: 250 }, popularity: 0.5 },
];

const RecipeGraphLearning: React.FC<ComponentProps> = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [predictedConnection, setPredictedConnection] = useState<Edge | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecipes(prev => prev.map(recipe => ({
        ...recipe,
        popularity: Math.min(1, recipe.popularity + Math.random() * 0.1)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDrag = (e: React.MouseEvent<SVGCircleElement>, id: string) => {
    if (draggingId === id) {
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id 
          ? { ...recipe, position: { x: e.clientX, y: e.clientY } }
          : recipe
      ));
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    predictNewConnections();
  };

  const predictNewConnections = () => {
    const recipes = INITIAL_RECIPES;
    const randomSource = recipes[Math.floor(Math.random() * recipes.length)];
    const randomTarget = recipes[Math.floor(Math.random() * recipes.length)];
    
    if (randomSource.id !== randomTarget.id) {
      setPredictedConnection({
        source: randomSource.id,
        target: randomTarget.id,
        weight: Math.random()
      });
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <Brain className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-semibold">Recipe Graph Learning</h2>
      </div>

      <svg className="w-full h-full">
        {recipes.map((recipe, idx) => (
          <g key={recipe.id}>
            <circle
              cx={recipe.position.x}
              cy={recipe.position.y}
              r={30 + recipe.popularity * 20}
              className={`fill-blue-${Math.floor(recipe.popularity * 500)} cursor-grab transition-all duration-300`}
              onMouseDown={() => handleDragStart(recipe.id)}
              onMouseMove={(e) => handleDrag(e, recipe.id)}
              onMouseUp={handleDragEnd}
              role="button"
              aria-label={`Recipe node: ${recipe.name}`}
            />
            <text
              x={recipe.position.x}
              y={recipe.position.y}
              className="text-sm fill-white text-center"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {recipe.name}
            </text>
          </g>
        ))}
        
        {predictedConnection && (
          <line
            x1={recipes.find(r => r.id === predictedConnection.source)?.position.x || 0}
            y1={recipes.find(r => r.id === predictedConnection.source)?.position.y || 0}
            x2={recipes.find(r => r.id === predictedConnection.target)?.position.x || 0}
            y2={recipes.find(r => r.id === predictedConnection.target)?.position.y || 0}
            className="stroke-green-500 stroke-2 opacity-50"
          />
        )}
      </svg>

      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">
          Drag recipes closer to discover new combinations!
        </p>
      </div>
    </div>
  );
};

export default RecipeGraphLearning;