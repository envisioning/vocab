"use client"
import { useState, useEffect } from "react"
import { Brain, Settings, Database, ArrowRight, RefreshCw, HelpCircle, Target, Sparkles } from "lucide-react"

interface ParameterProps {}

type DataPoint = {
  x: number
  y: number
}

const Parameter: React.FC<ParameterProps> = () => {
  const [slope, setSlope] = useState<number>(1)
  const [isTraining, setIsTraining] = useState<boolean>(false)
  const [iteration, setIteration] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<string>("")
  
  const trainingData: DataPoint[] = [
    {x: 10, y: 20}, {x: 20, y: 35}, {x: 30, y: 50}, {x: 40, y: 70}, {x: 50, y: 85}
  ]

  useEffect(() => {
    if (isTraining && iteration < 10) {
      const timer = setTimeout(() => {
        setSlope(prev => prev + (Math.random() * 0.4 - 0.2))
        setIteration(prev => prev + 1)
      }, 500)
      return () => clearTimeout(timer)
    } else if (iteration >= 10) {
      setIsTraining(false)
      setIteration(0)
    }
  }, [isTraining, iteration])

  return (
    <div className="w-full max-w-3xl mx-auto p-8 space-y-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500 rounded-lg">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Parameter Learning
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onMouseEnter={() => setShowTooltip("train")}
            onMouseLeave={() => setShowTooltip("")}
            onClick={() => setIsTraining(true)}
            disabled={isTraining}
            className="group flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-blue-200"
          >
            <Settings className={`w-5 h-5 ${isTraining ? 'animate-spin' : ''}`} />
            Train Model
            {showTooltip === "train" && (
              <div className="absolute mt-16 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl text-sm">
                Start the learning process
              </div>
            )}
          </button>
          <button
            onMouseEnter={() => setShowTooltip("reset")}
            onMouseLeave={() => setShowTooltip("")}
            onClick={() => {
              setSlope(1)
              setIsTraining(false)
              setIteration(0)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-gray-200"
          >
            <RefreshCw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>

      <div className="relative h-96 bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-inner p-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute left-12 bottom-12 top-12 w-0.5 bg-gray-200 dark:bg-gray-600" />
          <div className="absolute left-12 right-12 bottom-12 h-0.5 bg-gray-200 dark:bg-gray-600" />
          
          {trainingData.map((point, i) => (
            <div key={i} className="absolute">
              <div
                className="w-4 h-4 bg-green-400 rounded-full transform -translate-x-2 -translate-y-2 transition-all duration-300 animate-pulse shadow-lg shadow-green-200"
                style={{
                  left: `${point.x + 48}px`,
                  bottom: `${point.y + 48}px`
                }}
              />
              <Sparkles className="w-3 h-3 text-green-300 absolute -top-2 -right-2 animate-bounce" />
            </div>
          ))}
          
          <div 
            className="absolute left-12 bottom-12 w-[400px] h-1 bg-gradient-to-r from-blue-600 to-blue-400 origin-left transition-all duration-300 shadow-lg"
            style={{
              transform: `rotate(${Math.atan(slope) * (180/Math.PI)}deg)`
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-semibold">Parameter (slope): {slope.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-green-500" />
          <span className="text-lg font-semibold">Iteration: {iteration}/10</span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-gray-700 rounded-xl">
        <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Parameters are like the model's internal knobs that get adjusted during training.
          Watch as our AI learns to fit the green data points by updating its slope parameter!
        </p>
      </div>
    </div>
  )
}

export default Parameter