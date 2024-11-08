"use client"
import { useState, useEffect } from 'react'
import { 
  ImageIcon,
  BrainIcon, 
  CheckIcon,
  SmileIcon,
  FrownIcon,
  CloudSunIcon,
  UmbrellaIcon,
  RefreshCwIcon, 
  PlayIcon,
  RotateCcwIcon,
  SparklesIcon
} from 'lucide-react'

interface TrainingExample {
  id: number
  type: 'sunny' | 'rainy'
  icon: typeof CloudSunIcon | typeof UmbrellaIcon
  prediction?: 'happy' | 'sad'
  trained: boolean
}

const INITIAL_EXAMPLES: TrainingExample[] = [
  { id: 1, type: 'sunny', icon: CloudSunIcon, trained: false },
  { id: 2, type: 'rainy', icon: UmbrellaIcon, trained: false },
  { id: 3, type: 'sunny', icon: CloudSunIcon, trained: false },
  { id: 4, type: 'sunny', icon: CloudSunIcon, trained: false },
  { id: 5, type: 'rainy', icon: UmbrellaIcon, trained: false },
  { id: 6, type: 'rainy', icon: UmbrellaIcon, trained: false }
]

const TrainingDataDemo = () => {
  const [examples, setExamples] = useState<TrainingExample[]>(INITIAL_EXAMPLES)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [modelAccuracy, setModelAccuracy] = useState<number>(0)
  const [isTraining, setIsTraining] = useState<boolean>(false)
  const [stage, setStage] = useState<'intro' | 'training' | 'complete'>('intro')

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTraining) {
      interval = setInterval(() => {
        setExamples(prev => {
          const updated = [...prev]
          if (currentIndex < updated.length) {
            updated[currentIndex].trained = true
            updated[currentIndex].prediction = 
              updated[currentIndex].type === 'sunny' ? 'happy' : 'sad'
          }
          return updated
        })

        setCurrentIndex(prev => {
          if (prev < examples.length - 1) {
            return prev + 1
          }
          setIsTraining(false)
          setStage('complete')
          return prev
        })

        setModelAccuracy(prev => 
          Math.min(prev + Math.random() * 15 + 5, 98)
        )
      }, 1200)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isTraining, currentIndex, examples.length])

  const handleReset = () => {
    setExamples(INITIAL_EXAMPLES)
    setCurrentIndex(0)
    setModelAccuracy(0)
    setIsTraining(false)
    setStage('intro')
  }

  const handleStartTraining = () => {
    if (!isTraining) {
      setIsTraining(true)
      setStage('training')
    }
  }

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
            <BrainIcon className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            <span>AI Training Data Playground</span>
            <SparklesIcon className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 animate-pulse" />
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Watch how AI learns to predict mood based on weather! 🌞 = 😊 | 🌧️ = ☹️
          </p>
        </div>

        {/* Main Content */}
        <div className="relative">
          {/* Progress Bar */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center text-sm md:text-base">
              <span className="text-gray-600 dark:text-gray-300">Learning Progress</span>
              <span className="font-medium text-blue-500">{Math.round(modelAccuracy)}%</span>
            </div>
            <div className="h-2 md:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${modelAccuracy}%` }}
              />
            </div>
          </div>

          {/* Training Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
            {examples.map((example, index) => {
              const Icon = example.icon
              return (
                <div
                  key={example.id}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300
                    ${index === currentIndex && isTraining 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' 
                      : example.trained 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                      : 'border-gray-200 dark:border-gray-700'}
                    ${isTraining && index === currentIndex ? 'scale-105' : 'scale-100'}
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon 
                      className={`w-8 h-8 md:w-10 md:h-10 
                        ${example.type === 'sunny' ? 'text-yellow-500' : 'text-blue-500'}`}
                    />
                    {example.trained && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm md:text-base">→</span>
                        {example.prediction === 'happy' 
                          ? <SmileIcon className="w-6 h-6 text-green-500" />
                          : <FrownIcon className="w-6 h-6 text-blue-500" />
                        }
                      </div>
                    )}
                  </div>
                  {index === currentIndex && isTraining && (
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartTraining}
              disabled={isTraining || stage === 'complete'}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base
                ${isTraining || stage === 'complete'
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'} 
                text-white transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              {isTraining ? (
                <>
                  <RefreshCwIcon className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                  Training in Progress...
                </>
              ) : stage === 'complete' ? (
                <>
                  <CheckIcon className="w-4 h-4 md:w-5 md:h-5" />
                  Training Complete!
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4 md:w-5 md:h-5" />
                  Start Training
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base
                border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 
                text-gray-600 dark:text-gray-300 transition-all duration-300"
            >
              <RotateCcwIcon className="w-4 h-4 md:w-5 md:h-5" />
              Reset
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-6 space-y-2 text-sm md:text-base">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> How Training Data Works:
            </h3>
            <ul className="space-y-2 text-blue-700 dark:text-blue-300">
              <li>• The AI learns from labeled examples (weather → mood patterns)</li>
              <li>• Each example helps improve prediction accuracy</li>
              <li>• More diverse training data = better AI performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainingDataDemo