"use client"
import { useState, useEffect } from "react";
import { ChefHat, Code, PlayCircle, AlertCircle, CheckCircle, Coffee, Timer, GripHorizontal } from "lucide-react";

interface Ingredient {
    id: string;
    name: string;
    type: 'function' | 'variable' | 'operator';
}

interface Recipe {
    ingredients: Ingredient[];
    status: 'cooking' | 'ready' | 'failed';
    result?: string;
}

const INGREDIENTS: Ingredient[] = [
    { id: 'map', name: 'map()', type: 'function' },
    { id: 'filter', name: 'filter()', type: 'function' },
    { id: 'reduce', name: 'reduce()', type: 'function' },
    { id: 'array', name: 'numbers[]', type: 'variable' },
    { id: 'plus', name: '+', type: 'operator' },
];

/**
 * CodeKitchen: An interactive component teaching program synthesis
 * through a cooking metaphor.
 */
export default function CodeKitchen() {
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [currentRecipe, setCurrentRecipe] = useState<Recipe>({ ingredients: [], status: 'cooking' });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [synthesisStep, setSynthesisStep] = useState<number>(0);

    useEffect(() => {
        const synthesisInterval = setInterval(() => {
            if (selectedIngredients.length > 0 && synthesisStep < selectedIngredients.length) {
                setSynthesisStep(prev => prev + 1);
            }
        }, 1000);

        return () => clearInterval(synthesisInterval);
    }, [selectedIngredients, synthesisStep]);

    const handleDragStart = (e: React.DragEvent, ingredient: Ingredient) => {
        e.dataTransfer.setData('ingredient', JSON.stringify(ingredient));
        setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const ingredient = JSON.parse(e.dataTransfer.getData('ingredient'));
        setSelectedIngredients(prev => [...prev, ingredient]);
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const synthesizeCode = () => {
        const newRecipe: Recipe = {
            ingredients: selectedIngredients,
            status: 'cooking'
        };
        
        try {
            const code = selectedIngredients
                .map(i => i.name)
                .join(' ');
            newRecipe.result = code;
            newRecipe.status = 'ready';
        } catch {
            newRecipe.status = 'failed';
        }
        
        setCurrentRecipe(newRecipe);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="text-blue-500" />
                <h1 className="text-2xl font-bold">The Code Kitchen</h1>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div 
                    className="bg-gray-100 p-4 rounded-lg"
                    role="region"
                    aria-label="Ingredient shelf"
                >
                    <h2 className="flex items-center mb-4">
                        <Coffee className="mr-2" />
                        Available Ingredients
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {INGREDIENTS.map(ingredient => (
                            <div
                                key={ingredient.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, ingredient)}
                                className="p-2 bg-white rounded shadow cursor-move flex items-center"
                                role="button"
                                tabIndex={0}
                            >
                                <GripHorizontal className="w-4 h-4 mr-2" />
                                {ingredient.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div 
                    className="bg-gray-100 p-4 rounded-lg"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    role="region"
                    aria-label="Cooking station"
                >
                    <h2 className="flex items-center mb-4">
                        <Timer className="mr-2" />
                        Synthesis in Progress
                    </h2>
                    <div className="min-h-[100px] bg-white rounded p-4">
                        {selectedIngredients.slice(0, synthesisStep).map((ingredient, idx) => (
                            <span key={idx} className="inline-block mx-1 animate-fade-in">
                                {ingredient.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center space-x-4">
                <button
                    onClick={synthesizeCode}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    disabled={selectedIngredients.length === 0}
                >
                    <PlayCircle className="mr-2" />
                    Synthesize Program
                </button>
            </div>

            {currentRecipe.status !== 'cooking' && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center mb-2">
                        <Code className="mr-2" />
                        <h3>Synthesized Code</h3>
                    </div>
                    <div className={`p-4 rounded ${
                        currentRecipe.status === 'ready' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                        {currentRecipe.status === 'ready' ? (
                            <CheckCircle className="inline mr-2 text-green-500" />
                        ) : (
                            <AlertCircle className="inline mr-2 text-red-500" />
                        )}
                        <code>{currentRecipe.result || 'Synthesis failed'}</code>
                    </div>
                </div>
            )}
        </div>
    );
}