"use client"
import { useState, useEffect } from "react"
import { Circle, ArrowRight, Brain, Zap, Info, Layers } from "lucide-react"

interface NeuronProps {
  x: number
  y: number
  active: boolean
}

interface LayerProps {
  neurons: NeuronProps[]
  layerIndex: number
  layerName: string
  description: string
}

const LAYER_SPACING = 180
const NEURON_SPACING = 70
const ANIMATION_DELAY = 800

const LAYER_INFO = [
  { name: "Input Layer", description: "Receives raw data like images or numbers" },
  { name: "Hidden Layer 1", description: "Detects basic patterns and features" },
  { name: "Hidden Layer 2", description: "Combines features into complex patterns" },
  { name: "Output Layer", description: "Makes final predictions or decisions" }
]

export default function DNNVisualizer() {
  const [activeNeurons, setActiveNeurons] = useState<number[][]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null)

  const networkArchitecture = [4, 6, 6, 3]

  const generateLayers = (): LayerProps[] => {
    return networkArchitecture.map((neuronCount, layerIndex) => ({
      neurons: Array.from({ length: neuronCount }, (_, i) => ({
        x: layerIndex * LAYER_SPACING,
        y: i * NEURON_SPACING,
        active: false
      })),
      layerIndex,
      layerName: LAYER_INFO[layerIndex].name,
      description: LAYER_INFO[layerIndex].description
    }))
  }

  const [layers, setLayers] = useState<LayerProps[]>(generateLayers())

  const processNetwork = () => {
    if (isProcessing) return
    setIsProcessing(true)
    setCurrentStep(0)
    setActiveNeurons([])
    
    const newActivations: number[][] = []
    networkArchitecture.forEach((count) => {
      const layerActivations = Array.from(
        { length: count },
        () => Math.random() > 0.5 ? 1 : 0
      )
      newActivations.push(layerActivations)
    })
    setActiveNeurons(newActivations)
  }

  useEffect(() => {
    if (currentStep < networkArchitecture.length && isProcessing) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, ANIMATION_DELAY)
      return () => clearTimeout(timer)
    } else {
      setIsProcessing(false)
    }
  }, [currentStep, isProcessing])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
          <Brain className="text-blue-500 h-10 w-10" />
          Deep Neural Network
          <Brain className="text-blue-500 h-10 w-10" />
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
          <Layers className="h-5 w-5" />
          Explore how neural networks process information through multiple layers
        </p>
      </div>

      <div className="relative mb-12">
        <svg className="w-[800px] h-[300px]">
          {layers.map((layer, layerIdx) =>
            layer.neurons.map((neuron, neuronIdx) => (
              <g key={`${layerIdx}-${neuronIdx}`}
                 onMouseEnter={() => setHoveredLayer(layerIdx)}
                 onMouseLeave={() => setHoveredLayer(null)}>
                {layerIdx < layers.length - 1 &&
                  layers[layerIdx + 1].neurons.map((nextNeuron, nextIdx) => (
                    <line
                      key={`${layerIdx}-${neuronIdx}-${nextIdx}`}
                      x1={neuron.x + 20}
                      y1={neuron.y + 20}
                      x2={nextNeuron.x + 20}
                      y2={nextNeuron.y + 20}
                      className={`stroke-blue-200 dark:stroke-blue-900 stroke-1 transition-all duration-500 ${
                        currentStep > layerIdx ? "opacity-70" : "opacity-20"
                      }`}
                    />
                  ))}
                <Circle
                  size={40}
                  className={`absolute cursor-help transition-all duration-300 ${
                    activeNeurons[layerIdx]?.[neuronIdx] && currentStep > layerIdx
                      ? "text-blue-500 fill-blue-200 dark:fill-blue-900 animate-pulse"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                  style={{
                    transform: `translate(${neuron.x}px, ${neuron.y}px)`,
                  }}
                />
              </g>
            ))
          )}
        </svg>
        {hoveredLayer !== null && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-blue-200 dark:border-blue-900">
            <h3 className="font-bold text-blue-500 mb-1">{layers[hoveredLayer].layerName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{layers[hoveredLayer].description}</p>
          </div>
        )}
      </div>

      <button
        onClick={processNetwork}
        disabled={isProcessing}
        className={`flex items-center gap-3 px-8 py-4 rounded-full text-white text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
          isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        }`}
      >
        {isProcessing ? "Processing..." : "Start Processing"}
        {isProcessing ? (
          <Zap className="animate-pulse h-6 w-6" />
        ) : (
          <ArrowRight className="animate-bounce h-6 w-6" />
        )}
      </button>
    </div>
  )
}