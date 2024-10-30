"use client"
import { useState, useEffect } from "react";
import { Brain, Zap, Clock, BrainCircuit, PlugZap } from "lucide-react";

interface Scenario {
    id: number;
    text: string;
    correctSystem: 1 | 2;
    timeLimit: number;
    energyCost: number;
}

interface GameState {
    score: number;
    currentScenario: number;
    timeRemaining: number;
    energy: number;
    isPlaying: boolean;
}

const SCENARIOS: Scenario[] = [
    { id: 1, text: "2 + 2 = ?", correctSystem: 1, timeLimit: 3, energyCost: 10 },
    { id: 2, text: "Calculate 17 x 24", correctSystem: 2, timeLimit: 15, energyCost: 50 },
    { id: 3, text: "Catch a falling pen", correctSystem: 1, timeLimit: 2, energyCost: 5 },
    { id: 4, text: "Plan next week's study schedule", correctSystem: 2, timeLimit: 20, energyCost: 70 },
    { id: 5, text: "Recognize your best friend's face", correctSystem: 1, timeLimit: 1, energyCost: 5 }
];

export default function BrainModesGame() {
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        currentScenario: 0,
        timeRemaining: SCENARIOS[0].timeLimit,
        energy: 100,
        isPlaying: false
    });
    const [selectedSystem, setSelectedSystem] = useState<1 | 2 | null>(null);
    const [feedback, setFeedback] = useState<string>("");

    useEffect(() => {
        if (!gameState.isPlaying) return;

        const timer = setInterval(() => {
            setGameState(prev => ({
                ...prev,
                timeRemaining: Math.max(0, prev.timeRemaining - 1)
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState.isPlaying]);

    useEffect(() => {
        if (gameState.timeRemaining === 0 && gameState.isPlaying) {
            handleTimeUp();
        }
    }, [gameState.timeRemaining]);

    const handleSystemSelect = (system: 1 | 2) => {
        if (!gameState.isPlaying) return;

        const currentScenario = SCENARIOS[gameState.currentScenario];
        const isCorrect = system === currentScenario.correctSystem;
        const energySpent = currentScenario.energyCost;

        setSelectedSystem(system);
        setFeedback(isCorrect ? "Correct! Great choice!" : "Not quite right. Think about it.");

        setGameState(prev => ({
            ...prev,
            score: isCorrect ? prev.score + 10 : prev.score,
            energy: prev.energy - energySpent,
            isPlaying: false
        }));
    };

    const handleTimeUp = () => {
        setFeedback("Time's up!");
        setGameState(prev => ({ ...prev, isPlaying: false }));
    };

    const nextScenario = () => {
        if (gameState.currentScenario >= SCENARIOS.length - 1) {
            setFeedback("Game Complete!");
            return;
        }

        setSelectedSystem(null);
        setFeedback("");
        setGameState(prev => ({
            ...prev,
            currentScenario: prev.currentScenario + 1,
            timeRemaining: SCENARIOS[prev.currentScenario + 1].timeLimit,
            isPlaying: true
        }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Brain className="text-blue-500" />
                    <span className="text-xl font-bold">Brain Modes</span>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                        <Zap className="text-yellow-500" />
                        <span>{gameState.energy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="text-blue-500" />
                        <span>{gameState.timeRemaining}s</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg mb-6">
                <p className="text-xl text-center mb-4">{SCENARIOS[gameState.currentScenario].text}</p>
                
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => handleSystemSelect(1)}
                        disabled={!gameState.isPlaying}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                            selectedSystem === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        } transition-colors duration-300`}
                        aria-label="Select System 1 - Quick Mode">
                        <PlugZap />
                        Quick Mode
                    </button>
                    
                    <button
                        onClick={() => handleSystemSelect(2)}
                        disabled={!gameState.isPlaying}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                            selectedSystem === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        } transition-colors duration-300`}
                        aria-label="Select System 2 - Deep Mode">
                        <BrainCircuit />
                        Deep Mode
                    </button>
                </div>

                {feedback && (
                    <div className="mt-4 text-center">
                        <p className="text-lg">{feedback}</p>
                        {!gameState.isPlaying && (
                            <button
                                onClick={nextScenario}
                                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300">
                                Next Scenario
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}