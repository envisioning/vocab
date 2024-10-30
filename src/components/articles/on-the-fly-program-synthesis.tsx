"use client"
import { useState, useEffect } from "react";
import { ChefHat, Code, Utensils, Timer, Heart, Leaf, Zap, X } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  position: { x: number; y: number };
}

interface Recipe {
  ingredients: string[];
  steps: string[];
  code: string;
}

interface Requirement {
  id: string;
  label: string;
  icon: JSX.Element;
  active: boolean;
}

const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: "1", name: "Tomato", category: "vegetable", position: { x: 50, y: 50 } },
  { id: "2", name: "Pasta", category: "grain", position: { x: 150, y: 50 } },
  { id: "3", name: "Chicken", category: "protein", position: { x: 250, y: 50 } },
];

const RecipeSynthesizer = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: "healthy", label: "Healthy", icon: <Heart />, active: false },
    { id: "vegetarian", label: "Vegetarian", icon: <Leaf />, active: false },
    { id: "quick", label: "Quick", icon: <Timer />, active: false },
  ]);

  useEffect(() => {
    if (requirements.some(r => r.active)) {
      synthesizeRecipe();
    }
    return () => {
      setRecipe(null);
    };
  }, [requirements]);

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDrag = (e: React.DragEvent, id: string) => {
    if (draggingId === id) {
      setIngredients(prev => prev.map(ing => 
        ing.id === id ? {
          ...ing,
          position: {
            x: e.clientX - 25,
            y: e.clientY - 25
          }
        } : ing
      ));
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const toggleRequirement = (id: string) => {
    setRequirements(prev => prev.map(req =>
      req.id === id ? { ...req, active: !req.active } : req
    ));
  };

  const synthesizeRecipe = () => {
    const activeReqs = requirements.filter(r => r.active).map(r => r.id);
    const newRecipe: Recipe = {
      ingredients: [],
      steps: [],
      code: `function synthesizeRecipe(requirements) {\n  // Generated code based on ${activeReqs.join(", ")}\n}`
    };

    if (activeReqs.includes("vegetarian")) {
      newRecipe.ingredients = ingredients.filter(i => i.category !== "protein").map(i => i.name);
    } else {
      newRecipe.ingredients = ingredients.map(i => i.name);
    }

    setRecipe(newRecipe);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ChefHat className="text-blue-500" />
          Recipe Synthesizer
        </h1>
        <div className="flex gap-2">
          {requirements.map(req => (
            <button
              key={req.id}
              onClick={() => toggleRequirement(req.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300
                ${req.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              aria-pressed={req.active}
            >
              {req.icon}
              {req.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-sm min-h-[400px]">
          {ingredients.map(ing => (
            <div
              key={ing.id}
              draggable
              onDragStart={() => handleDragStart(ing.id)}
              onDrag={(e) => handleDrag(e, ing.id)}
              onDragEnd={handleDragEnd}
              style={{
                transform: `translate(${ing.position.x}px, ${ing.position.y}px)`,
                position: 'absolute'
              }}
              className="cursor-move bg-gray-100 p-2 rounded-md shadow-sm"
            >
              {ing.name}
            </div>
          ))}
        </div>

        <div className="w-1/2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Code className="text-blue-500" />
            <h2 className="text-lg font-semibold">Synthesized Output</h2>
          </div>
          {recipe && (
            <pre className="bg-gray-50 p-4 rounded-md text-sm">
              {recipe.code}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSynthesizer;