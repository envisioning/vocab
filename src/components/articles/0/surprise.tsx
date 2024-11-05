"use client"
import { useState, useEffect } from "react"
import { Brain, Lightbulb, Zap, ThumbsUp, ThumbsDown, AlertCircle, Info } from "lucide-react"

interface SurpriseProps { }

type Prediction = {
    id: number
    item: string
    expected: number
    actual: number
    surprise: number
    explanation: string
}

const PREDICTIONS: Prediction[] = [
    {
        id: 1,
        item: "☀️",
        expected: 90,
        actual: 85,
        surprise: 0.05,
        explanation: "Sunny weather was expected and occurred - low surprise!"
    },
    {
        id: 2,
        item: "🌧️",
        expected: 5,
        actual: 45,
        surprise: 0.7,
        explanation: "Rain was unlikely but happened - moderate surprise!"
    },
    {
        id: 3,
        item: "🌈",
        expected: 2,
        actual: 15,
        surprise: 0.95,
        explanation: "Rainbow was rare but appeared - high surprise!"
    },
    {
        id: 4,
        item: "❄️",
        expected: 1,
        actual: 90,
        surprise: 0.99,
        explanation: "Snow in summer! Extremely surprising!"
    }
]

const SurpriseMeter = ({ }: SurpriseProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [isAnimating, setIsAnimating] = useState<boolean>(false)
    const [showInfo, setShowInfo] = useState<boolean>(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % PREDICTIONS.length)
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 500)
        }, 4000)

        return () => clearInterval(timer)
    }, [])

    const getSurpriseColor = (surprise: number) => {
        if (surprise < 0.3) return "bg-green-500"
        if (surprise < 0.7) return "bg-yellow-500"
        return "bg-red-500"
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-500" />
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        AI Surprise-O-Meter
                    </h2>
                </div>
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    aria-label="Toggle information"
                >
                    <Info className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {showInfo && (
                <div className="px-4 pb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                        AI systems experience "surprise" when reality differs from their expectations.
                        The greater the difference between expected and actual probabilities,
                        the higher the surprise level - just like humans!
                    </div>
                </div>
            )}

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-5xl">
                        {PREDICTIONS[activeIndex].item}
                    </div>
                    <Zap
                        className={`w-5 h-5 transition-all duration-300 ${isAnimating
                                ? "text-yellow-400 scale-125"
                                : "text-gray-400 scale-100"
                            }`}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Expected Probability:</span>
                        <span className="font-mono font-medium">{PREDICTIONS[activeIndex].expected}%</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Actual Occurrence:</span>
                        <span className="font-mono font-medium">{PREDICTIONS[activeIndex].actual}%</span>
                    </div>

                    <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                            className={`absolute h-full transition-all duration-500 ease-out ${getSurpriseColor(PREDICTIONS[activeIndex].surprise)
                                }`}
                            style={{ width: `${PREDICTIONS[activeIndex].surprise * 100}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center py-1">
                        <div className="flex flex-col items-center gap-0.5">
                            <ThumbsDown className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Expected</span>
                        </div>
                        <AlertCircle
                            className={`w-5 h-5 transition-colors duration-300 ${PREDICTIONS[activeIndex].surprise > 0.7
                                    ? "text-red-500"
                                    : "text-gray-400"
                                }`}
                        />
                        <div className="flex flex-col items-center gap-0.5">
                            <ThumbsUp className="w-4 h-4 text-blue-500" />
                            <span className="text-xs text-gray-500">Surprising</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                    {PREDICTIONS[activeIndex].explanation}
                </div>
            </div>

            <div className="p-4 flex justify-center gap-2">
                {PREDICTIONS.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index
                                ? "bg-blue-500 scale-110"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                        aria-label={`Show prediction ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default SurpriseMeter