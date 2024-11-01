"use client"
import { useState, useEffect } from "react"
import { Brain, Split, Target, Info, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react"

interface DataPoint {
  id: number
  x: number
  y: number
  type: "training" | "validation"
}

export default function ValidationDataVisualizer() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
  const [activePoint, setActivePoint] = useState<number | null>(null)
  const [showTip, setShowTip] = useState<string | null>(null)
  const [phase, setPhase] = useState<"initial" | "training" | "validation">("initial")

  useEffect(() => {
    const points = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      type: i < 18 ? "training" : "validation"
    }))
    setDataPoints(points)

    const phaseTimer = setInterval(() => {
      setPhase(p => p === "initial" ? "training" : p === "training" ? "validation" : "initial")
    }, 5000)

    return () => {
      clearInterval(phaseTimer)
      setDataPoints([])
    }
  }, [])

  const handlePointHover = (id: number) => {
    setActivePoint(id)
    const point = dataPoints.find(p => p.id === id)
    setShowTip(point?.type === "training" ? 
      "Training data helps the model learn patterns" : 
      "Validation data tests the model's understanding")
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
            Data Validation Journey
          </h2>
        </div>
        <button 
          className="p-2 rounded-full hover:bg-white/20 transition-colors duration-300"
          onMouseEnter={() => setShowTip("Learn about validation data")}
          onMouseLeave={() => setShowTip(null)}
        >
          <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </button>
      </header>

      <div className="relative aspect-video bg-white dark:bg-gray-800 rounded-xl shadow-inner overflow-hidden">
        <div className="absolute inset-0 grid place-items-center opacity-10">
          <Split className="w-full h-full text-gray-300" />
        </div>
        
        {dataPoints.map((point) => (
          <div
            key={point.id}
            className={`absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-500 
              ${point.type === "training" ? "bg-blue-500 hover:bg-blue-400" : "bg-green-500 hover:bg-green-400"}
              ${activePoint === point.id ? "scale-150 ring-4 ring-opacity-50 ring-current" : "scale-100"}
              ${phase === point.type ? "animate-pulse" : ""}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onMouseEnter={() => handlePointHover(point.id)}
            onMouseLeave={() => {
              setActivePoint(null)
              setShowTip(null)
            }}
          />
        ))}

        {showTip && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-all duration-300">
            <Info className="w-4 h-4 text-blue-500" />
            {showTip}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-8">
        <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-700/80 rounded-full shadow-sm">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Training Set (75%)</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-700/80 rounded-full shadow-sm">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Validation Set (25%)</span>
        </div>
      </div>

      <div className="mt-8 bg-white/90 dark:bg-gray-700/90 p-6 rounded-xl shadow-sm">
        <div className="flex items-start gap-4">
          <Target className="w-6 h-6 text-purple-500 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Understanding Validation Data
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Think of validation data as a practice exam that helps us ensure our AI model is learning correctly. 
              While the model learns from the training data (blue dots), we use validation data (green dots) to test 
              its understanding without letting it peek at the answers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}