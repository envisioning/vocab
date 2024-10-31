"use client"
import { useState, useEffect } from "react";
import { Coffee, Timer, Waves, Camera, Brain, ArrowRight, Check, X } from "lucide-react";

interface ScenarioType {
    id: number;
    name: string;
    icon: JSX.Element;
    maxValue: number;
    unit: string;
}

interface ProgressPoint {
    input: number;
    improvement: number;
}

/**
 * SaturationLab: Interactive component demonstrating the Saturation Effect
 * through relatable scenarios for students aged 15-18.
 */
export default function SaturationLab() {
    const [activeScenario, setActiveScenario] = useState<number>(0);
    const [currentInput, setCurrentInput] = useState<number>(0);
    const [progress, setProgress] = useState<ProgressPoint[]>([]);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState<boolean>(false);

    const SCENARIOS: ScenarioType[] = [
        { id: 0, name: "Study Hours", icon: <Coffee className="w-6 h-6" />, maxValue: 12, unit: "hours" },
        { id: 1, name: "Swim Practice", icon: <Waves className="w-6 h-6" />, maxValue: 100, unit: "days" },
        { id: 2, name: "Camera Resolution", icon: <Camera className="w-6 h-6" />, maxValue: 108, unit: "MP" }
    ];

    const calculateImprovement = (input: number): number => {
        return Math.min(100, 100 * (1 - Math.exp(-input / (SCENARIOS[activeScenario].maxValue / 3))));
    };

    useEffect(() => {
        const newProgress: ProgressPoint[] = [];
        for (let i = 0; i <= currentInput; i += SCENARIOS[activeScenario].maxValue / 20) {
            newProgress.push({
                input: i,
                improvement: calculateImprovement(i)
            });
        }
        setProgress(newProgress);

        return () => {
            setProgress([]);
        };
    }, [currentInput, activeScenario]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentInput(Number(e.target.value));
        setShowFeedback(false);
    };

    const handlePrediction = (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowFeedback(true);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-6">
                {SCENARIOS.map((scenario) => (
                    <button
                        key={scenario.id}
                        onClick={() => setActiveScenario(scenario.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-300
                            ${activeScenario === scenario.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        aria-pressed={activeScenario === scenario.id}
                    >
                        {scenario.icon}
                        <span>{scenario.name}</span>
                    </button>
                ))}
            </div>

            <div className="relative h-64 mb-6 bg-white rounded-lg p-4">
                <div className="absolute left-0 bottom-0 w-full h-full">
                    {progress.map((point, index) => (
                        <div
                            key={index}
                            className="absolute bottom-0 w-1 bg-blue-500 transition-all duration-300"
                            style={{
                                height: `${point.improvement}%`,
                                left: `${(point.input / SCENARIOS[activeScenario].maxValue) * 100}%`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <input
                    type="range"
                    min="0"
                    max={SCENARIOS[activeScenario].maxValue}
                    value={currentInput}
                    onChange={handleInputChange}
                    className="w-full"
                    aria-label={`Adjust ${SCENARIOS[activeScenario].name}`}
                />
                <span className="min-w-[100px]">
                    {currentInput} {SCENARIOS[activeScenario].unit}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={handlePrediction}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                             transition-colors duration-300 flex items-center gap-2"
                    aria-label="Check prediction"
                >
                    <Brain className="w-5 h-5" />
                    Predict Saturation Point
                </button>
                
                {showFeedback && (
                    <div className="flex items-center gap-2">
                        {currentInput > SCENARIOS[activeScenario].maxValue * 0.6 && 
                         currentInput < SCENARIOS[activeScenario].maxValue * 0.8 ? (
                            <Check className="text-green-500 w-6 h-6" />
                        ) : (
                            <X className="text-red-500 w-6 h-6" />
                        )}
                        <span>Try to find the optimal stopping point!</span>
                    </div>
                )}
            </div>
        </div>
    );
}