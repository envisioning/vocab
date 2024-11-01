"use client"
import { useState, useEffect } from "react";
import { Brain, CheckCircle, XCircle, Clock, Infinity, RefreshCw, Loader2, HelpCircle, AlertCircle } from "lucide-react";

interface ProblemType {
    id: number;
    description: string;
    explanation: string;
    isDecidable: boolean;
    solved: boolean;
}

const PROBLEMS: ProblemType[] = [
    {
        id: 1,
        description: "Will this sorting algorithm finish in 5 steps?",
        explanation: "This is decidable because we can simulate each step and count them precisely.",
        isDecidable: true,
        solved: false
    },
    {
        id: 2,
        description: "Will this program ever stop running?",
        explanation: "This is the famous Halting Problem - it's proven to be undecidable!",
        isDecidable: false,
        solved: false
    },
    {
        id: 3,
        description: "Is this number prime?",
        explanation: "This is decidable because we can use a proven mathematical algorithm to check.",
        isDecidable: true,
        solved: false
    }
];

export default function DecidabilityExplorer() {
    const [problems, setProblems] = useState<ProblemType[]>(PROBLEMS);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [showInfiniteLoop, setShowInfiniteLoop] = useState<boolean>(false);
    const [showTooltip, setShowTooltip] = useState<number | null>(null);

    useEffect(() => {
        if (showInfiniteLoop) {
            const timeout = setTimeout(() => setShowInfiniteLoop(false), 3000);
            return () => clearTimeout(timeout);
        }
    }, [showInfiniteLoop]);

    const handleSolveAttempt = (index: number) => {
        setIsProcessing(true);
        const problem = problems[index];
        
        if (problem.isDecidable) {
            setTimeout(() => {
                setProblems(prev => prev.map((p, i) => 
                    i === index ? { ...p, solved: true } : p
                ));
                setIsProcessing(false);
            }, 1500);
        } else {
            setShowInfiniteLoop(true);
            setTimeout(() => {
                setIsProcessing(false);
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4 sm:p-8 flex flex-col items-center justify-center">
            <div className="max-w-3xl w-full space-y-6">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
                        <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                        Decidability Explorer
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
                        Can a computer determine a yes/no answer in finite time?
                        <HelpCircle className="w-5 h-5 text-blue-500 cursor-help" />
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 space-y-4">
                    {problems.map((problem, index) => (
                        <div key={problem.id} 
                             className="relative transform transition-all duration-300 hover:scale-102">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                                            {problem.description}
                                        </span>
                                        <AlertCircle 
                                            className="w-5 h-5 text-blue-500 cursor-help"
                                            onMouseEnter={() => setShowTooltip(index)}
                                            onMouseLeave={() => setShowTooltip(null)}
                                        />
                                    </div>
                                    {showTooltip === index && (
                                        <div className="absolute z-10 bg-blue-600 text-white p-3 rounded-lg shadow-lg max-w-xs text-sm">
                                            {problem.explanation}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {problem.solved ? (
                                        <div className="flex items-center gap-2 text-green-500">
                                            <CheckCircle className="w-6 h-6" />
                                            <span className="text-sm">Solved!</span>
                                        </div>
                                    ) : showInfiniteLoop && activeIndex === index ? (
                                        <div className="flex items-center gap-2 text-red-500">
                                            <RefreshCw className="w-6 h-6 animate-spin" />
                                            <span className="text-sm">Processing forever...</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setActiveIndex(index);
                                                handleSolveAttempt(index);
                                            }}
                                            disabled={isProcessing}
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-2 transform hover:scale-105"
                                        >
                                            {isProcessing && activeIndex === index ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Processing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Brain className="w-5 h-5" />
                                                    <span>Attempt Solution</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6">
                    <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-gray-600 dark:text-gray-300">Decidable</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                            <Infinity className="w-5 h-5 text-red-500" />
                            <span className="text-gray-600 dark:text-gray-300">Undecidable</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-600 dark:text-gray-300">Processing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}