"use client"
import { useState, useEffect } from "react"
import { LineChart, TrendUp, Brain, Clock, Database, ArrowRight, Info } from "lucide-react"

interface DataPoint {
    id: number
    value: number
    predicted: boolean
    label: string
}

interface PredictionState {
    historicalData: DataPoint[]
    futurePredictions: DataPoint[]
    isAnimating: boolean
    step: number
    showTooltip: number | null
}

const INITIAL_DATA: DataPoint[] = [
    { id: 1, value: 30, predicted: false, label: "January Sales" },
    { id: 2, value: 45, predicted: false, label: "February Growth" },
    { id: 3, value: 35, predicted: false, label: "March Performance" },
    { id: 4, value: 50, predicted: false, label: "April Results" },
    { id: 5, value: 60, predicted: false, label: "May Metrics" }
]

const FUTURE_DATA: DataPoint[] = [
    { id: 6, value: 65, predicted: true, label: "June Forecast" },
    { id: 7, value: 70, predicted: true, label: "July Prediction" },
    { id: 8, value: 75, predicted: true, label: "August Outlook" }
]

export default function PredictiveAnalyticsDemo() {
    const [state, setState] = useState<PredictionState>({
        historicalData: INITIAL_DATA,
        futurePredictions: [],
        isAnimating: false,
        step: 0,
        showTooltip: null
    })

    useEffect(() => {
        if (state.isAnimating && state.step < FUTURE_DATA.length) {
            const timer = setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    futurePredictions: [...prev.futurePredictions, FUTURE_DATA[prev.step]],
                    step: prev.step + 1
                }))
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [state.isAnimating, state.step])

    const handleStartPrediction = () => {
        setState(prev => ({ ...prev, isAnimating: true }))
    }

    const handleReset = () => {
        setState({
            historicalData: INITIAL_DATA,
            futurePredictions: [],
            isAnimating: false,
            step: 0,
            showTooltip: null
        })
    }

    return (
        <div className="flex flex-col items-center p-4 md:p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
                Predictive Analytics Explorer
            </h1>

            <div className="relative w-full max-w-4xl p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90">
                <div className="flex flex-wrap justify-center md:justify-between items-center mb-6 gap-4">
                    <div className="flex items-center space-x-2 md:space-x-4 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                        <Database className="w-5 h-5 text-blue-500" />
                        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Historical</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <Brain className="w-5 h-5 text-green-500" />
                        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Analysis</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <TrendUp className="w-5 h-5 text-purple-500" />
                        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Future</span>
                    </div>
                </div>

                <div className="h-64 md:h-96 relative border-b-2 border-l-2 border-gray-300 dark:border-gray-600 mb-6">
                    {[...state.historicalData, ...state.futurePredictions].map((point, index) => (
                        <div key={point.id} className="relative">
                            <div
                                className={`absolute w-4 h-4 rounded-full transform transition-all duration-500 cursor-pointer
                                    ${point.predicted ? 'bg-purple-500 hover:bg-purple-400' : 'bg-blue-500 hover:bg-blue-400'}
                                    ${state.showTooltip === point.id ? 'scale-150' : 'scale-100'}
                                `}
                                style={{
                                    left: `${(index / (INITIAL_DATA.length + FUTURE_DATA.length - 1)) * 100}%`,
                                    bottom: `${(point.value / 100) * 100}%`,
                                }}
                                onMouseEnter={() => setState(prev => ({ ...prev, showTooltip: point.id }))}
                                onMouseLeave={() => setState(prev => ({ ...prev, showTooltip: null }))}
                            />
                            {state.showTooltip === point.id && (
                                <div className="absolute z-10 bg-white dark:bg-gray-700 p-2 rounded-lg shadow-lg text-sm whitespace-nowrap"
                                    style={{
                                        left: `${(index / (INITIAL_DATA.length + FUTURE_DATA.length - 1)) * 100}%`,
                                        bottom: `${(point.value / 100) * 100 + 10}%`,
                                    }}>
                                    <p className="font-semibold">{point.label}</p>
                                    <p className="text-gray-600 dark:text-gray-300">Value: {point.value}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <button
                        onClick={handleStartPrediction}
                        disabled={state.isAnimating}
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
                    >
                        <Clock className="w-5 h-5 inline mr-2" />
                        Predict Future
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="mt-6 text-center text-gray-600 dark:text-gray-400 max-w-lg px-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5" />
                    <p className="font-semibold">How it works</p>
                </div>
                <p className="text-sm md:text-base">
                    Hover over any point to see detailed information. Blue dots show historical data, while purple dots represent AI-predicted future trends. Just like forecasting your exam scores based on your study patterns!
                </p>
            </div>
        </div>
    )
}