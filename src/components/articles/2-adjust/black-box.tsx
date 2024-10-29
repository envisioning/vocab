"use client"
import { useState, useEffect } from "react";
import { Box, ArrowRight, Chef, Brain, Coffee, Pizza, Sandwich, Salad, Happy, Sad, Meh, Sun, Cloud, Rain } from "lucide-react";

interface Scenario {
    input: string;
    output: string;
    icon: JSX.Element;
    resultIcon: JSX.Element;
}

interface BlackBoxProps {
    initialMode?: "restaurant" | "emotion";
}

const RESTAURANT_SCENARIOS: Scenario[] = [
    { input: "Coffee Order", output: "Hot Coffee", icon: <Coffee />, resultIcon: <Coffee /> },
    { input: "Pizza Order", output: "Fresh Pizza", icon: <Pizza />, resultIcon: <Pizza /> },
    { input: "Salad Order", output: "Garden Salad", icon: <Salad />, resultIcon: <Salad /> }
];

const EMOTION_SCENARIOS: Scenario[] = [
    { input: "Sunny Day", output: "Happy", icon: <Sun />, resultIcon: <Happy /> },
    { input: "Cloudy Day", output: "Neutral", icon: <Cloud />, resultIcon: <Meh /> },
    { input: "Rainy Day", output: "Sad", icon: <Rain />, resultIcon: <Sad /> }
];

const BlackBoxSimulator = ({ initialMode = "restaurant" }: BlackBoxProps) => {
    const [mode, setMode] = useState<"restaurant" | "emotion">(initialMode);
    const [currentScenario, setCurrentScenario] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [showOutput, setShowOutput] = useState<boolean>(false);

    const scenarios = mode === "restaurant" ? RESTAURANT_SCENARIOS : EMOTION_SCENARIOS;

    useEffect(() => {
        let processingTimer: NodeJS.Timeout;
        let outputTimer: NodeJS.Timeout;

        if (isProcessing) {
            processingTimer = setTimeout(() => {
                setIsProcessing(false);
                setShowOutput(true);
            }, 1500);

            outputTimer = setTimeout(() => {
                setShowOutput(false);
                setCurrentScenario((prev) => (prev + 1) % scenarios.length);
            }, 3000);
        }

        return () => {
            clearTimeout(processingTimer);
            clearTimeout(outputTimer);
        };
    }, [isProcessing, scenarios.length]);

    const handleProcess = () => {
        setIsProcessing(true);
        setShowOutput(false);
    };

    const toggleMode = () => {
        setMode((prev) => (prev === "restaurant" ? "emotion" : "restaurant"));
        setCurrentScenario(0);
        setIsProcessing(false);
        setShowOutput(false);
    };

    return (
        <div className="flex flex-col items-center p-8 max-w-2xl mx-auto" role="main">
            <div className="flex gap-4 mb-8">
                <button
                    onClick={toggleMode}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white"
                    aria-label={`Switch to ${mode === "restaurant" ? "emotion" : "restaurant"} mode`}
                >
                    {mode === "restaurant" ? <Brain /> : <Chef />}
                    {mode === "restaurant" ? "Emotion Mode" : "Restaurant Mode"}
                </button>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-lg font-bold">Input</div>
                    {scenarios[currentScenario].icon}
                    <div>{scenarios[currentScenario].input}</div>
                </div>

                <div
                    className={`relative p-8 bg-gray-800 rounded-lg transition-all duration-300 ${
                        isProcessing ? "animate-pulse" : ""
                    }`}
                >
                    <Box className="w-12 h-12 text-white" />
                    <ArrowRight className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-blue-500" />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="text-lg font-bold">Output</div>
                    <div className={`transition-opacity duration-300 ${showOutput ? "opacity-100" : "opacity-0"}`}>
                        {scenarios[currentScenario].resultIcon}
                        <div>{scenarios[currentScenario].output}</div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleProcess}
                disabled={isProcessing}
                className={`mt-8 px-6 py-3 rounded bg-blue-500 text-white transition-opacity duration-300 ${
                    isProcessing ? "opacity-50" : "hover:bg-blue-600"
                }`}
                aria-label="Process input through black box"
            >
                Process Input
            </button>
        </div>
    );
};

export default BlackBoxSimulator;