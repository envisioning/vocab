"use client"
import { useState, useEffect } from "react";
import { Pizza, DollarSign, ThumbsUp, RotateCcw, Trophy } from "lucide-react";

interface Ingredient {
    name: string;
    cost: number;
    satisfaction: number;
}

interface PizzaSlice {
    id: number;
    ingredient?: Ingredient;
}

const INGREDIENTS: Ingredient[] = [
    { name: "Cheese", cost: 2, satisfaction: 3 },
    { name: "Pepperoni", cost: 3, satisfaction: 4 },
    { name: "Mushrooms", cost: 1, satisfaction: 2 },
    { name: "Olives", cost: 1, satisfaction: 2 },
    { name: "Bacon", cost: 4, satisfaction: 5 }
];

const BUDGET = 20;
const OPTIMAL_SCORE = 35;

export default function OptimizationProblem() {
    const [slices, setSlices] = useState<PizzaSlice[]>(
        Array.from({ length: 8 }, (_, i) => ({ id: i }))
    );
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [budget, setBudget] = useState<number>(BUDGET);
    const [satisfaction, setSatisfaction] = useState<number>(0);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        calculateScore();
        return () => {
            setMessage("");
        };
    }, [slices]);

    const calculateScore = () => {
        const totalSatisfaction = slices.reduce((acc, slice) => 
            acc + (slice.ingredient?.satisfaction || 0), 0);
        setSatisfaction(totalSatisfaction);

        if (totalSatisfaction >= OPTIMAL_SCORE) {
            setMessage("Excellent! You've found an optimal solution!");
        }
    };

    const handleIngredientSelect = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient);
    };

    const handleSliceClick = (sliceId: number) => {
        if (!selectedIngredient) return;
        
        const newCost = budget - selectedIngredient.cost;
        if (newCost < 0) {
            setMessage("Not enough budget!");
            return;
        }

        setSlices(prev => prev.map(slice => 
            slice.id === sliceId ? { ...slice, ingredient: selectedIngredient } : slice
        ));
        setBudget(newCost);
        setSelectedIngredient(null);
    };

    const handleReset = () => {
        setSlices(Array.from({ length: 8 }, (_, i) => ({ id: i })));
        setBudget(BUDGET);
        setSatisfaction(0);
        setMessage("");
        setSelectedIngredient(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Pizza Optimization Challenge</h1>
            
            <div className="flex gap-6">
                <div className="w-1/2">
                    <div className="relative w-80 h-80 rounded-full bg-yellow-100 border-4 border-yellow-300">
                        {slices.map((slice, index) => (
                            <button
                                key={slice.id}
                                onClick={() => handleSliceClick(slice.id)}
                                className={`absolute w-20 h-20 transform ${
                                    `rotate-${index * 45} translate-x-32`
                                } hover:bg-blue-200 transition-colors duration-300`}
                                style={{
                                    backgroundColor: slice.ingredient ? '#22C55E' : 'transparent'
                                }}
                                aria-label={`Pizza slice ${index + 1}`}
                            >
                                {slice.ingredient?.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-1/2 space-y-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="text-green-500" />
                        <span>Budget: ${budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThumbsUp className="text-blue-500" />
                        <span>Satisfaction: {satisfaction}/{OPTIMAL_SCORE}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {INGREDIENTS.map(ingredient => (
                            <button
                                key={ingredient.name}
                                onClick={() => handleIngredientSelect(ingredient)}
                                className={`p-2 rounded ${
                                    selectedIngredient?.name === ingredient.name
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                {ingredient.name} (${ingredient.cost})
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>

                    {message && (
                        <div className="p-4 bg-blue-100 text-blue-800 rounded">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}