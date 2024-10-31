"use client"
import { useState, useEffect } from "react";
import { ShieldCheck, Wind, Zap, Bot, CloudRain, Sun, Cloud, Info, Shield, Target, AlertTriangle } from "lucide-react";

interface WeatherCondition {
    icon: JSX.Element;
    name: string;
    challenge: string;
}

interface RobotState {
    accuracy: number;
    isStable: boolean;
    currentCondition: number;
    stabilizeAttempts: number;
}

const RobustnessDemo = () => {
    const [robotState, setRobotState] = useState<RobotState>({
        accuracy: 95,
        isStable: true,
        currentCondition: 0,
        stabilizeAttempts: 0
    });

    const [showTooltip, setShowTooltip] = useState<string>("");

    const weatherConditions: WeatherCondition[] = [
        { 
            icon: <Sun className="w-16 h-16 text-yellow-400" />, 
            name: "Sunny", 
            challenge: "Dealing with bright glare and high contrast conditions"
        },
        { 
            icon: <CloudRain className="w-16 h-16 text-blue-400" />, 
            name: "Rainy",
            challenge: "Maintaining visibility through water droplets"
        },
        { 
            icon: <Wind className="w-16 h-16 text-gray-400" />, 
            name: "Windy",
            challenge: "Stabilizing predictions during object movement"
        },
        { 
            icon: <Cloud className="w-16 h-16 text-gray-300" />, 
            name: "Foggy",
            challenge: "Processing unclear and obscured inputs"
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setRobotState(prev => ({
                ...prev,
                currentCondition: (prev.currentCondition + 1) % weatherConditions.length,
                accuracy: Math.max(85, prev.accuracy - Math.random() * 3),
                isStable: prev.accuracy > 90
            }));
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    const handleStabilize = () => {
        setRobotState(prev => ({
            ...prev,
            accuracy: 95,
            isStable: true,
            stabilizeAttempts: prev.stabilizeAttempts + 1
        }));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
            <div className="text-4xl font-bold mb-8 text-blue-600 flex items-center gap-3">
                <ShieldCheck className="w-12 h-12" />
                <span>AI Robustness Laboratory</span>
                <div className="relative">
                    <Info 
                        className="w-6 h-6 cursor-help text-blue-400 hover:text-blue-600 transition-colors duration-300"
                        onMouseEnter={() => setShowTooltip("info")}
                        onMouseLeave={() => setShowTooltip("")}
                    />
                    {showTooltip === "info" && (
                        <div className="absolute z-10 w-64 p-4 bg-white rounded-xl shadow-xl text-sm text-gray-600 -right-2 top-8">
                            Robustness is an AI's ability to maintain reliable performance across varying conditions and challenges.
                        </div>
                    )}
                </div>
            </div>

            <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl border border-blue-100">
                <div className={`transition-all duration-500 transform ${robotState.isStable ? 'translate-y-0' : 'translate-y-1'}`}>
                    <div className="flex items-center justify-center mb-8 relative">
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-20 rounded-full ${robotState.isStable ? 'animate-pulse' : ''}`} />
                        <Bot className={`w-32 h-32 ${robotState.isStable ? 'text-blue-500' : 'text-orange-500'} transition-colors duration-300`} />
                    </div>

                    <div className="grid grid-cols-4 gap-8 mb-12">
                        {weatherConditions.map((condition, index) => (
                            <div
                                key={index}
                                className={`relative flex flex-col items-center transition-all duration-500 ${
                                    index === robotState.currentCondition ? 'scale-110' : 'scale-90 opacity-50'
                                }`}
                                onMouseEnter={() => setShowTooltip(`weather-${index}`)}
                                onMouseLeave={() => setShowTooltip("")}
                            >
                                {condition.icon}
                                <span className="mt-2 font-medium">{condition.name}</span>
                                {showTooltip === `weather-${index}` && (
                                    <div className="absolute z-10 w-48 p-3 bg-white rounded-lg shadow-lg text-sm text-gray-600 -bottom-24">
                                        {condition.challenge}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-500" />
                                <span className="font-semibold">Prediction Accuracy</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`font-bold ${robotState.accuracy < 90 ? 'text-orange-500' : 'text-green-500'}`}>
                                    {robotState.accuracy.toFixed(1)}%
                                </span>
                                {!robotState.isStable && (
                                    <AlertTriangle className="w-5 h-5 text-orange-500 animate-pulse" />
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-100 h-6 rounded-full overflow-hidden shadow-inner">
                            <div
                                className={`h-full transition-all duration-300 rounded-full ${
                                    robotState.accuracy < 90 ? 'bg-orange-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${robotState.accuracy}%` }}
                            />
                        </div>

                        <button
                            onClick={handleStabilize}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-white font-semibold text-lg
                                ${robotState.accuracy < 90
                                    ? 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-300 cursor-not-allowed'
                                } transition-all duration-300`}
                            disabled={robotState.accuracy >= 90}
                        >
                            <Shield className="w-6 h-6" />
                            Stabilize Model
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-gray-600 text-center max-w-xl space-y-2">
                <p className="text-lg">
                    Our AI weather predictor faces different environmental challenges.
                    Monitor its performance and stabilize when accuracy drops below 90%.
                </p>
                <p className="text-sm text-gray-500">
                    Stabilization attempts: {robotState.stabilizeAttempts}
                </p>
            </div>
        </div>
    );
};

export default RobustnessDemo;