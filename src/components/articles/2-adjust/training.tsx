"use client"
import { useState, useEffect } from "react"
import { Dog, Target, Brain, ChartLine, Circle, Bone, Pen } from "lucide-react"

interface Toy {
  id: string
  name: string
  icon: JSX.Element
  color: string
}

interface TrainingState {
  confidence: { [key: string]: number }
  currentToy: Toy | null
  isThinking: boolean
  attempts: number
  successRate: number
}

const TOYS: Toy[] = [
  { id: "ball", name: "Ball", icon: <Circle />, color: "text-blue-500" },
  { id: "bone", name: "Bone", icon: <Bone />, color: "text-gray-500" },
  { id: "stick", name: "Stick", icon: <Pen />, color: "text-green-500" }
]

export default function AIPetSchool() {
  const [training, setTraining] = useState<TrainingState>({
    confidence: { ball: 0.33, bone: 0.33, stick: 0.33 },
    currentToy: null,
    isThinking: false,
    attempts: 0,
    successRate: 0
  })

  const [draggedToy, setDraggedToy] = useState<Toy | null>(null)

  useEffect(() => {
    if (training.isThinking) {
      const timer = setTimeout(() => {
        const randomChoice = TOYS[Math.floor(Math.random() * TOYS.length)]
        setTraining(prev => ({
          ...prev,
          currentToy: randomChoice,
          isThinking: false
        }))
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [training.isThinking])

  const handleDragStart = (toy: Toy) => {
    setDraggedToy(toy)
  }

  const handleDragEnd = () => {
    setDraggedToy(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedToy) return

    setTraining(prev => ({
      ...prev,
      isThinking: true,
      attempts: prev.attempts + 1
    }))
  }

  const handleFeedback = (correct: boolean) => {
    if (!training.currentToy) return

    setTraining(prev => {
      const newConfidence = { ...prev.confidence }
      const learningRate = 0.1

      if (correct) {
        newConfidence[training.currentToy!.id] += learningRate
        Object.keys(newConfidence).forEach(key => {
          if (key !== training.currentToy!.id) {
            newConfidence[key] -= learningRate / 2
          }
        })
      }

      const newSuccessRate = (prev.successRate * prev.attempts + (correct ? 1 : 0)) / (prev.attempts + 1)

      return {
        ...prev,
        confidence: newConfidence,
        currentToy: null,
        successRate: newSuccessRate
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">AI Pet School</h1>
        <p className="text-gray-600">Train your AI puppy to fetch specific toys!</p>
      </div>

      <div className="flex justify-around items-center p-4 border-2 border-gray-200 rounded-lg">
        {TOYS.map(toy => (
          <div
            key={toy.id}
            draggable
            onDragStart={() => handleDragStart(toy)}
            onDragEnd={handleDragEnd}
            className="flex flex-col items-center cursor-grab"
          >
            <div className={`p-3 rounded-full ${toy.color} bg-opacity-20`}>
              {toy.icon}
            </div>
            <span className="mt-2 text-sm">{toy.name}</span>
            <div className="mt-1 text-xs">
              Confidence: {Math.round(training.confidence[toy.id] * 100)}%
            </div>
          </div>
        ))}
      </div>

      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
      >
        <div className="relative">
          <Dog className="w-16 h-16 text-gray-600" />
          {training.isThinking && (
            <div className="absolute -top-8 left-16 bg-white p-2 rounded-lg shadow-lg">
              <Brain className="w-6 h-6 animate-pulse text-blue-500" />
            </div>
          )}
        </div>
      </div>

      {training.currentToy && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleFeedback(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 duration-300"
          >
            Correct!
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 duration-300"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="text-center">
        <ChartLine className="w-6 h-6 inline-block mr-2" />
        <span>Success Rate: {Math.round(training.successRate * 100)}%</span>
      </div>
    </div>
  )
}