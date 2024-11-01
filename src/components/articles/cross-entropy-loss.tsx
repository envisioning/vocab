"use client"
import { useState, useEffect } from "react"
import { Brain, Target, ArrowRight, HelpCircle, Sparkles, BarChart3 } from "lucide-react"

interface PredictionType {
  actual: number
  predicted: number[]
  loss: number
  explanation: string
}

const CrossEntropyDemo = () => {
  const [predictions, setPredictions] = useState<PredictionType[]>([
    { 
      actual: 0, 
      predicted: [0.9, 0.05, 0.05], 
      loss: 0.15,
      explanation: "Excellent prediction! The model is very confident about the cat."
    },
    { 
      actual: 1, 
      predicted: [0.3, 0.6, 0.1], 
      loss: 0.51,
      explanation: "Moderate uncertainty. The model leans towards dog but isn't completely sure."
    },
    { 
      actual: 2, 
      predicted: [0.2, 0.2, 0.6], 
      loss: 0.51,
      explanation: "Some confusion present. The model needs more training to be more confident."
    }
  ])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  const labels = ["🐱 Cat", "🐶 Dog", "🐦 Bird"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % predictions.length)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getLossIndicator = (loss: number): string => {
    if (loss < 0.3) return "bg-gradient-to-r from-green-400 to-emerald-500"
    if (loss < 0.6) return "bg-gradient-to-r from-yellow-400 to-orange-500"
    return "bg-gradient-to-r from-red-400 to-rose-500"
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl">
      <div className="text-center mb-6 md:mb-8 relative">
        <div className="inline-flex items-center gap-2">
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Cross Entropy Loss Explorer
          </h2>
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        {showTooltip && (
          <div className="absolute z-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm max-w-xs mx-auto mt-2 left-1/2 transform -translate-x-1/2">
            Cross entropy loss helps measure how accurate our AI model's predictions are compared to reality. Lower values mean better predictions!
          </div>
        )}
      </div>

      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex-1 text-center transform hover:scale-105 transition-transform duration-300">
            <Brain className="w-12 h-12 mx-auto mb-2 text-blue-500" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Neural Network</p>
          </div>
          <ArrowRight className="w-8 h-8 text-blue-400 animate-pulse" />
          <div className="flex-1 text-center transform hover:scale-105 transition-transform duration-300">
            <Target className="w-12 h-12 mx-auto mb-2 text-purple-500" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Prediction</p>
          </div>
        </div>

        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                Actual: {labels[predictions[currentIndex].actual]}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {predictions[currentIndex].predicted.map((prob, idx) => (
              <div key={idx} className="relative group">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {labels[idx]}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 transform origin-left ${getLossIndicator(predictions[currentIndex].loss)}`}
                    style={{ width: `${prob * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loss Score:</span>
                <span className={`text-lg font-bold ${getLossIndicator(predictions[currentIndex].loss)} bg-clip-text text-transparent`}>
                  {predictions[currentIndex].loss.toFixed(2)}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                {predictions[currentIndex].explanation}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrossEntropyDemo