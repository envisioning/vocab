"use client"
import { useState, useEffect } from "react"
import { ArrowRight, Brain, Network, Info, Eye, Zap, Target } from "lucide-react"

interface NeuronProps {
  x: number
  y: number
  active: boolean
  type: 'input' | 'hidden' | 'output'
  tooltip: string
}

const TOOLTIPS = {
  input: "Input neurons receive initial data like images or numbers",
  hidden: "Hidden neurons process and transform the information",
  output: "Output neurons provide the final result or prediction"
}

const FeedForwardVisualizer = () => {
  const [neurons, setNeurons] = useState<NeuronProps[]>([])
  const [activeNeuronIndex, setActiveNeuronIndex] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  useEffect(() => {
    const neuronPositions = [
      { x: 100, y: 150, active: false, type: 'input', tooltip: TOOLTIPS.input },
      { x: 100, y: 250, active: false, type: 'input', tooltip: TOOLTIPS.input },
      { x: 100, y: 350, active: false, type: 'input', tooltip: TOOLTIPS.input },
      { x: 300, y: 200, active: false, type: 'hidden', tooltip: TOOLTIPS.hidden },
      { x: 300, y: 300, active: false, type: 'hidden', tooltip: TOOLTIPS.hidden },
      { x: 500, y: 250, active: false, type: 'output', tooltip: TOOLTIPS.output },
    ] as NeuronProps[]
    setNeurons(neuronPositions)

    return () => {
      setNeurons([])
      setActiveNeuronIndex(0)
      setShowTooltip(null)
    }
  }, [])

  const startAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    let index = 0

    const animate = () => {
      if (index < neurons.length) {
        setActiveNeuronIndex(index)
        setNeurons(prev =>
          prev.map((n, i) => ({
            ...n,
            active: i <= index
          }))
        )
        index++
        setTimeout(animate, 1000)
      } else {
        setIsAnimating(false)
      }
    }

    animate()
  }

  const getNeuronIcon = (type: string) => {
    switch (type) {
      case 'input': return Eye
      case 'hidden': return Zap
      case 'output': return Target
      default: return Network
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-8">
      <div className="mb-8 text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Feed Forward Neural Network
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Experience how artificial neurons process information, flowing from input to output through hidden layers.
        </p>
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
        >
          <Brain className="w-6 h-6" />
          Activate Network
        </button>
      </div>

      <div className="relative w-[700px] h-[500px] bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
        <svg className="w-full h-full">
          {neurons.map((from, i) => 
            neurons.slice(i + 1).map((to, j) => {
              if ((i < 3 && [3, 4].includes(i + j + 1)) || ([3, 4].includes(i) && i + j + 1 === 5)) {
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={from.active && to.active ? "url(#gradient)" : "#6B7280"}
                    strokeWidth="3"
                    className="transition-all duration-500"
                  />
                )
              }
              return null
            })
          )}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          {neurons.map((neuron, index) => {
            const Icon = getNeuronIcon(neuron.type)
            return (
              <g key={index} 
                onMouseEnter={() => setShowTooltip(index)}
                onMouseLeave={() => setShowTooltip(null)}
                className="cursor-pointer">
                <circle
                  cx={neuron.x}
                  cy={neuron.y}
                  r="25"
                  className={`${
                    neuron.active
                      ? 'fill-gradient-to-r from-blue-500 to-purple-500'
                      : 'fill-gray-200 dark:fill-gray-700'
                  } transition-all duration-500 hover:scale-110`}
                />
                <Icon
                  style={{
                    transform: `translate(${neuron.x - 12}px, ${neuron.y - 12}px)`,
                    color: neuron.active ? 'white' : '#6B7280',
                  }}
                  className="w-6 h-6 transition-all duration-300"
                />
                {showTooltip === index && (
                  <foreignObject
                    x={neuron.x + 30}
                    y={neuron.y - 30}
                    width="200"
                    height="100"
                  >
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg text-sm">
                      {neuron.tooltip}
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default FeedForwardVisualizer