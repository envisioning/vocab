"use client"
import { useState, useEffect } from "react"
import { Brain, Target, Info, ArrowBigLeft, ArrowBigRight, Crosshair, AlertCircle } from "lucide-react"

interface Point {
  x: number
  y: number
}

interface TooltipState {
  show: boolean
  content: string
}

interface ModelState {
  complexity: number
  predictions: Point[]
  targetPoint: Point
  tooltip: TooltipState
}

const TOOLTIPS = {
  underfitting: "Too simple! The model isn't capturing important patterns in the data.",
  balanced: "Perfect balance between bias and variance. The model generalizes well!",
  overfitting: "Too complex! The model is learning noise instead of true patterns.",
  target: "This is our true target value we're trying to predict",
  predictions: "These dots represent different model predictions. Notice how they spread!",
}

const BiasVarianceDilemma = () => {
  const [model, setModel] = useState<ModelState>({
    complexity: 50,
    predictions: [],
    targetPoint: { x: 50, y: 50 },
    tooltip: { show: false, content: "" }
  })

  useEffect(() => {
    generateRandomPredictions()
    const interval = setInterval(generateRandomPredictions, 2000)
    return () => {
      clearInterval(interval)
      setModel(prev => ({ ...prev, predictions: [], tooltip: { show: false, content: "" } }))
    }
  }, [model.complexity])

  const generateRandomPredictions = () => {
    const spread = (100 - model.complexity) / 2
    const newPredictions: Point[] = Array.from({ length: 12 }, () => ({
      x: model.targetPoint.x + (Math.random() - 0.5) * spread,
      y: model.targetPoint.y + (Math.random() - 0.5) * spread
    }))
    setModel(prev => ({ ...prev, predictions: newPredictions }))
  }

  const handleComplexityChange = (direction: 'increase' | 'decrease') => {
    setModel(prev => ({
      ...prev,
      complexity: Math.max(0, Math.min(100, prev.complexity + (direction === 'increase' ? 10 : -10)))
    }))
  }

  const showTooltip = (content: string) => {
    setModel(prev => ({ ...prev, tooltip: { show: true, content } }))
  }

  const hideTooltip = () => {
    setModel(prev => ({ ...prev, tooltip: { show: false, content: "" } }))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-8">
      <div className="text-white text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Brain className="text-blue-400 w-10 h-10" />
          Bias-Variance Dilemma
        </h2>
        <p className="text-gray-300 max-w-xl text-lg">
          Explore how model complexity affects predictions
          <Info 
            className="inline ml-2 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors duration-300"
            onMouseEnter={() => showTooltip(TOOLTIPS.predictions)}
            onMouseLeave={hideTooltip}
          />
        </p>
      </div>

      <div className="relative w-96 h-96 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl mb-8 shadow-xl border border-gray-600">
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${model.targetPoint.x}%`, top: `${model.targetPoint.y}%` }}>
          <Target 
            className="text-red-500 w-10 h-10 animate-pulse cursor-help"
            onMouseEnter={() => showTooltip(TOOLTIPS.target)}
            onMouseLeave={hideTooltip}
          />
        </div>

        {model.predictions.map((point, idx) => (
          <div
            key={idx}
            className="absolute w-4 h-4 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 shadow-lg"
            style={{ 
              left: `${point.x}%`, 
              top: `${point.y}%`,
              opacity: 0.6 + (idx / 20)
            }}
          />
        ))}

        {model.tooltip.show && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-3 rounded-lg shadow-xl z-10 max-w-xs text-center">
            {model.tooltip.content}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 text-white">
          <button
            onClick={() => handleComplexityChange('decrease')}
            className="p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg"
          >
            <ArrowBigLeft />
          </button>
          
          <div className="w-64 bg-gray-700 h-6 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-300"
              style={{ width: `${model.complexity}%` }}
            />
          </div>

          <button
            onClick={() => handleComplexityChange('increase')}
            className="p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg"
          >
            <ArrowBigRight />
          </button>
        </div>

        <div className="relative text-center text-white">
          <p className="text-xl font-semibold flex items-center gap-2 justify-center">
            <AlertCircle className="w-5 h-5" />
            {model.complexity < 30 ? "High Bias (Underfitting)" :
             model.complexity > 70 ? "High Variance (Overfitting)" :
             "Optimal Balance! 🎯"}
          </p>
          <p className="text-gray-300 mt-2">
            {model.complexity < 30 ? TOOLTIPS.underfitting :
             model.complexity > 70 ? TOOLTIPS.overfitting :
             TOOLTIPS.balanced}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BiasVarianceDilemma