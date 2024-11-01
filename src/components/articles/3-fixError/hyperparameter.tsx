"use client"
import { useState, useEffect } from "react"
import { Settings, Sliders, Brain, Zap, RefreshCw, Info, Network } from "lucide-react"

interface HyperParameterProps {}

type NetworkConfig = {
  learningRate: number
  layers: number
  neurons: number
  epochs: number
}

type TooltipContent = {
  [key: string]: string
}

const TOOLTIPS: TooltipContent = {
  learningRate: "Controls how much the model adjusts its predictions (0.001-0.1). Lower values = more precise but slower learning.",
  layers: "Number of processing layers (1-5). More layers can learn complex patterns but may be harder to train.",
  neurons: "Information processing units per layer (1-8). More neurons can capture detailed patterns.",
  epochs: "Complete passes through the training data (5-50). More epochs = better learning but diminishing returns."
}

const HyperParameterTuner: React.FC<HyperParameterProps> = () => {
  const [config, setConfig] = useState<NetworkConfig>({
    learningRate: 0.01,
    layers: 2,
    neurons: 4,
    epochs: 10
  })
  const [isTraining, setIsTraining] = useState(false)
  const [accuracy, setAccuracy] = useState(0)
  const [activeTooltip, setActiveTooltip] = useState<string>("")

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setAccuracy(prev => {
          const noise = Math.random() * 0.1 - 0.05
          const newAcc = prev + (0.1 + noise)
          return newAcc > 1 ? 1 : newAcc
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isTraining])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
            <Network className="w-8 h-8 text-blue-500 animate-pulse" />
            Neural Network Hyperparameters
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Shape your AI model&apos;s learning journey by fine-tuning these crucial parameters
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-xl p-6 space-y-6">
            {Object.entries(config).map(([param, value]) => (
              <div key={param} className="relative group">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                    {param === "learningRate" && <Sliders className="w-4 h-4 text-blue-500" />}
                    {param === "layers" && <Brain className="w-4 h-4 text-purple-500" />}
                    {param === "neurons" && <Zap className="w-4 h-4 text-yellow-500" />}
                    {param === "epochs" && <RefreshCw className="w-4 h-4 text-green-500" />}
                    {param.charAt(0).toUpperCase() + param.slice(1).replace(/([A-Z])/g, ' $1')}: {value}
                    <Info
                      className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors duration-300"
                      onMouseEnter={() => setActiveTooltip(param)}
                      onMouseLeave={() => setActiveTooltip("")}
                    />
                  </label>
                </div>
                {activeTooltip === param && (
                  <div className="absolute z-10 -top-12 left-0 right-0 bg-blue-500 text-white p-2 rounded-lg text-sm shadow-lg">
                    {TOOLTIPS[param]}
                  </div>
                )}
                <input
                  type="range"
                  min={param === "learningRate" ? "0.001" : param === "epochs" ? "5" : "1"}
                  max={param === "learningRate" ? "0.1" : param === "layers" ? "5" : param === "neurons" ? "8" : "50"}
                  step={param === "learningRate" ? "0.001" : "1"}
                  value={value}
                  onChange={(e) => setConfig({...config, [param]: param === "learningRate" ? parseFloat(e.target.value) : parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            ))}

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => {setIsTraining(true); setAccuracy(0)}}
                disabled={isTraining}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {isTraining ? "Training..." : "Start Training"}
              </button>
              <button
                onClick={() => {setIsTraining(false); setAccuracy(0)}}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition duration-300 shadow-lg hover:shadow-xl"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Training Progress</h3>
            <div className="space-y-6">
              <div className="relative pt-4">
                <div className="overflow-hidden h-6 text-xs flex rounded-xl bg-gray-200 dark:bg-gray-700">
                  <div
                    style={{ width: `${accuracy * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  />
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {(accuracy * 100).toFixed(1)}% Accuracy
                </div>
              </div>
              <div className="text-center text-gray-600 dark:text-gray-300">
                {isTraining ? "Training in progress..." : "Adjust parameters and start training"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HyperParameterTuner