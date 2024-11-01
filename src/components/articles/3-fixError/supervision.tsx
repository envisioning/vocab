"use client"
import { useState, useEffect } from "react"
import { Brain, Check, X, Info, ArrowRight, Target, Book, Sparkles } from "lucide-react"

interface SupervisionProps {}

type TrainingExample = {
  id: number
  input: string
  label: "cat" | "dog"
  isCorrect: boolean
  hint: string
}

const TRAINING_DATA: TrainingExample[] = [
  { id: 1, input: "🐱", label: "cat", isCorrect: false, hint: "Pointed ears, whiskers" },
  { id: 2, input: "🐕", label: "dog", isCorrect: false, hint: "Floppy ears, wagging tail" },
  { id: 3, input: "🐈", label: "cat", isCorrect: false, hint: "Graceful posture, long tail" },
  { id: 4, input: "🐩", label: "dog", isCorrect: false, hint: "Curly fur, barking" }
]

export default function SupervisionDemo({}: SupervisionProps) {
  const [examples, setExamples] = useState<TrainingExample[]>(TRAINING_DATA)
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [showHint, setShowHint] = useState<number | null>(null)

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsTraining(false)
            return 100
          }
          return prev + 10
        })
      }, 300)
      return () => clearInterval(interval)
    }
  }, [isTraining])

  useEffect(() => {
    if (progress === 100) {
      const correct = examples.filter(d => d.isCorrect).length
      setAccuracy((correct / examples.length) * 100)
    }
  }, [progress, examples])

  const handleTrain = () => {
    setIsTraining(true)
    setProgress(0)
    setExamples(prev =>
      prev.map(item => ({
        ...item,
        isCorrect: Math.random() > 0.2
      }))
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8 space-y-8">
      <div className="text-4xl font-bold text-gray-800 mb-4 flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg">
        <Brain className="text-blue-500" size={40} />
        <span>Supervised Learning Lab</span>
        <Sparkles className="text-blue-400" size={32} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100">
          <div className="flex items-center gap-2 mb-6">
            <Book className="text-blue-500" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800">Training Dataset</h2>
          </div>
          <div className="space-y-4">
            {examples.map(item => (
              <div
                key={item.id}
                className="relative group"
                onMouseEnter={() => setShowHint(item.id)}
                onMouseLeave={() => setShowHint(null)}
              >
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
                  <span className="text-3xl">{item.input}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium">Label: {item.label}</span>
                    {progress === 100 && (
                      item.isCorrect ? 
                        <Check className="text-green-500" size={24} /> :
                        <X className="text-red-500" size={24} />
                    )}
                  </div>
                </div>
                {showHint === item.id && (
                  <div className="absolute -top-12 left-0 right-0 bg-blue-500 text-white p-2 rounded-lg text-sm shadow-lg">
                    {item.hint}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="border-8 border-transparent border-t-blue-500" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100">
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-blue-500" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800">Training Progress</h2>
          </div>
          
          <div className="space-y-8">
            <div className="relative pt-1">
              <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                <div
                  style={{ width: `${progress}%` }}
                  className="transition-all duration-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 rounded-full"
                />
              </div>
            </div>

            {progress === 100 && (
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {accuracy.toFixed(1)}% Accuracy
                </div>
                <p className="text-gray-700">
                  The model has learned to distinguish cats from dogs!
                </p>
              </div>
            )}

            <button
              onClick={handleTrain}
              disabled={isTraining}
              className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300
                ${isTraining 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-lg hover:shadow-xl'}
              `}
            >
              {isTraining ? 'Training in Progress...' : 'Start Training'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-full shadow-md">
        <Info size={20} className="text-blue-500" />
        <span>Hover over examples to see key features the model learns from!</span>
      </div>
    </div>
  )
}