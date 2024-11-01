"use client"
import { useState, useEffect } from "react"
import { ArrowDown, ChevronDown, Circle, Mountain, Info, Play, RefreshCw } from "lucide-react"

interface GradientDescentProps {}

type BallPosition = {
  x: number
  y: number
}

export default function GradientDescent({}: GradientDescentProps) {
  const [isRolling, setIsRolling] = useState<boolean>(false)
  const [position, setPosition] = useState<BallPosition>({ x: 80, y: 20 })
  const [step, setStep] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [showSteps, setShowSteps] = useState<boolean>(true)

  const path = [
    { x: 80, y: 20, message: "Starting point: High error" },
    { x: 65, y: 40, message: "Taking bigger steps downhill" },
    { x: 50, y: 55, message: "Adjusting direction" },
    { x: 35, y: 65, message: "Steps getting smaller" },
    { x: 25, y: 72, message: "Getting closer to minimum" },
    { x: 20, y: 76, message: "Fine-tuning" },
    { x: 15, y: 80, message: "Reached local minimum!" },
  ]

  useEffect(() => {
    if (isRolling && step < path.length - 1) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1)
        setPosition(path[step + 1])
      }, 1000)
      return () => clearTimeout(timer)
    } else if (step === path.length - 1) {
      setIsRolling(false)
      setShowSteps(true)
    }
  }, [isRolling, step])

  const handleStart = () => {
    setIsRolling(true)
    setShowSteps(false)
    setStep(0)
    setPosition(path[0])
  }

  const handleReset = () => {
    setIsRolling(false)
    setStep(0)
    setPosition(path[0])
    setShowSteps(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="relative flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gradient Descent Visualization
          </h2>
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
          >
            <Info className="w-5 h-5 text-blue-500" />
          </button>
          {showTooltip && (
            <div className="absolute right-0 top-12 w-64 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10 text-sm">
              Gradient descent iteratively adjusts parameters to minimize error, like a ball rolling downhill to find the lowest point.
            </div>
          )}
        </div>

        <div className="relative w-full h-64 md:h-80 mb-8 bg-gradient-to-b from-transparent to-blue-50 dark:to-gray-900 rounded-xl overflow-hidden">
          <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 90 20 Q 50 120 10 80"
              fill="none"
              stroke="currentColor"
              className="text-blue-500 dark:text-blue-400 stroke-2"
              strokeDasharray="5,5"
            />
          </svg>

          <div
            className="absolute transition-all duration-500 ease-in-out transform -translate-x-3 -translate-y-3"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            <Circle className={`w-6 h-6 text-blue-500 fill-blue-500 ${isRolling ? "animate-spin" : ""}`} />
          </div>

          <div className="absolute left-[15%] top-[80%]">
            <Mountain className="w-6 h-6 text-green-500" />
          </div>

          {showSteps && (
            <div className="absolute left-4 bottom-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {path[step].message}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleStart}
            disabled={isRolling}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            {isRolling ? "Optimizing..." : "Start Descent"}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full font-medium transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}