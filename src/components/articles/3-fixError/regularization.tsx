"use client"
import { useState, useEffect } from "react"
import { Brain, Info, Play, Undo2, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"

interface RegularizationProps {}

type ModelState = "underfitting" | "optimal" | "overfitting"

const RegularizationDemo: React.FC<RegularizationProps> = () => {
  const [complexity, setComplexity] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  const getModelState = (complexity: number): ModelState => {
    if (complexity < 30) return "underfitting"
    if (complexity > 70) return "overfitting"
    return "optimal"
  }

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setComplexity(prev => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 100
          }
          return prev + 1
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const generatePoints = () => {
    const points = []
    for (let i = 0; i < 120; i += 10) {
      points.push({
        x: i,
        y: 50 + Math.sin(i / 20) * 15 + (Math.random() - 0.5) * 10
      })
    }
    return points
  }

  const getModelPath = (complexity: number): string => {
    let path = "M 0 50 "
    const wiggles = complexity / 15
    for (let i = 0; i < 120; i += 2) {
      const y = 50 + Math.sin(i / 20) * 15 + 
                Math.sin(i / 5 * wiggles) * (complexity / 3)
      path += `L ${i} ${y} `
    }
    return path
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-10 h-10 text-blue-500" />
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
            Regularization Explorer
          </h2>
        </div>
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <HelpCircle className="w-6 h-6 text-gray-500" />
          {showTooltip && (
            <div className="absolute right-0 w-64 p-4 mt-2 text-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg z-10">
              Regularization helps prevent overfitting by controlling model complexity.
              Watch how the model line changes as you adjust complexity.
            </div>
          )}
        </button>
      </div>

      <div className="relative h-80 bg-white dark:bg-gray-900 rounded-xl shadow-inner overflow-hidden mb-8">
        <svg className="w-full h-full" viewBox="0 0 120 100" preserveAspectRatio="none">
          {generatePoints().map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="2"
              className="fill-blue-400"
            />
          ))}
          <path
            d={getModelPath(complexity)}
            fill="none"
            strokeWidth="2"
            className={`transition-colors duration-500 ${
              getModelState(complexity) === "optimal"
                ? "stroke-green-500"
                : getModelState(complexity) === "overfitting"
                ? "stroke-red-500"
                : "stroke-yellow-500"
            }`}
          />
        </svg>
        
        <div className="absolute top-4 right-4 flex gap-2">
          {getModelState(complexity) === "overfitting" && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-full">
              <AlertTriangle className="w-4 h-4" />
              Overfitting!
            </div>
          )}
          {getModelState(complexity) === "optimal" && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-full">
              <CheckCircle className="w-4 h-4" />
              Optimal Fit
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Model Complexity:
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={complexity}
            onChange={(e) => setComplexity(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => {
              setComplexity(0)
              setIsPlaying(true)
            }}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Animate
          </button>
          <button
            onClick={() => setComplexity(0)}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Undo2 className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegularizationDemo