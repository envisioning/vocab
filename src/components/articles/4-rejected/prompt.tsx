"use client"
import { useState, useEffect } from "react";
import { ChefHat, UtensilsCrossed, Sandwich, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface DishScenario {
    id: number;
    targetDish: string;
    ingredients: string[];
    requiredKeywords: string[];
}

interface FeedbackState {
    status: 'idle' | 'vague' | 'complex' | 'perfect';
    message: string;
}

const SCENARIOS: DishScenario[] = [
    {
        id: 1,
        targetDish: "Grilled Chicken Sandwich",
        ingredients: ["bread", "chicken", "lettuce", "tomato", "mayo"],
        requiredKeywords: ["grilled", "chicken", "sandwich"]
    }
];

export default function PromptChef() {
    const [currentScenario, setCurrentScenario] = useState<DishScenario>(SCENARIOS[0]);
    const [prompt, setPrompt] = useState<string>("");
    const [feedback, setFeedback] = useState<FeedbackState>({
        status: 'idle',
        message: "I'm ready to cook! What would you like?"
    });
    const [ingredients, setIngredients] = useState<string[]>([]);

    useEffect(() => {
        setIngredients(currentScenario.ingredients);
        return () => {
            setIngredients([]);
        };
    }, [currentScenario]);

    const analyzePrompt = (input: string) => {
        const words = input.toLowerCase().split(" ");
        const requiredCount = currentScenario.requiredKeywords.filter(keyword => 
            words.includes(keyword)).length;

        if (words.length < 3) {
            return {
                status: 'vague',
                message: "Could you be more specific? I'm not sure what to make."
            };
        } else if (words.length > 15) {
            return {
                status: 'complex',
                message: "Whoa! That's too many instructions. Keep it simple!"
            };
        } else if (requiredCount === currentScenario.requiredKeywords.length) {
            return {
                status: 'perfect',
                message: "Perfect instructions! I'll make exactly what you want."
            };
        } else {
            return {
                status: 'vague',
                message: "I need more specific ingredients and cooking method."
            };
        }
    };

    const handlePromptSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = analyzePrompt(prompt);
        setFeedback({ ...result, status: result.status as FeedbackState });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-6">
                <ChefHat className="w-8 h-8 text-blue-500" />
                <h1 className="text-2xl font-bold">The Prompt Chef</h1>
            </div>

            <div className="mb-6 p-4 bg-white rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Target Dish:</h2>
                <div className="flex items-center gap-2">
                    <Sandwich className="w-6 h-6 text-gray-600" />
                    <span>{currentScenario.targetDish}</span>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Available Ingredients:</h3>
                <div className="flex flex-wrap gap-2">
                    {ingredients.map((ingredient, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                            {ingredient}
                        </span>
                    ))}
                </div>
            </div>

            <form onSubmit={handlePromptSubmit} className="mb-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="prompt" className="font-medium">
                        Write your cooking instructions:
                    </label>
                    <input
                        type="text"
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="How should I prepare the dish?"
                        aria-label="Cooking instructions input"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Send Instructions
                    </button>
                </div>
            </form>

            <div className={`p-4 rounded-lg ${
                feedback.status === 'perfect' ? 'bg-green-100' :
                feedback.status === 'vague' ? 'bg-gray-100' :
                feedback.status === 'complex' ? 'bg-gray-100' : 'bg-blue-100'
            }`}>
                <div className="flex items-center gap-2">
                    {feedback.status === 'perfect' && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {feedback.status === 'vague' && <AlertCircle className="w-6 h-6 text-gray-500" />}
                    {feedback.status === 'complex' && <XCircle className="w-6 h-6 text-gray-500" />}
                    <p className="font-medium">{feedback.message}</p>
                </div>
            </div>
        </div>
    );
}