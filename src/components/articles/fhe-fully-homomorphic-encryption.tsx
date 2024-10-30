"use client"
import { useState, useEffect } from "react";
import { Lock, Unlock, ChefHat, Sparkles, ArrowRight, RefreshCw } from "lucide-react";

interface ComponentProps {}

type Ingredient = {
  id: number;
  name: string;
  isEncrypted: boolean;
  position: { x: number; y: number };
};

type Operation = {
  id: number;
  name: string;
  result: string;
};

const INGREDIENTS: Ingredient[] = [
  { id: 1, name: "Flour", isEncrypted: false, position: { x: 0, y: 0 } },
  { id: 2, name: "Sugar", isEncrypted: false, position: { x: 0, y: 0 } },
  { id: 3, name: "Butter", isEncrypted: false, position: { x: 0, y: 0 } },
];

const OPERATIONS: Operation[] = [
  { id: 1, name: "Mix", result: "Mixed Dough" },
  { id: 2, name: "Heat", result: "Baked Cookies" },
];

export default function FHELearningLab({}: ComponentProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INGREDIENTS);
  const [activeIngredient, setActiveIngredient] = useState<number | null>(null);
  const [step, setStep] = useState<number>(1);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    const cleanup = () => {
      setActiveIngredient(null);
      setResult("");
    };
    return cleanup;
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    setActiveIngredient(id);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (!activeIngredient) return;

    const updatedIngredients = ingredients.map(ing => 
      ing.id === activeIngredient
        ? {
            ...ing,
            position: {
              x: e.clientX,
              y: e.clientY,
            },
          }
        : ing
    );
    setIngredients(updatedIngredients);
    setActiveIngredient(null);
  };

  const encryptIngredients = () => {
    setIngredients(prev =>
      prev.map(ing => ({ ...ing, isEncrypted: true }))
    );
    setStep(2);
  };

  const performOperation = (operation: Operation) => {
    setResult(operation.result);
    setStep(3);
  };

  const reset = () => {
    setIngredients(INGREDIENTS);
    setStep(1);
    setResult("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Secure Recipe Laboratory
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div 
          className="col-span-2 min-h-[300px] bg-white rounded-lg p-4 border-2 border-gray-200"
          onDragOver={(e) => e.preventDefault()}
        >
          {ingredients.map(ing => (
            <div
              key={ing.id}
              draggable
              onDragStart={(e) => handleDragStart(e, ing.id)}
              onDragEnd={handleDragEnd}
              className={`inline-block m-2 p-3 rounded-lg transition-all duration-300
                ${ing.isEncrypted ? 'bg-blue-100 shadow-md' : 'bg-gray-100'}
                cursor-move`}
              style={{
                transform: `translate(${ing.position.x}px, ${ing.position.y}px)`,
              }}
            >
              {ing.isEncrypted ? <Lock className="inline w-4 h-4 mr-2" /> : null}
              {ing.name}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {step === 1 && (
            <button
              onClick={encryptIngredients}
              className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              <Lock className="inline w-4 h-4 mr-2" />
              Encrypt Ingredients
            </button>
          )}

          {step === 2 && OPERATIONS.map(op => (
            <button
              key={op.id}
              onClick={() => performOperation(op)}
              className="p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              <ChefHat className="inline w-4 h-4 mr-2" />
              {op.name}
            </button>
          ))}

          {step === 3 && (
            <div className="p-4 bg-green-500 text-white rounded-lg">
              <Sparkles className="inline w-4 h-4 mr-2" />
              Result: {result}
            </div>
          )}

          <button
            onClick={reset}
            className="p-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300"
          >
            <RefreshCw className="inline w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}