"use client"
import { useState, useEffect } from "react"
import { Circle, Square, Triangle, Brain, Info, ArrowRight, Check, AlertCircle } from "lucide-react"

interface ComponentProps {}

type Shape = {
  id: number
  type: "circle" | "square" | "triangle"
  isClassified: boolean
  label: string
}

type Phase = "intro" | "training" | "testing" | "complete"

const TRAINING_SHAPES: Shape[] = [
  { id: 1, type: "circle", isClassified: false, label: "Red" },
  { id: 2, type: "square", isClassified: false, label: "Red" },
  { id: 3, type: "triangle", isClassified: false, label: "Blue" },
  { id: 4, type: "circle", isClassified: false, label: "Red" },
  { id: 5, type: "square", isClassified: false, label: "Red" }
]

const TESTING_SHAPES: Shape[] = [
  { id: 6, type: "triangle", isClassified: false, label: "Blue" },
  { id: 7, type: "square", isClassified: false, label: "Red" },
  { id: 8, type: "circle", isClassified: false, label: "Red" }
]

export default function SupervisedClassifier({}: ComponentProps) {
  const [phase, setPhase] = useState<Phase>("intro")
  const [shapes, setShapes] = useState<Shape[]>(TRAINING_SHAPES)
  const [score, setScore] = useState(0)
  const [showTooltip, setShowTooltip] = useState("")

  useEffect(() => {
    if (phase === "testing") {
      setShapes(TESTING_SHAPES)
      setScore(0)
    }
    return () => setShowTooltip("")
  }, [phase])

  const handleClassify = (shapeId: number, prediction: string) => {
    const shape = shapes.find(s => s.id === shapeId)
    if (!shape || shape.isClassified) return

    const isCorrect = prediction === shape.label
    if (isCorrect) setScore(prev => prev + 1)

    setShapes(prev => prev.map(s => 
      s.id === shapeId ? {...s, isClassified: true} : s
    ))

    if (shapes.every(s => s.isClassified)) {
      setPhase(phase === "training" ? "testing" : "complete")
    }
  }

  const renderShape = (shape: Shape) => {
    const commonProps = {
      className: `w-16 h-16 ${
        shape.isClassified 
          ? "text-green-500"
          : "text-blue-500"
      } transition-all duration-300 hover:scale-110`
    }

    switch (shape.type) {
      case "circle": return <Circle {...commonProps} />
      case "square": return <Square {...commonProps} />
      case "triangle": return <Triangle {...commonProps} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-6 relative">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Supervised Learning Classifier
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Train an AI to recognize patterns
            </p>
            <Info
              className="w-5 h-5 text-blue-500 cursor-help"
              onMouseEnter={() => setShowTooltip("info")}
              onMouseLeave={() => setShowTooltip("")}
            />
          </div>
          
          {showTooltip === "info" && (
            <div className="absolute z-10 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg max-w-md mx-auto left-0 right-0 text-sm">
              A supervised classifier learns from labeled examples to make predictions on new data
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {shapes.map(shape => (
              <div key={shape.id} className="relative">
                {renderShape(shape)}
                {shape.isClassified && (
                  <Check className="absolute -top-2 -right-2 w-6 h-6 text-green-500" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                const unclassified = shapes.find(s => !s.isClassified)
                if (unclassified) handleClassify(unclassified.id, "Red")
              }}
              className="group p-4 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 rounded-xl flex items-center justify-center space-x-3 hover:shadow-md transition-all duration-300"
            >
              <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                Predict Red
              </span>
              <ArrowRight className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <button
              onClick={() => {
                const unclassified = shapes.find(s => !s.isClassified)
                if (unclassified) handleClassify(unclassified.id, "Blue")
              }}
              className="group p-4 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-xl flex items-center justify-center space-x-3 hover:shadow-md transition-all duration-300"
            >
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                Predict Blue
              </span>
              <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {phase === "complete" && (
          <div className="text-center bg-green-100 dark:bg-green-900 p-6 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
              Classification Complete!
            </h2>
            <p className="text-green-600 dark:text-green-400">
              Final Score: {score}/{TESTING_SHAPES.length}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}