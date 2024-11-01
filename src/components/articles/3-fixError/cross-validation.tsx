"use client"
import { useState, useEffect } from "react"
import { Split, Folder, FolderCheck, Book, Brain, CheckCircle2, Info, HelpCircle } from "lucide-react"

interface DataPoint {
  id: number
  x: number
  y: number
  fold: number
}

interface TooltipProps {
  text: string
  position: "top" | "bottom"
}

const Tooltip = ({ text, position }: TooltipProps) => (
  <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50`}>
    {text}
    <div className={`absolute ${position === 'top' ? 'bottom-0 -mb-1' : 'top-0 -mt-1'} left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45`}></div>
  </div>
)

const CrossValidationDemo = () => {
  const [currentFold, setCurrentFold] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
  const [accuracy, setAccuracy] = useState<number>(0)

  useEffect(() => {
    const points: DataPoint[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      fold: Math.floor(i / 5)
    }))
    setDataPoints(points)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFold(prev => (prev + 1) % 5)
        setAccuracy(Math.random() * 15 + 80) // Simulated accuracy between 80-95%
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl">
      <div className="text-center mb-8 relative">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
          Cross Validation Explorer
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover how machine learning models validate their performance using k-fold cross validation
        </p>
        <div className="absolute top-0 right-4 group">
          <HelpCircle className="w-6 h-6 text-blue-500 cursor-help" />
          <Tooltip text="Cross validation helps ensure our model performs well on unseen data by testing it on different data subsets" position="top" />
        </div>
      </div>

      <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl mb-6 overflow-hidden shadow-inner">
        {dataPoints.map((point) => (
          <div
            key={point.id}
            className={`absolute w-5 h-5 rounded-full transition-all duration-500 transform hover:scale-150 ${
              point.fold === currentFold
                ? "bg-blue-500 shadow-lg shadow-blue-500/50"
                : "bg-green-500 shadow-lg shadow-green-500/50"
            }`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
          />
        ))}

        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <Split className="w-6 h-6 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              Fold {currentFold + 1} of 5
            </span>
            <span className="text-sm text-blue-500">
              Accuracy: {accuracy.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <div className="group relative flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-3 shadow-lg shadow-green-500/50" />
          <span className="text-gray-700 dark:text-gray-200 font-medium">Training Data</span>
          <Tooltip text="Data used to teach the model patterns" position="bottom" />
        </div>
        <div className="group relative flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 shadow-lg shadow-blue-500/50" />
          <span className="text-gray-700 dark:text-gray-200 font-medium">Testing Data</span>
          <Tooltip text="Data used to evaluate model performance" position="bottom" />
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105 ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50"
          }`}
        >
          {isPlaying ? "Pause Validation" : "Start Validation"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Brain className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Training Phase</h3>
          <p className="text-gray-600 dark:text-gray-300">Model learns patterns from the training dataset to make predictions</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CheckCircle2 className="w-8 h-8 text-green-500 mb-3" />
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Validation Phase</h3>
          <p className="text-gray-600 dark:text-gray-300">Model's performance is tested on unseen data to ensure generalization</p>
        </div>
      </div>
    </div>
  )
}

export default CrossValidationDemo