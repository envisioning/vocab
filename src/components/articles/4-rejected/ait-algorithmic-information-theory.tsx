"use client"
import { useState, useEffect } from "react";
import { RefreshCw, Check, X, HelpCircle, ChevronRight } from "lucide-react";

interface Pattern {
    grid: string[];
    description: string;
    complexity: number;
}

const PATTERNS: Pattern[] = [
    {
        grid: ['R', 'B', 'R', 'B', 'R', 'B', 'R', 'B', 'R'],
        description: "RB repeated",
        complexity: 1
    },
    {
        grid: ['R', 'R', 'B', 'B', 'R', 'R', 'B', 'B', 'R'],
        description: "RRB repeated",
        complexity: 2
    },
    {
        grid: ['R', 'B', 'G', 'R', 'B', 'G', 'R', 'B', 'G'],
        description: "RGB repeated",
        complexity: 3
    }
];

const ColorMap: Record<string, string> = {
    'R': 'bg-red-500',
    'B': 'bg-blue-500',
    'G': 'bg-green-500'
};

export default function AITVisualizer() {
    const [currentPattern, setCurrentPattern] = useState<number>(0);
    const [userInput, setUserInput] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    useEffect(() => {
        const timer = setInterval(() => {
            if (isAnimating) {
                setCurrentPattern((prev) => (prev + 1) % PATTERNS.length);
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [isAnimating]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pattern = PATTERNS[currentPattern];
        const userScore = calculateScore(userInput, pattern.description);
        setScore(userScore);
        setFeedback(userScore > 70 ? "Great pattern recognition!" : "Try to be more concise");
    };

    const calculateScore = (input: string, target: string): number => {
        const lengthDiff = Math.abs(input.length - target.length);
        return Math.max(0, 100 - lengthDiff * 5);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="grid grid-cols-3 gap-2 mb-6" role="grid" aria-label="Pattern Grid">
                {PATTERNS[currentPattern].grid.map((color, idx) => (
                    <div
                        key={idx}
                        className={`${ColorMap[color]} w-20 h-20 rounded-lg transition-colors duration-300`}
                        role="gridcell"
                        aria-label={`Cell ${idx + 1}: ${color}`}
                    />
                ))}
            </div>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    aria-label={isAnimating ? "Pause Animation" : "Start Animation"}
                >
                    <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
                    {isAnimating ? 'Pause' : 'Animate'}
                </button>
                
                <button
                    onClick={() => setCurrentPattern((prev) => (prev + 1) % PATTERNS.length)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                    <ChevronRight className="w-5 h-5" />
                    Next Pattern
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Describe the pattern concisely..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        aria-label="Pattern Description Input"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                        <Check className="w-5 h-5" />
                    </button>
                </div>
            </form>

            {feedback && (
                <div className="mt-4 p-4 bg-blue-100 rounded-lg flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-500" />
                    <span>Score: {score}% - {feedback}</span>
                </div>
            )}
        </div>
    );
}