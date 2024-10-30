"use client"
import { useState, useEffect } from "react";
import { Bot, Brain, ChefHat, Award, BarChart2, Play, Pause, RotateCcw } from "lucide-react";

interface ScenarioType {
    id: number;
    name: string;
    initialScore: number;
    aiTips: string[];
}

const SCENARIOS: ScenarioType[] = [
    {
        id: 1,
        name: "Cooking Challenge",
        initialScore: 0,
        aiTips: ["Adjust heat level", "Better ingredient mix", "Timing improved"]
    },
    {
        id: 2,
        name: "Dance Routine",
        initialScore: 0,
        aiTips: ["Smoother transitions", "Better rhythm", "More fluid movements"]
    }
];

/**
 * RLAIF Laboratory - Interactive learning component for understanding
 * Reinforcement Learning with AI Feedback
 */
export default function RLAIFLab() {
    const [activeScenario, setActiveScenario] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [aiProgress, setAiProgress] = useState<number>(0);
    const [currentTip, setCurrentTip] = useState<string>("");

    useEffect(() => {
        if (!isRunning) return;

        const simulationInterval = setInterval(() => {
            setScore(prev => Math.min(prev + Math.random() * 10, 100));
            setAiProgress(prev => Math.min(prev + 5, 100));
            
            const scenario = SCENARIOS[activeScenario];
            const tipIndex = Math.floor(Math.random() * scenario.aiTips.length);
            setCurrentTip(scenario.aiTips[tipIndex]);
        }, 1000);

        return () => clearInterval(simulationInterval);
    }, [isRunning, activeScenario]);

    const handleReset = () => {
        setScore(0);
        setAiProgress(0);
        setCurrentTip("");
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col gap-4 p-6 bg-gray-100 rounded-lg max-w-4xl mx-auto">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bot className="text-blue-500" />
                    RLAIF Laboratory
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                        aria-label={isRunning ? "Pause simulation" : "Start simulation"}
                    >
                        {isRunning ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300"
                        aria-label="Reset simulation"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-4">
                        <ChefHat className="text-blue-500" />
                        <h2 className="font-semibold">Training Arena</h2>
                    </div>
                    <div className="h-4 bg-gray-200 rounded">
                        <div 
                            className="h-full bg-green-500 rounded transition-all duration-300"
                            style={{ width: `${score}%` }}
                            role="progressbar"
                            aria-valuenow={score}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Current Score: {score.toFixed(1)}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-4">
                        <Brain className="text-blue-500" />
                        <h2 className="font-semibold">AI Advisor</h2>
                    </div>
                    <div className="h-4 bg-gray-200 rounded">
                        <div 
                            className="h-full bg-blue-500 rounded transition-all duration-300"
                            style={{ width: `${aiProgress}%` }}
                            role="progressbar"
                            aria-valuenow={aiProgress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{currentTip}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart2 className="text-blue-500" />
                        <h2 className="font-semibold">Performance Analytics</h2>
                    </div>
                    <div className="flex items-center justify-center h-24">
                        <Award 
                            className={`transition-all duration-500 ${score > 80 ? 'text-green-500' : 'text-gray-300'}`}
                            size={48}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}