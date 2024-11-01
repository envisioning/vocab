"use client"
import { useState, useEffect } from "react"
import { Brain, CircleDot, ArrowRight, Zap, Info, BookOpen, Lightbulb } from "lucide-react"

interface NeuronProps {
  x: number
  y: number
  active: boolean
}

interface TooltipProps {
  text: string
  isVisible: boolean
}

const LAYERS = [4, 6, 6, 3]
const ANIMATION_DELAY = 3000

const LAYER_INFO = [
  "Input Layer: Receives raw data like images or text",
  "Hidden Layer 1: Detects basic patterns and features",
  "Hidden Layer 2: Combines features into complex concepts",
  "Output Layer: Makes final predictions or decisions"
]

export default function DeepLearningVisualizer() {
  const [activeLayer, setActiveLayer] = useState<number>(0)
  const [tooltip, setTooltip] = useState<TooltipProps>({ text: "", isVisible: false })
  const [isPlaying, setIsPlaying] = useState<boolean>(true)

  const [neurons, setNeurons] = useState<NeuronProps[][]>(
    LAYERS.map((count, layerIndex) =>
      Array.from({ length: count }, (_, i) => ({
        x: (layerIndex * 200) + 100,
        y: (i * 80) + 150,
        active: false
      }))
    )
  )

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveLayer(prev => (prev + 1) % LAYERS.length)
      }, ANIMATION_DELAY)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  useEffect(() => {
    const newNeurons = neurons.map((layer, layerIndex) =>
      layer.map(neuron => ({
        ...neuron,
        active: layerIndex === activeLayer
      }))
    )
    setNeurons(newNeurons)
    setTooltip({ text: LAYER_INFO[activeLayer], isVisible: true })
  }, [activeLayer])

  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    neurons.forEach((layer, layerIndex) => {
      if (layerIndex < neurons.length - 1) {
        layer.forEach(neuron => {
          neurons[layerIndex + 1].forEach(nextNeuron => {
            ctx.beginPath()
            ctx.moveTo(neuron.x + 20, neuron.y + 20)
            ctx.lineTo(nextNeuron.x + 20, nextNeuron.y + 20)
            ctx.strokeStyle = neuron.active ? '#3B82F6' : '#6B7280'
            ctx.lineWidth = neuron.active ? 2.5 : 1
            ctx.stroke()
          })
        })
      }
    })
  }

  useEffect(() => {
    const canvas = document.getElementById('neural-canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawConnections(ctx)
    }
  }, [neurons])

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div className="absolute top-4 left-4 text-white space-y-3">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Brain className="h-10 w-10 text-blue-400" />
          Deep Learning Explorer
        </h1>
        <div className="flex items-center gap-2 text-gray-300">
          <Lightbulb className="h-5 w-5 text-yellow-400 animate-pulse" />
          <p className="text-lg">Understanding Neural Networks Layer by Layer</p>
        </div>
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
        transition-colors duration-300 flex items-center gap-2"
      >
        {isPlaying ? "Pause" : "Play"} Animation
      </button>

      <canvas 
        id="neural-canvas" 
        width={900} 
        height={600} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {neurons.map((layer, layerIndex) =>
        layer.map((neuron, neuronIndex) => (
          <div
            key={`${layerIndex}-${neuronIndex}`}
            className={`absolute transition-all duration-500 transform
              ${neuron.active ? 'scale-125' : 'scale-100'}
              ${neuron.active ? 'opacity-100' : 'opacity-60'}`}
            style={{
              left: neuron.x,
              top: neuron.y,
            }}
          >
            {layerIndex === 0 ? (
              <CircleDot className={`h-12 w-12 ${neuron.active ? 'text-blue-400 animate-pulse' : 'text-gray-500'}`} />
            ) : layerIndex === LAYERS.length - 1 ? (
              <Zap className={`h-12 w-12 ${neuron.active ? 'text-green-400 animate-pulse' : 'text-gray-500'}`} />
            ) : (
              <ArrowRight className={`h-12 w-12 ${neuron.active ? 'text-blue-400 animate-pulse' : 'text-gray-500'}`} />
            )}
          </div>
        ))
      )}

      {tooltip.isVisible && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-xl
          shadow-lg border border-blue-500/30 transition-all duration-300 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-400" />
          <p className="text-lg">{tooltip.text}</p>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 bg-gray-800/50 backdrop-blur-sm py-4 rounded-xl">
        <div className="flex justify-center gap-12 text-white">
          <div className="flex items-center gap-2">
            <CircleDot className="h-8 w-8 text-blue-400" />
            <span className="text-lg">Input Layer</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="h-8 w-8 text-blue-400" />
            <span className="text-lg">Hidden Layers</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-green-400" />
            <span className="text-lg">Output Layer</span>
          </div>
        </div>
      </div>
    </div>
  )
}