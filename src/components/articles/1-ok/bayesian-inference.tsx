"use client"
import { useState, useEffect } from "react"
import { Cloud, Sun, Umbrella, ArrowRight, RefreshCw } from "lucide-react"

interface WeatherScenario {
    day: number;
    isRainy: boolean;
    belief: number;
}

interface ComponentProps {}

/**
 * BayesianWeatherLearner: Interactive component teaching Bayesian inference
 * through weather prediction scenarios.
 */
const BayesianWeatherLearner: React.FC<ComponentProps> = () => {
    const [currentBelief, setCurrentBelief] = useState<number>(30)
    const [scenarios, setScenarios] = useState<WeatherScenario[]>([])
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [currentDay, setCurrentDay] = useState<number>(1)

    const updateBelief = (wasRainy: boolean): number => {
        const likelihoodRainGivenRainy = 0.8
        const likelihoodNoRainGivenRainy = 0.2
        const prior = currentBelief / 100

        if (wasRainy) {
            return (likelihoodRainGivenRainy * prior) / 
                   ((likelihoodRainGivenRainy * prior) + 
                    (likelihoodNoRainGivenRainy * (1 - prior))) * 100
        } else {
            return (likelihoodNoRainGivenRainy * prior) / 
                   ((likelihoodNoRainGivenRainy * prior) + 
                    (likelihoodRainGivenRainy * (1 - prior))) * 100
        }
    }

    useEffect(() => {
        if (isRunning && currentDay <= 7) {
            const timer = setTimeout(() => {
                const isRainy = Math.random() < 0.3
                const newBelief = updateBelief(isRainy)
                
                setScenarios(prev => [...prev, {
                    day: currentDay,
                    isRainy,
                    belief: newBelief
                }])
                
                setCurrentBelief(newBelief)
                setCurrentDay(prev => prev + 1)
            }, 2000)

            return () => clearTimeout(timer)
        } else if (currentDay > 7) {
            setIsRunning(false)
        }
    }, [isRunning, currentDay])

    const handleReset = () => {
        setCurrentBelief(30)
        setScenarios([])
        setCurrentDay(1)
        setIsRunning(false)
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Weather Belief Updater</h2>
            
            <div className="mb-6">
                <p className="text-lg mb-2">
                    Current belief it will rain: {currentBelief.toFixed(1)}%
                </p>
                <div className="w-full bg-gray-200 h-6 rounded">
                    <div 
                        className="bg-blue-500 h-full rounded transition-all duration-500"
                        style={{ width: `${currentBelief}%` }}
                    />
                </div>
            </div>

            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setIsRunning(true)}
                    disabled={isRunning || currentDay > 7}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                             disabled:bg-gray-400 transition-colors duration-300"
                    aria-label="Start simulation"
                >
                    {isRunning ? "Observing..." : "Start Observing"}
                </button>
                
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 
                             transition-colors duration-300"
                    aria-label="Reset simulation"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col space-y-4">
                {scenarios.map((scenario) => (
                    <div 
                        key={scenario.day}
                        className="flex items-center space-x-4 p-4 bg-white rounded-lg 
                                 shadow transition-all duration-300"
                    >
                        <span className="text-lg">Day {scenario.day}</span>
                        {scenario.isRainy ? 
                            <Cloud className="w-6 h-6 text-blue-500" /> : 
                            <Sun className="w-6 h-6 text-yellow-500" />
                        }
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-lg">{scenario.belief.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BayesianWeatherLearner