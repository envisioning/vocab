"use client"
import { useState, useEffect } from "react"
import { 
  Brain, 
  Activity, 
  Target, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw,
  Lightbulb,
  Gauge
} from "lucide-react"

interface LayerConfig {
  size: number
  name: string
  icon: typeof Brain
  description: string
}

const NETWORK: LayerConfig[] = [
  { size: 3, name: "Input", icon: Sparkles, description: "Receives data like pixels or features" },
  { size: 4, name: "Hidden 1", icon: Brain, description: "Learns simple patterns" },
  { size: 4, name: "Hidden 2", icon: Brain, description: "Combines patterns into concepts" },
  { size: 2, name: "Output", icon: Target, description: "Makes final predictions" }
]

const LEARNING_PHASES = [
  { 
    title: "Data Input", 
    description: "Network receives training data",
    color: "text-blue-400",
    bgColor: "bg-blue-400/20",
    rgb: "rgb(96, 165, 250)"
  },
  { 
    title: "Pattern Detection", 
    description: "Hidden layers identify features",
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/20",
    rgb: "rgb(129, 140, 248)"
  },
  { 
    title: "Prediction", 
    description: "Network makes its best guess",
    color: "text-violet-400",
    bgColor: "bg-violet-400/20",
    rgb: "rgb(167, 139, 250)"
  },
  { 
    title: "Error Calculation", 
    description: "Comparing prediction vs reality",
    color: "text-rose-400",
    bgColor: "bg-rose-400/20",
    rgb: "rgb(251, 113, 133)"
  },
  { 
    title: "Weight Updates", 
    description: "Network learns from mistakes",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/20",
    rgb: "rgb(52, 211, 153)"
  }
]

export default function NeuralLearningViz() {
  const [phase, setPhase] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [accuracy, setAccuracy] = useState<number>(20)
  const [activeConnections, setActiveConnections] = useState<string[]>([])
  const [tooltipContent, setTooltipContent] = useState<{ x: number; y: number; content: string } | null>(null)

  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setPhase(prev => (prev + 1) % LEARNING_PHASES.length)
      if (accuracy < 95) {
        setAccuracy(prev => prev + Math.random() * 5)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isPlaying, accuracy])

  useEffect(() => {
    const connections: string[] = []
    if (phase <= 2) {
      for (let i = 0; i <= phase; i++) {
        connections.push(`layer-${i}`)
      }
    } else {
      for (let i = NETWORK.length - 1; i >= NETWORK.length - (phase - 1); i--) {
        connections.push(`layer-${i}`)
      }
    }
    setActiveConnections(connections)
  }, [phase])

  const handleReset = () => {
    setPhase(0)
    setAccuracy(20)
    setIsPlaying(true)
  }

  // Calculate dimensions based on the network configuration
  const viewBoxWidth = 1200
  const viewBoxHeight = 800
  const horizontalPadding = 100
  const verticalPadding = 150
  const layerSpacing = (viewBoxWidth - 2 * horizontalPadding) / (NETWORK.length - 1)

  const getNodePosition = (layerIndex: number, nodeIndex: number, layerSize: number) => {
    const x = horizontalPadding + layerIndex * layerSpacing
    const y = verticalPadding + nodeIndex * ((viewBoxHeight - 2 * verticalPadding) / (layerSize - 1))
    return { x, y }
  }

  return (
    <div className=" w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* Component title and subtitle min-h-screen */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Neural Network Learning Process
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Watch how a neural network learns through backpropagation.
          </p>
        </div>

        {/* Background of main elements */}
        <div className="relative rounded-2xl bg-gray-800/50 p-6 shadow-2xl backdrop-blur-md">

          {/* Progress Squares */}
          <div className="flex justify-center gap-2 mb-4" aria-label="Learning phase progress">
            {LEARNING_PHASES.map((p, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded transition-all duration-300 ${
                  i === phase 
                    ? p.bgColor + ' ring-2 ring-white ring-opacity-50' 
                    : i < phase 
                      ? 'bg-gray-600' 
                      : 'bg-gray-800'
                }`}
                aria-label={`Phase ${i + 1}: ${p.title}`}
              />
            ))}
          </div>

          {/* Dynamic Status Title */}
          <div className="h-16 mb-8 relative">
            <div className={`absolute left-1/2 top-2 -translate-x-1/2 transform rounded-lg w-[90%] max-w-[320px] px-3 sm:px-4 py-3 text-center transition-all duration-500 ${LEARNING_PHASES[phase].bgColor}`}>
              <h3 className={`text-[0.85rem] xs:text-base sm:text-lg font-semibold ${LEARNING_PHASES[phase].color}`} style={{ wordBreak: 'break-word' }}>
                {LEARNING_PHASES[phase].title}
              </h3>
              <p className="text-[0.75rem] xs:text-xs sm:text-sm text-white/80 line-clamp-2">
                {LEARNING_PHASES[phase].description}
              </p>
            </div>
          </div>

          {/* Neural network */}
          <div className="mt-4 aspect-[4/3] w-full">
            <svg className="h-full w-full" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Draw connections between nodes */}
              {NETWORK.map((layer, layerIndex) => 
                layerIndex < NETWORK.length - 1 && (
                  <g key={`connections-${layerIndex}`}>
                    {Array.from({ length: layer.size }, (_, i) => {
                      const start = getNodePosition(layerIndex, i, layer.size)
                      return Array.from({ length: NETWORK[layerIndex + 1].size }, (_, j) => {
                        const end = getNodePosition(layerIndex + 1, j, NETWORK[layerIndex + 1].size)
                        const isActive = activeConnections.includes(`layer-${layerIndex}`)
                        return (
                          <line
                            key={`connection-${layerIndex}-${i}-${j}`}
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                            stroke={isActive ? LEARNING_PHASES[phase].rgb : '#374151'}
                            strokeWidth={2}
                            strokeOpacity={isActive ? 0.6 : 0.2}
                            className="transition-all duration-500"
                          />
                        )
                      })
                    })}
                  </g>
                )
              )}

              {/* Draw nodes */}
              {NETWORK.map((layer, layerIndex) => (
                <g key={`layer-${layerIndex}`}>
                  {Array.from({ length: layer.size }, (_, i) => {
                    const { x, y } = getNodePosition(layerIndex, i, layer.size)
                    const Icon = layer.icon
                    return (
                      <g
                        key={`neuron-${layerIndex}-${i}`}
                        onMouseEnter={() => setTooltipContent({
                          x,
                          y,
                          content: layer.description
                        })}
                        onMouseLeave={() => setTooltipContent(null)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={x}
                          cy={y}
                          r={50}
                          fill={activeConnections.includes(`layer-${layerIndex}`) 
                            ? LEARNING_PHASES[phase].rgb 
                            : '#374151'}
                          className="transition-all duration-500"
                          filter="url(#glow)"
                        />
                        <foreignObject
                          x={x - 28}
                          y={y - 28}
                          width="60"
                          height="60"
                        >
                          <Icon
                            className="text-white transition-all duration-500"
                            size={60}
                          />
                        </foreignObject>
                      </g>
                    )
                  })}
                  <text
                    x={horizontalPadding + layerIndex * layerSpacing}
                    y={viewBoxHeight - 50}
                    className="fill-gray-400 text-2xl font-semibold text-center"
                    textAnchor="middle"
                  >
                    {layer.name}
                  </text>
                </g>
              ))}

              {/* Tooltip */}
              {tooltipContent && (
                <foreignObject
                  x={tooltipContent.x + 0}
                  y={tooltipContent.y - 90}
                  width="200"
                  height="60"
                >
                  <div className="rounded-lg bg-gray-900 p-2 text-sm text-white shadow-xl">
                    {tooltipContent.content}
                  </div>
                </foreignObject>
              )}
            </svg>
          </div>
          
          {/* Buttons and Controls Section */}
          <div className="mt-8 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            {/* Playback Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex flex-1 sm:flex-none items-center justify-center gap-1 sm:gap-2 rounded-lg bg-blue-500 px-3 sm:px-4 py-2 text-white text-sm sm:text-base transition-all hover:bg-blue-600"
                aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
              >
                {isPlaying ? <Pause size={16} className="sm:size-5" /> : <Play size={16} className="sm:size-5" />}
                <span className="whitespace-nowrap">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={handleReset}
                className="flex flex-1 sm:flex-none items-center justify-center gap-1 sm:gap-2 rounded-lg bg-gray-700 px-3 sm:px-4 py-2 text-white text-sm sm:text-base transition-all hover:bg-gray-600"
                aria-label="Reset animation"
              >
                <RotateCcw size={16} className="sm:size-5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Status Indicators */}
            <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3 sm:gap-4 text-sm sm:text-base">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Gauge size={16} className="text-blue-400 sm:size-5" />
                <span className="text-white whitespace-nowrap">Accuracy: {accuracy.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Lightbulb size={16} className="text-yellow-400 sm:size-5" />
                <span className="text-white whitespace-nowrap">Learning...</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-gray-800/50 p-6 backdrop-blur-md">
          <h3 className="mb-3 text-xl font-semibold text-white">Understanding Backpropagation</h3>
          <div className="space-y-4 text-gray-300">
            <p className="text-sm leading-relaxed">
              This visualization demonstrates how the algorithm propagates errors backward through the network's layers, adjusting weights to improve accuracy.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <Activity className="h-4 w-4" />
              <span>The network learns through forward and backward passes.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}