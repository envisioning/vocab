"use client"
import { useState, useEffect } from "react"
import { Brain, Zap, Connection, Activity, Info, Plus } from "lucide-react"

interface Neuron {
  id: number
  x: number
  y: number
  active: boolean
  type: 'input' | 'hidden' | 'output'
}

interface Synapse {
  from: number
  to: number
  weight: number
}

const BiologicalNeuralNetwork = () => {
  const [neurons, setNeurons] = useState<Neuron[]>([])
  const [synapses, setSynapses] = useState<Synapse[]>([])
  const [activeNeuronId, setActiveNeuronId] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  useEffect(() => {
    const initialNeurons: Neuron[] = [
      { id: 1, x: 100, y: 150, active: false, type: 'input' },
      { id: 2, x: 250, y: 100, active: false, type: 'hidden' },
      { id: 3, x: 250, y: 200, active: false, type: 'hidden' },
      { id: 4, x: 400, y: 150, active: false, type: 'output' },
    ]

    const initialSynapses: Synapse[] = [
      { from: 1, to: 2, weight: 0.8 },
      { from: 1, to: 3, weight: 0.6 },
      { from: 2, to: 4, weight: 0.7 },
      { from: 3, to: 4, weight: 0.9 },
    ]

    setNeurons(initialNeurons)
    setSynapses(initialSynapses)

    return () => {
      setNeurons([])
      setSynapses([])
    }
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    let currentIndex = 0
    const sequence = [1, 2, 3, 4]
    
    const interval = setInterval(() => {
      setActiveNeuronId(sequence[currentIndex])
      currentIndex = (currentIndex + 1) % sequence.length
    }, 800)

    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg overflow-hidden p-6">
      <div className="absolute top-6 left-6 flex items-center space-x-3">
        <Brain className="w-10 h-10 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Biological Neural Network</h2>
          <p className="text-sm text-gray-600">Nature's Information Highway</p>
        </div>
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-6 right-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg
                 flex items-center space-x-2 hover:bg-blue-700 transition duration-300 shadow-md"
      >
        <Zap className="w-5 h-5" />
        <span className="font-semibold">{isPlaying ? "Pause Signal" : "Start Signal"}</span>
      </button>

      <svg className="w-full h-full">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#CBD5E1"/>
          </marker>
        </defs>
        
        {synapses.map((synapse) => {
          const fromNeuron = neurons.find((n) => n.id === synapse.from)
          const toNeuron = neurons.find((n) => n.id === synapse.to)
          if (!fromNeuron || !toNeuron) return null

          const isActive = activeNeuronId === fromNeuron.id || activeNeuronId === toNeuron.id

          return (
            <g key={`${synapse.from}-${synapse.to}`}
               onMouseEnter={() => setHoveredElement(`synapse-${synapse.from}-${synapse.to}`)}
               onMouseLeave={() => setHoveredElement(null)}>
              <line
                x1={fromNeuron.x}
                y1={fromNeuron.y}
                x2={toNeuron.x}
                y2={toNeuron.y}
                stroke={isActive ? "#3B82F6" : "#CBD5E1"}
                strokeWidth={isActive ? 4 : 2}
                className="transition-all duration-500"
                markerEnd="url(#arrowhead)"
              />
              {hoveredElement === `synapse-${synapse.from}-${synapse.to}` && (
                <text
                  x={(fromNeuron.x + toNeuron.x) / 2}
                  y={(fromNeuron.y + toNeuron.y) / 2 - 10}
                  className="text-sm fill-gray-600"
                  textAnchor="middle"
                >
                  Weight: {synapse.weight}
                </text>
              )}
            </g>
          )
        })}

        {neurons.map((neuron) => (
          <g key={neuron.id}
             onMouseEnter={() => setHoveredElement(`neuron-${neuron.id}`)}
             onMouseLeave={() => setHoveredElement(null)}>
            <circle
              cx={neuron.x}
              cy={neuron.y}
              r={30}
              fill={activeNeuronId === neuron.id ? "#3B82F6" : "#ffffff"}
              stroke={activeNeuronId === neuron.id ? "#2563EB" : "#CBD5E1"}
              strokeWidth={3}
              className="transition-all duration-500 shadow-lg"
            />
            <Activity
              x={neuron.x - 12}
              y={neuron.y - 12}
              className={`w-6 h-6 ${
                activeNeuronId === neuron.id ? "text-white" : "text-gray-400"
              } transition-all duration-500`}
            />
            {hoveredElement === `neuron-${neuron.id}` && (
              <text
                x={neuron.x}
                y={neuron.y + 45}
                className="text-sm fill-gray-600 font-medium"
                textAnchor="middle"
              >
                {neuron.type.charAt(0).toUpperCase() + neuron.type.slice(1)} Neuron
              </text>
            )}
          </g>
        ))}
      </svg>

      <div className="absolute bottom-6 left-6 right-6 bg-white p-5 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">How It Works</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Biological neural networks are nature's computational masterpiece. Each neuron acts like a tiny processor,
              receiving signals through dendrites and sending outputs through axons. The strength of connections
              (synaptic weights) determines how information flows through the network.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BiologicalNeuralNetwork