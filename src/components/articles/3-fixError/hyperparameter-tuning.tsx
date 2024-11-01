"use client"
import { useState, useEffect } from "react"
import { Settings, HelpCircle, Brain, Target, Zap, BarChart, Sparkles } from "lucide-react"

interface HyperParameter {
  name: string
  value: number
  min: number
  max: number
  step: number
  description: string
}

interface ModelPerformance {
  accuracy: number
  loss: number
}

const INITIAL_PARAMETERS: HyperParameter[] = [
  { 
    name: "Learning Rate", 
    value: 0.01, 
    min: 0.001, 
    max: 0.1, 
    step: 0.001,
    description: "Controls how much the model adjusts its weights in each training step"
  },
  { 
    name: "Batch Size", 
    value: 32, 
    min: 8, 
    max: 128, 
    step: 8,
    description: "Number of training examples used in one iteration"
  },
  { 
    name: "Epochs", 
    value: 10, 
    min: 1, 
    max: 50, 
    step: 1,
    description: "Number of complete passes through the training dataset"
  }
]

export default function HyperParameterTuner() {
  const [parameters, setParameters] = useState<HyperParameter[]>(INITIAL_PARAMETERS)
  const [performance, setPerformance] = useState<ModelPerformance>({ accuracy: 0.75, loss: 0.5 })
  const [isTraining, setIsTraining] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setPerformance(prev => ({
          accuracy: Math.min(0.98, prev.accuracy + Math.random() * 0.05),
          loss: Math.max(0.1, prev.loss - Math.random() * 0.05)
        }))
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isTraining])

  const handleSliderChange = (index: number, value: number) => {
    const newParameters = [...parameters]
    newParameters[index].value = value
    setParameters(newParameters)
  }

  const startTraining = () => {
    setIsTraining(true)
    setPerformance({ accuracy: 0.75, loss: 0.5 })
    setTimeout(() => setIsTraining(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Hyperparameter Tuning Lab
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Optimize your model's learning process</span>
          </div>
        </div>

        <div className="bg-gray-800/40 rounded-xl p-4 md:p-6 backdrop-blur-md border border-gray-700 shadow-xl">
          {parameters.map((param, index) => (
            <div key={param.name} className="mb-6 relative">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <label className="text-gray-300 font-medium">{param.name}</label>
                  <button
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                    onMouseEnter={() => setActiveTooltip(index)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-blue-400 font-mono">{param.value.toFixed(3)}</span>
              </div>
              {activeTooltip === index && (
                <div className="absolute -top-12 left-0 right-0 bg-gray-800 text-sm p-2 rounded-lg shadow-lg z-10">
                  {param.description}
                </div>
              )}
              <div className="relative" id={`slider-${index}`}>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  onChange={(e) => handleSliderChange(index, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors duration-300"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={startTraining}
            disabled={isTraining}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            <Zap className="w-5 h-5" />
            <span>{isTraining ? "Optimizing..." : "Start Training"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/40 rounded-xl p-4 md:p-6 backdrop-blur-md border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300 font-medium">Model Accuracy</span>
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                style={{ width: `${performance.accuracy * 100}%` }}
              />
            </div>
            <span className="text-right block mt-2 text-green-400 font-medium">
              {(performance.accuracy * 100).toFixed(1)}%
            </span>
          </div>

          <div className="bg-gray-800/40 rounded-xl p-4 md:p-6 backdrop-blur-md border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300 font-medium">Training Loss</span>
              <BarChart className="w-5 h-5 text-red-400" />
            </div>
            <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                style={{ width: `${performance.loss * 100}%` }}
              />
            </div>
            <span className="text-right block mt-2 text-red-400 font-medium">
              {performance.loss.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}