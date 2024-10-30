"use client"
import { useState, useEffect } from "react";
import { ChefHat, Plus, Minus, X, Divide, Square, ChevronsUp, Trash2, RefreshCw } from "lucide-react";

interface MathIngredient {
  id: string;
  type: 'operator' | 'variable' | 'constant';
  value: string;
  symbol: JSX.Element;
}

interface DataPoint {
  x: number;
  y: number;
}

const INGREDIENTS: MathIngredient[] = [
  { id: 'add', type: 'operator', value: '+', symbol: <Plus size={24} /> },
  { id: 'subtract', type: 'operator', value: '-', symbol: <Minus size={24} /> },
  { id: 'multiply', type: 'operator', value: '*', symbol: <X size={24} /> },
  { id: 'divide', type: 'operator', value: '/', symbol: <Divide size={24} /> },
  { id: 'square', type: 'operator', value: '^2', symbol: <Square size={24} /> },
  { id: 'x', type: 'variable', value: 'x', symbol: <span className="text-lg">x</span> },
  { id: 'constant', type: 'constant', value: '1', symbol: <span className="text-lg">1</span> },
];

export default function SymbolicRegressionLab() {
  const [recipe, setRecipe] = useState<MathIngredient[]>([]);
  const [targetData, setTargetData] = useState<DataPoint[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const generateTargetData = () => {
      const data: DataPoint[] = [];
      for (let x = -5; x <= 5; x += 0.5) {
        data.push({
          x,
          y: Math.pow(x, 2) + 2 * x + 1
        });
      }
      setTargetData(data);
    };

    generateTargetData();

    return () => {
      setTargetData([]);
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, ingredient: MathIngredient) => {
    e.dataTransfer.setData('ingredient', JSON.stringify(ingredient));
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const ingredient = JSON.parse(e.dataTransfer.getData('ingredient')) as MathIngredient;
    setRecipe(prev => [...prev, ingredient]);
    calculateScore();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const calculateScore = () => {
    // Simplified score calculation
    const maxScore = 100;
    const currentScore = Math.max(0, maxScore - recipe.length * 10);
    setScore(currentScore);
  };

  const resetRecipe = () => {
    setRecipe([]);
    setScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ChefHat className="text-blue-500" size={32} />
          <h1 className="text-2xl font-bold">Recipe Detective Lab</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">Score: {score}</span>
          <button
            onClick={resetRecipe}
            className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
            aria-label="Reset recipe"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-8">
        <section
          className="min-h-[300px] bg-white p-4 rounded-lg border-2 border-dashed border-gray-300"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          aria-label="Recipe construction area"
        >
          <h2 className="text-lg font-semibold mb-4">Your Recipe</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="p-2 bg-blue-100 rounded-lg flex items-center"
              >
                {item.symbol}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Ingredients</h2>
          <div className="flex flex-wrap gap-3">
            {INGREDIENTS.map(ingredient => (
              <div
                key={ingredient.id}
                draggable
                onDragStart={(e) => handleDragStart(e, ingredient)}
                onDragEnd={handleDragEnd}
                className="p-3 bg-gray-100 rounded-lg cursor-move hover:bg-gray-200 transition duration-300"
                aria-label={`Drag ${ingredient.value}`}
              >
                {ingredient.symbol}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}