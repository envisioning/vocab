"use client"
import { useState } from 'react'
import {
  Brain,
  Bot,
  Sparkles,
  ArrowRight,
  Plus,
  Book,
  Binary,
  LineChart,
  Maximize2,
  CircleDot
} from 'lucide-react'

interface Vector {
  x: number
  y: number
}

interface VectorOperation {
  type: 'add' | 'dot'
  vectors: [Vector, Vector]
  result: Vector | number
}

const GRID_SIZE = 200
const SCALE = 20

const VectorOperationsDemo = () => {
  const [activeOperation, setActiveOperation] = useState<VectorOperation>({
    type: 'add',
    vectors: [
      { x: 2, y: 1 },
      { x: 1, y: 2 }
    ],
    result: { x: 3, y: 3 }
  })

  const vectorAdd = (v1: Vector, v2: Vector): Vector => ({
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  })

  const vectorDot = (v1: Vector, v2: Vector): number => 
    v1.x * v2.x + v1.y * v2.y

  const toggleOperation = () => {
    setActiveOperation(prev => {
      const newType = prev.type === 'add' ? 'dot' : 'add'
      return {
        type: newType,
        vectors: prev.vectors,
        result: newType === 'add'
          ? vectorAdd(prev.vectors[0], prev.vectors[1])
          : vectorDot(prev.vectors[0], prev.vectors[1])
      }
    })
  }

  const VectorGrid = ({ vector, color, label }: { vector: Vector, color: string, label: string }) => {
    const arrowX = vector.x * SCALE
    const arrowY = -vector.y * SCALE // Negative because SVG y-axis is inverted
    const endX = GRID_SIZE/2 + arrowX
    const endY = GRID_SIZE/2 + arrowY

    // Calculate position for the coordinate label
    // Offset slightly from the arrow end
    const labelOffsetX = 10
    const labelOffsetY = 10
    const labelX = endX + (endX > GRID_SIZE/2 ? labelOffsetX : -labelOffsetX)
    const labelY = endY + (endY > GRID_SIZE/2 ? labelOffsetY : -labelOffsetY)

    return (
      <g>
        <line
          x1={GRID_SIZE/2}
          y1={GRID_SIZE/2}
          x2={endX}
          y2={endY}
          stroke={color}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <circle
          cx={endX}
          cy={endY}
          r="3"
          fill={color}
        />
        {/* Vector Label */}
        <g className="vector-label" style={{ color }}>
          <rect
            x={labelX - 35}
            y={labelY - 7}
            width="70"
            height="14"
            rx="4"
            fill="white"
            className="dark:fill-gray-700"
            stroke={color}
            strokeWidth="1"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            fontSize="10"
            fontFamily="monospace"
          >
            {label}: ({vector.x}, {vector.y})
          </text>
        </g>
      </g>
    )
  }

  const InfoCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md">
      <h3 className="text-base md:text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800 dark:text-white">
        <Book className="w-4 h-4 md:w-5 md:h-5" />
        {title}
      </h3>
      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {children}
      </p>
    </div>
  )

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10">
          <Brain className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Vector Operations in AI
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fundamental mathematical operations for AI computations
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md">
            <svg width={GRID_SIZE} height={GRID_SIZE} className="mx-auto">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="6"
                  markerHeight="5"
                  refX="6"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0, 6 2.5, 0 5" fill="currentColor" />
                </marker>
              </defs>
              {/* Grid Lines */}
              <g className="grid-lines">
                {[...Array(11)].map((_, i) => (
                  <g key={i}>
                    <line
                      x1={i * (GRID_SIZE/10)}
                      y1="0"
                      x2={i * (GRID_SIZE/10)}
                      y2={GRID_SIZE}
                      className="stroke-gray-200 dark:stroke-gray-600"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1={i * (GRID_SIZE/10)}
                      x2={GRID_SIZE}
                      y2={i * (GRID_SIZE/10)}
                      className="stroke-gray-200 dark:stroke-gray-600"
                      strokeWidth="1"
                    />
                  </g>
                ))}
              </g>
              {/* Axes */}
              <line
                x1="0"
                y1={GRID_SIZE/2}
                x2={GRID_SIZE}
                y2={GRID_SIZE/2}
                className="stroke-gray-400 dark:stroke-gray-500"
                strokeWidth="1.5"
              />
              <line
                x1={GRID_SIZE/2}
                y1="0"
                x2={GRID_SIZE/2}
                y2={GRID_SIZE}
                className="stroke-gray-400 dark:stroke-gray-500"
                strokeWidth="1.5"
              />
              <VectorGrid vector={activeOperation.vectors[0]} color="#3B82F6" label="v₁" />
              <VectorGrid vector={activeOperation.vectors[1]} color="#10B981" label="v₂" />
              {activeOperation.type === 'add' && typeof activeOperation.result !== 'number' && (
                <VectorGrid vector={activeOperation.result} color="#EC4899" label="sum" />
              )}
            </svg>
          </div>

          <button
            onClick={toggleOperation}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {activeOperation.type === 'add' ? <Plus className="w-4 h-4" /> : <CircleDot className="w-4 h-4" />}
            Switch to {activeOperation.type === 'add' ? 'Dot Product' : 'Addition'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <span className="text-lg font-semibold dark:text-white">
              {activeOperation.type === 'add' ? 'Vector Addition' : 'Dot Product'}
            </span>
          </div>

          <InfoCard title="What's happening?">
            {activeOperation.type === 'add' 
              ? "We're adding two vectors (v₁ + v₂) by combining their components. The pink vector shows the result! Notice how it forms the diagonal of the parallelogram."
              : "We're calculating how similar these vectors are by multiplying corresponding components (v₁·v₂ = x₁x₂ + y₁y₂) and summing them up."}
          </InfoCard>

          <InfoCard title="Why is this important?">
            {activeOperation.type === 'add'
              ? "In AI, vector addition helps combine features or update weights in neural networks during training. For example, when updating weights: w_new = w_old + learning_rate * gradient"
              : "Dot products help measure similarity between data points, crucial for many AI algorithms. In neural networks, dot products between inputs and weights determine neuron activations."}
          </InfoCard>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Binary className="w-5 h-5 text-blue-500" />
              <span className="font-mono text-sm dark:text-white">Result:</span>
            </div>
            {typeof activeOperation.result === 'number' ? (
              <div className="flex items-center gap-2 text-green-500">
                <Sparkles className="w-5 h-5" />
                <span className="font-mono text-lg">{activeOperation.result}</span>
              </div>
            ) : (
              <div className="font-mono text-sm dark:text-white">
                [{activeOperation.result.x}, {activeOperation.result.y}]
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VectorOperationsDemo