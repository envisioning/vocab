"use client"
import { useState, useEffect } from "react";
import { Target, Camera, Search, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface Experiment {
    id: number;
    title: string;
    originalData: number[];
    reportedData: number[];
    isPHacked: boolean;
    attempts: number;
}

interface ComponentProps {}

const EXPERIMENTS: Experiment[] = [
    {
        id: 1,
        title: "Archery Study",
        originalData: [2, 3, 4, 2, 5, 3, 4, 2, 1, 3],
        reportedData: [4, 5, 4, 5, 4],
        isPHacked: true,
        attempts: 8
    },
    {
        id: 2,
        title: "Photo Quality",
        originalData: [1, 2, 3, 4, 5, 2, 3, 4, 2, 1],
        reportedData: [4, 5, 4, 5, 5],
        isPHacked: true,
        attempts: 6
    },
    {
        id: 3,
        title: "Control Study",
        originalData: [4, 4, 5, 3, 4, 5, 4, 3, 4, 5],
        reportedData: [4, 4, 5, 3, 4, 5, 4, 3, 4, 5],
        isPHacked: false,
        attempts: 1
    }
];

export default function PHackingDetective({}: ComponentProps) {
    const [currentExp, setCurrentExp] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [showOriginal, setShowOriginal] = useState<boolean>(false);
    const [verdict, setVerdict] = useState<string>("");
    const [gameActive, setGameActive] = useState<boolean>(true);

    useEffect(() => {
        const timer = setInterval(() => {
            if (showOriginal) {
                setShowOriginal(false);
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [showOriginal]);

    const handleInspect = () => {
        setShowOriginal(true);
    };

    const handleVerdict = (isPHacked: boolean) => {
        if (!gameActive) return;

        const correct = isPHacked === EXPERIMENTS[currentExp].isPHacked;
        setScore(prev => prev + (correct ? 1 : -1));
        setVerdict(correct ? "Correct!" : "Wrong!");

        setTimeout(() => {
            if (currentExp < EXPERIMENTS.length - 1) {
                setCurrentExp(prev => prev + 1);
                setVerdict("");
            } else {
                setGameActive(false);
            }
        }, 1500);
    };

    const renderDataPoints = (data: number[]) => {
        return (
            <div className="flex gap-2 h-40 items-end">
                {data.map((value, index) => (
                    <div
                        key={index}
                        className="w-8 bg-blue-500"
                        style={{ height: `${value * 20}%` }}
                        role="graphics-symbol"
                        aria-label={`Data point ${value}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">P-Hacking Detective</h1>
                <div className="flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    <span>Score: {score}</span>
                </div>
            </div>

            {gameActive ? (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg">
                        <h2 className="text-xl mb-4">{EXPERIMENTS[currentExp].title}</h2>
                        <div className="relative">
                            {renderDataPoints(
                                showOriginal
                                    ? EXPERIMENTS[currentExp].originalData
                                    : EXPERIMENTS[currentExp].reportedData
                            )}
                        </div>
                        <button
                            onClick={handleInspect}
                            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                        >
                            <Search className="w-4 h-4" />
                            Inspect Original Data
                        </button>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => handleVerdict(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                        >
                            <AlertCircle className="w-5 h-5" />
                            Flag as P-Hacked
                        </button>
                        <button
                            onClick={() => handleVerdict(false)}
                            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Mark as Legitimate
                        </button>
                    </div>

                    {verdict && (
                        <div className="text-center text-xl font-bold text-blue-500">
                            {verdict}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl mb-4">Game Complete!</h2>
                    <p>Final Score: {score}</p>
                    <button
                        onClick={() => {
                            setCurrentExp(0);
                            setScore(0);
                            setGameActive(true);
                        }}
                        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}