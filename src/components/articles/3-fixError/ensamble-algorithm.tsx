"use client"
import { useState, useEffect } from "react"
import { Brain, TreePine, Mountain, Building2, Check, X, HelpCircle, ArrowRight } from "lucide-react"

interface EnsembleProps {}

type Prediction = {
  model: string
  icon: React.ReactNode
  vote: boolean
  confidence: number
  description: string
}

const MODELS: Prediction[] = [
  {
    model: "Decision Tree",
    icon: <TreePine className="w-10 h-10 text-emerald-500" />,
    vote: true,
    confidence: 0.7,
    description: "Makes decisions by following a tree-like path of questions"
  },
  {
    model: "Neural Network",
    icon: <Brain className="w-10 h-10 text-purple-500" />,
    vote: true,
    confidence: 0.8,
    description: "Processes information like human brain neurons"
  },
  {
    model: "SVM",
    icon: <Mountain className="w-10 h-10 text-blue-500" />,
    vote: false,
    confidence: 0.6,
    description: "Finds the best boundary between different data groups"
  },
  {
    model: "Random Forest",
    icon: <Building2 className="w-10 h-10 text-orange-500" />,
    vote: true,
    confidence: 0.9,
    description: "Combines multiple decision trees for better predictions"
  }
]

export default function EnsembleLearning({}: EnsembleProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isVoting, setIsVoting] = useState(false)
  const [finalPrediction, setFinalPrediction] = useState<boolean | null>(null)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  useEffect(() => {
    setPredictions(MODELS)
    return () => setPredictions([])
  }, [])

  useEffect(() => {
    if (isVoting) {
      const timer = setTimeout(() => {
        const votes = predictions.map(p => p.vote)
        const trueVotes = votes.filter(v => v).length
        setFinalPrediction(trueVotes > votes.length / 2)
        setIsVoting(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVoting, predictions])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 rounded-2xl shadow-xl">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ensemble Learning: The AI Democracy
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Multiple AI models collaborate to make smarter decisions together
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {predictions.map((model) => (
          <div
            key={model.model}
            className={`relative p-6 rounded-xl backdrop-blur-sm transition-all duration-500 transform hover:scale-105
              ${isVoting ? "animate-pulse" : ""}
              ${finalPrediction !== null
                ? model.vote === finalPrediction
                  ? "bg-green-100/80 dark:bg-green-800/80 shadow-green-500/20 shadow-lg"
                  : "opacity-50"
                : "bg-white/80 dark:bg-gray-800/80 shadow-lg"
              }`}
            onMouseEnter={() => setHoveredModel(model.model)}
            onMouseLeave={() => setHoveredModel(null)}
          >
            <div className="flex flex-col items-center space-y-4">
              {model.icon}
              <span className="text-lg font-medium text-gray-800 dark:text-white">
                {model.model}
              </span>
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200">
                  {(model.confidence * 100).toFixed(0)}% confident
                </div>
                {model.vote ? (
                  <Check className="w-6 h-6 text-green-500" />
                ) : (
                  <X className="w-6 h-6 text-red-500" />
                )}
              </div>
            </div>
            {hoveredModel === model.model && (
              <div className="absolute -top-12 left-0 right-0 mx-auto w-48 p-2 bg-black/90 text-white text-sm rounded-lg z-10">
                {model.description}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/90 rotate-45" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-6">
        <button
          onClick={() => {
            setIsVoting(true)
            setFinalPrediction(null)
          }}
          disabled={isVoting}
          className={`group px-8 py-4 rounded-full font-semibold text-white text-lg
            transition-all duration-300 transform hover:scale-105 hover:shadow-xl
            ${isVoting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            }`}
        >
          <span className="flex items-center space-x-2">
            {isVoting ? "Models are voting..." : "Start Ensemble Vote"}
            <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isVoting ? "" : "group-hover:translate-x-2"}`} />
          </span>
        </button>

        {finalPrediction !== null && (
          <div className="text-xl font-medium animate-fade-in p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-lg">
            <span className="text-gray-700 dark:text-gray-200">Final Prediction: </span>
            <span className={finalPrediction ? "text-green-500" : "text-red-500"}>
              {finalPrediction ? "Yes" : "No"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}