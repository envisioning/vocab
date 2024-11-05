"use client"
import { useState, useEffect } from "react"
import { ArrowRight, Plus, X, Divide, RotateCcw, ArrowUpRight, Info } from "lucide-react"

interface VectorOperationsProps {}

type Vector = {
  x: number
  y: number
  color: string
}

const VectorOperations: React.FC<VectorOperationsProps> = () => {
  const [vectors, setVectors] = useState<Vector[]>([
    { x: 2, y: 1, color: "#3B82F6" },
    { x: 1, y: 2, color: "#22C55E" }
  ])
  
  const [operation, setOperation] = useState<"add" | "subtract" | "multiply" | "reset">("add")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const gridSize = 300
  const scale = 40

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  const vectorToPoint = (vector: Vector) => ({
    x: vector.x * scale + gridSize/2,
    y: gridSize/2 - vector.y * scale
  })

  const performOperation = (op: "add" | "subtract" | "multiply" | "reset") => {
    setOperation(op)
    setIsAnimating(true)

    const v1 = vectors[0]
    const v2 = vectors[1]
    
    if (op === "reset") {
      setVectors([
        { x: 2, y: 1, color: "#3B82F6" },
        { x: 1, y: 2, color: "#22C55E" }
      ])
      return
    }

    const operations = {
      add: { x: v1.x + v2.x, y: v1.y + v2.y },
      subtract: { x: v1.x - v2.x, y: v1.y - v2.y },
      multiply: { x: v1.x * v2.x, y: v1.y * v2.y }
    }

    const result = { ...operations[op], color: "#6B7280" }
    setVectors([...vectors.slice(0,2), result])
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="relative mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white text-center">
          Vector Operations in AI
        </h1>
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="absolute -right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-300"
        >
          <Info size={20} />
        </button>
      </div>

      {showTooltip && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6 max-w-md text-sm">
          <p className="text-gray-600 dark:text-gray-300">
            Vectors are fundamental in AI for representing data points, features, and mathematical transformations. 
            These operations help in data preprocessing, neural network calculations, and algorithm optimization.
          </p>
        </div>
      )}

      <div className="relative w-[300px] h-[300px] mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
          {Array.from({length: 64}).map((_, i) => (
            <div key={i} className="border border-gray-100 dark:border-gray-800" />
          ))}
        </div>

        {vectors.map((vector, i) => {
          const point = vectorToPoint(vector)
          return (
            <svg key={i} className="absolute inset-0">
              <defs>
                <marker
                  id={`arrowhead-${i}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill={vector.color}
                  />
                </marker>
              </defs>
              <line
                x1={gridSize/2}
                y1={gridSize/2}
                x2={point.x}
                y2={point.y}
                stroke={vector.color}
                strokeWidth="2"
                markerEnd={`url(#arrowhead-${i})`}
                className={`transition-all duration-500 ${isAnimating ? 'scale-110' : ''}`}
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0,1000;1000,0"
                  dur="1s"
                  begin="0s"
                  fill="freeze"
                />
              </line>
            </svg>
          )
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[
          { op: "add", icon: Plus, label: "Add", color: "blue" },
          { op: "subtract", icon: X, label: "Subtract", color: "green" },
          { op: "multiply", icon: Divide, label: "Multiply", color: "gray" },
          { op: "reset", icon: RotateCcw, label: "Reset", color: "red" }
        ].map(({ op, icon: Icon, label, color }) => (
          <button
            key={op}
            onClick={() => performOperation(op as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-${color}-500 text-white hover:bg-${color}-600 transition-all duration-300 transform hover:scale-105`}
          >
            <Icon size={20} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="text-gray-600 dark:text-gray-300 text-center max-w-md space-y-3">
        <p className="text-sm sm:text-base">Experiment with vector operations commonly used in AI algorithms!</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            Vector 1: ({vectors[0].x}, {vectors[0].y})
          </div>
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            Vector 2: ({vectors[1].x}, {vectors[1].y})
          </div>
        </div>
        {vectors.length > 2 && (
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/30">
            Result: ({vectors[2].x}, {vectors[2].y})
          </div>
        )}
      </div>
    </div>
  )
}

export default VectorOperations