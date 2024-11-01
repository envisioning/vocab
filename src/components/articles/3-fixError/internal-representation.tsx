"use client"
import { useState, useEffect } from "react"
import { Brain, CircuitBoard, Binary, Network, Info, ArrowRight, Lightbulb } from "lucide-react"

interface ComponentProps {}

type NeuronType = {
  id: number
  x: number
  y: number
  connections: number[]
  activated: boolean
}

type StageType = "input" | "processing" | "representation" | "complete"

export default function InternalRepresentation({}: ComponentProps) {
  const [neurons, setNeurons] = useState<NeuronType[]>([])
  const [stage, setStage] = useState<StageType>("input")
  const [tooltip, setTooltip] = useState<string>("")
  const [activeNeuronCount, setActiveNeuronCount] = useState(0)

  useEffect(() => {
    const initialNeurons = Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      x: Math.cos(i * Math.PI / 8) * 150 + 200,
      y: Math.sin(i * Math.PI / 8) * 150 + 200,
      connections: Array.from({ length: 4 }).map(() => 
        Math.floor(Math.random() * 16)
      ),
      activated: false
    }))
    setNeurons(initialNeurons)

    return () => {
      setNeurons([])
      setStage("input")
    }
  }, [])

  const processNextStage = () => {
    if (stage === "input") {
      setStage("processing")
      activateNeurons()
    } else if (stage === "processing") {
      setStage("representation")
    } else if (stage === "representation") {
      setStage("complete")
    }
  }

  const activateNeurons = () => {
    const interval = setInterval(() => {
      setActiveNeuronCount(prev => {
        if (prev >= neurons.length) {
          clearInterval(interval)
          return prev
        }
        setNeurons(current =>
          current.map((n, i) => ({
            ...n,
            activated: i <= prev
          }))
        )
        return prev + 1
      })
    }, 150)

    return () => clearInterval(interval)
  }

  return (
    <div className="relative min-h-[600px] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-xl overflow-hidden">
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <Brain className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-100">
          Internal Representation
        </h2>
        <div className="relative group">
          <Info className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-help transition-colors duration-300" />
          <div className="absolute left-0 top-8 w-64 bg-gray-800 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
            <p className="text-sm text-gray-200">
              See how AI systems convert information into internal neural patterns
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center items-center gap-6 px-4">
          <div className="flex flex-col items-center gap-2">
            <div className="text-7xl bg-gray-800 p-4 rounded-xl shadow-lg">🤖</div>
            <span className="text-gray-300 text-sm">Input Data</span>
          </div>
          
          <ArrowRight className="w-8 h-8 text-blue-400" />
          
          <div className="flex flex-col items-center gap-2">
            <CircuitBoard className="w-16 h-16 text-green-400" />
            <span className="text-gray-300 text-sm">Neural Processing</span>
          </div>
          
          <ArrowRight className="w-8 h-8 text-blue-400" />
          
          <div className="flex flex-col items-center gap-2">
            <Binary className="w-16 h-16 text-purple-400" />
            <span className="text-gray-300 text-sm">Digital Representation</span>
          </div>
        </div>

        <div className="relative w-full h-[400px] bg-gray-800/50 rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Network className="w-32 h-32 text-gray-700" />
          </div>
          {neurons.map((neuron) => (
            <div key={neuron.id}>
              {neuron.connections.map((targetId) => {
                const target = neurons.find((n) => n.id === targetId)
                if (!target) return null
                return (
                  <svg key={`${neuron.id}-${targetId}`} className="absolute inset-0">
                    <line
                      x1={neuron.x}
                      y1={neuron.y}
                      x2={target.x}
                      y2={target.y}
                      className={`${
                        neuron.activated ? "stroke-blue-400" : "stroke-gray-600"
                      } stroke-2 transition-all duration-300`}
                    />
                  </svg>
                )
              })}
              <div
                className={`absolute w-5 h-5 rounded-full transition-all duration-300 cursor-pointer
                  ${neuron.activated 
                    ? "bg-blue-400 shadow-lg shadow-blue-400/50 scale-125" 
                    : "bg-gray-600"
                  }`}
                style={{
                  left: neuron.x - 10,
                  top: neuron.y - 10,
                  transform: `scale(${neuron.activated ? 1.2 : 1})`
                }}
                onMouseEnter={() => setTooltip(`Neuron ${neuron.id + 1}`)}
                onMouseLeave={() => setTooltip("")}
              />
            </div>
          ))}
        </div>

        <button
          onClick={processNextStage}
          disabled={stage === "complete"}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
        >
          <Lightbulb className="w-5 h-5" />
          {stage === "input" ? "Start Processing" : "Next Stage"}
        </button>
      </div>
    </div>
  )
}