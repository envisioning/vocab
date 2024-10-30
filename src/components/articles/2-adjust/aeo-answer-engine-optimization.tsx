"use client"
import { useState, useEffect } from "react";
import { MessageCircle, Award, RefreshCw, Check, X, AlertCircle } from "lucide-react";

interface Scenario {
    question: string;
    answers: {
        text: string;
        isAEO: boolean;
        explanation: string;
    }[];
}

interface ComponentProps {}

const SCENARIOS: Scenario[] = [
    {
        question: "What's the best time to visit Paris?",
        answers: [
            {
                text: "Spring (March to May) is the best time to visit Paris due to mild weather and fewer crowds.",
                isAEO: true,
                explanation: "Direct, concise answer with specific details"
            },
            {
                text: "Paris, the city of lights, has many wonderful seasons each offering unique experiences...",
                isAEO: false,
                explanation: "Too indirect and verbose"
            },
            {
                text: "Tourist seasons vary greatly depending on multiple factors including weather patterns...",
                isAEO: false,
                explanation: "Lacks specific answer"
            }
        ]
    },
    {
        question: "How do I make scrambled eggs?",
        answers: [
            {
                text: "First, you should consider the history of egg preparation techniques...",
                isAEO: false,
                explanation: "Unnecessary background information"
            },
            {
                text: "Beat eggs, heat butter in pan, cook while stirring until firm. Season with salt and pepper.",
                isAEO: true,
                explanation: "Clear, structured steps"
            },
            {
                text: "There are many ways to prepare eggs, including scrambling...",
                isAEO: false,
                explanation: "Too general, not actionable"
            }
        ]
    }
];

export default function AEOTrainer({}: ComponentProps) {
    const [currentScenario, setCurrentScenario] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>("");

    useEffect(() => {
        const cleanup = () => {
            setSelectedAnswer(null);
            setFeedback("");
        };
        return cleanup;
    }, [currentScenario]);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData("text/plain", index.toString());
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const index = parseInt(e.dataTransfer.getData("text/plain"));
        handleAnswerSelect(index);
    };

    const handleAnswerSelect = (index: number) => {
        setSelectedAnswer(index);
        const answer = SCENARIOS[currentScenario].answers[index];
        if (answer.isAEO) {
            setScore(prev => prev + 1);
            setFeedback("Correct! " + answer.explanation);
        } else {
            setFeedback("Not quite. " + answer.explanation);
        }
    };

    const handleNext = () => {
        if (currentScenario < SCENARIOS.length - 1) {
            setCurrentScenario(prev => prev + 1);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">AEO Training Game</h2>
                <div className="flex items-center gap-2">
                    <Award className="text-blue-500" />
                    <span>Score: {score}/{SCENARIOS.length}</span>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg mb-4">
                <div className="flex items-start gap-2 mb-4">
                    <MessageCircle className="text-blue-500" />
                    <p className="text-lg">{SCENARIOS[currentScenario].question}</p>
                </div>

                <div 
                    className="border-2 border-dashed border-gray-300 p-4 rounded-lg mb-4"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    role="region"
                    aria-label="Answer drop zone"
                >
                    <p className="text-gray-500 text-center">Drag the best AEO answer here</p>
                </div>

                <div className="space-y-3">
                    {SCENARIOS[currentScenario].answers.map((answer, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleAnswerSelect(index)}
                            className={`p-3 rounded-lg cursor-move transition-all duration-300
                                ${selectedAnswer === index 
                                    ? answer.isAEO ? 'bg-green-100' : 'bg-red-100'
                                    : 'bg-gray-100 hover:bg-gray-200'}`}
                            role="button"
                            tabIndex={0}
                        >
                            {answer.text}
                        </div>
                    ))}
                </div>
            </div>

            {feedback && (
                <div className={`p-4 rounded-lg mb-4 ${feedback.includes("Correct") ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="flex items-center gap-2">
                        {feedback.includes("Correct") ? <Check /> : <AlertCircle />}
                        {feedback}
                    </p>
                </div>
            )}

            <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-opacity duration-300"
                aria-label="Next question"
            >
                Next Question
            </button>
        </div>
    );
}