"use client"
import { useState, useEffect } from "react"
import { Circle, Divide, Shapes, SeparatorHorizontal, HelpCircle, ArrowRight } from "lucide-react"

interface ComponentProps {}

type Point = {
  x: number
  y: number
  class: "A" | "B"
  label: string
}

const INITIAL_POINTS: Point[] = [
  { x: 30, y: 30, class: "A", label: "Cats" },
  { x: 70, y: 40, class: "A", label: "Dogs" },
  { x: 40, y: 60, class: "A", label: "Birds" },
  { x: 140, y: 120, class: "B", label: "Fish" },
  { x: 160, y: 140, class: "B", label: "Snakes" },
  { x: 180, y: 130, class: "B", label: "Lizards" }
]

export default function DiscriminativeAI({}: ComponentProps) {
  const [points, setPoints] = useState<Point[]>(INITIAL_POINTS)
  const [boundary, setBoundary] = useState<number>(100)
  const [isLearning, setIsLearning] = useState(false)
  const [step, setStep] = useState(0)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  useEffect(() => {
    if (!isLearning) return
    
    const interval = setInterval(() => {
      setBoundary(prev => {
        const newBoundary = prev + (Math.random() * 10 - 5)
        return Math.min(Math.max(newBoundary, 80), 120)
      })
      setStep(prev => prev + 1)
      
      if (step > 20) {
        setIsLearning(false)
        setStep(0)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [isLearning, step])

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 rounded-xl max-w-4xl mx-auto shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Discriminative AI
        </h2>
        <div className="relative">
          <HelpCircle 
            className="w-5 h-5 text-blue-500 cursor-help"
            onMouseEnter={() => setShowTooltip(1)}
            onMouseLeave={() => setShowTooltip(null)}
          />
          {showTooltip === 1 && (
            <div className="absolute z-10 w-64 p-3 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg -right-2 top-8">
              Discriminative AI learns to separate different types of data, like telling apart cats from dogs!
            </div>
          )}
        </div>
      </div>
      
      <div className="relative w-full sm:w-[400px] h-[300px] bg-white dark:bg-gray-700 rounded-2xl shadow-2xl mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/20 dark:to-purple-900/20" />
        
        <div 
          className="absolute w-full h-1.5 bg-blue-500/70 shadow-lg transition-all duration-500 transform"
          style={{ top: `${boundary}px` }}
        />

        {points.map((point, i) => (
          <div key={i} className="relative group">
            <div
              className={`absolute w-6 h-6 rounded-full transition-all duration-300 
                ${point.class === "A" 
                  ? "bg-green-500 shadow-green-500/50" 
                  : "bg-red-500 shadow-red-500/50"
                } shadow-lg cursor-help`}
              style={{
                left: `${point.x}px`,
                top: `${point.y}px`
              }}
              onMouseEnter={() => setShowTooltip(i + 2)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              {showTooltip === i + 2 && (
                <div className="absolute z-20 w-32 p-2 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl -right-16 top-8">
                  {point.label}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-b-white dark:border-b-gray-800" />
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
          <Shapes className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">Land Animals</span>
        </div>
        
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
          <Circle className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium">Water Animals</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-lg">
        <p className="text-gray-600 dark:text-gray-300 text-center text-lg leading-relaxed">
          Watch as our AI learns to draw a boundary between land and water animals! 
          <br />
          <span className="text-blue-500 font-medium">Click start to see the magic happen!</span>
        </p>

        <button
          onClick={() => !isLearning && setIsLearning(true)}
          disabled={isLearning}
          className={`
            group px-8 py-4 rounded-full font-bold text-lg
            ${isLearning
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
            }
            text-white transition-all duration-300 transform hover:scale-105
            shadow-lg hover:shadow-xl
          `}
        >
          {isLearning ? (
            <span className="flex items-center gap-3">
              <Divide className="w-6 h-6 animate-spin" />
              Learning in Progress...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              Start Learning!
            </span>
          )}
        </button>
      </div>
    </div>
  )
}