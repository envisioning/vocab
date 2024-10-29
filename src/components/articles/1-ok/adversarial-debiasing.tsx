"use client"
import { useState, useEffect } from "react";
import { Scale, User, Shield, AlertCircle, CheckCircle2, Brain } from "lucide-react";

interface BiasScenario {
    id: number;
    decision: string;
    biasType: string;
    correctResponse: boolean;
}

const SCENARIOS: BiasScenario[] = [
    { id: 1, decision: "Hire candidate with top university degree", biasType: "Educational bias", correctResponse: false },
    { id: 2, decision: "Approve loan based on neighborhood", biasType: "Geographic bias", correctResponse: false },
    { id: 3, decision: "Select candidates based on merit only", biasType: "None", correctResponse: true },
];

/**
 * AdversarialDebiasing - Interactive component teaching bias detection and correction
 */
const AdversarialDebiasing = () => {
    const [score, setScore] = useState<number>(0);
    const [currentScenario, setCurrentScenario] = useState<number>(0);
    const [isTraining, setIsTraining] = useState<boolean>(true);
    const [feedback, setFeedback] = useState<string>("");
    const [biasDetected, setBiasDetected] = useState<boolean>(false);
    const [animation, setAnimation] = useState<string>("");

    useEffect(() => {
        const timer = setInterval(() => {
            setAnimation(prev => prev === "scale-105" ? "" : "scale-105");
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleBiasCheck = (hasBias: boolean) => {
        const scenario = SCENARIOS[currentScenario];
        const isCorrect = (hasBias === !scenario.correctResponse);
        
        setFeedback(isCorrect ? "Correct detection!" : "Try again!");
        setBiasDetected(hasBias);
        setScore(prev => prev + (isCorrect ? 10 : -5));

        setTimeout(() => {
            setCurrentScenario(prev => (prev + 1) % SCENARIOS.length);
            setFeedback("");
            setBiasDetected(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6" role="main">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Adversarial Debiasing Trainer</h1>
                <div className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-500" />
                    <span className="text-lg">Score: {score}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-100 rounded-lg">
                    <h2 className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-blue-500" />
                        <span>Main Model (Decision Maker)</span>
                    </h2>
                    <div className={`p-4 border rounded-lg bg-white ${animation}`}>
                        {SCENARIOS[currentScenario]?.decision}
                    </div>
                </div>

                <div className="p-6 bg-gray-100 rounded-lg">
                    <h2 className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span>Bias Detector</span>
                    </h2>
                    <div className="space-y-4">
                        <button
                            onClick={() => handleBiasCheck(true)}
                            className="w-full p-3 bg-red-100 hover:bg-red-200 rounded-lg transition duration-300"
                            aria-label="Detect bias"
                        >
                            <AlertCircle className="w-5 h-5 inline mr-2" />
                            Bias Detected
                        </button>
                        <button
                            onClick={() => handleBiasCheck(false)}
                            className="w-full p-3 bg-green-100 hover:bg-green-200 rounded-lg transition duration-300"
                            aria-label="No bias detected"
                        >
                            <CheckCircle2 className="w-5 h-5 inline mr-2" />
                            No Bias
                        </button>
                    </div>
                </div>
            </div>

            {feedback && (
                <div className={`p-4 rounded-lg text-center ${
                    feedback.includes("Correct") ? "bg-green-100" : "bg-red-100"
                }`}>
                    {feedback}
                </div>
            )}

            <div className="flex justify-center">
                <Scale className={`w-8 h-8 ${biasDetected ? "text-red-500" : "text-green-500"}`} />
            </div>
        </div>
    );
};

export default AdversarialDebiasing;