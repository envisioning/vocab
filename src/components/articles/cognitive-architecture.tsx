"use client"
import { useState, useEffect } from "react"
import { Brain, Cog, Cpu, Eye, Heart, MessageCircle, Zap, Info } from "lucide-react"

interface CognitiveNode {
  id: string
  icon: JSX.Element
  name: string
  description: string
  x: number
  y: number
  connected: string[]
}

interface ComponentProps {}

const CognitiveArchitectureDemo = ({}: ComponentProps) => {
  const [nodes, setNodes] = useState<CognitiveNode[]>([
    {
      id: "perception",
      icon: <Eye size={28} />,
      name: "Perception",
      description: "Processes sensory inputs from the environment like vision, sound, and touch",
      x: 20,
      y: 40,
      connected: ["memory", "reasoning"]
    },
    {
      id: "memory",
      icon: <Brain size={28} />,
      name: "Memory",
      description: "Stores and retrieves information, both short-term and long-term knowledge",
      x: 50,
      y: 30,
      connected: ["emotion", "reasoning"]
    },
    {
      id: "reasoning",
      icon: <Cpu size={28} />,
      name: "Reasoning",
      description: "Analyzes information and makes logical decisions based on available data",
      x: 80,
      y: 40,
      connected: ["language", "action"]
    },
    {
      id: "emotion",
      icon: <Heart size={28} />,
      name: "Emotion",
      description: "Processes affective states that influence decision-making and behavior",
      x: 35,
      y: 60,
      connected: ["language"]
    },
    {
      id: "language",
      icon: <MessageCircle size={28} />,
      name: "Language",
      description: "Handles communication, understanding, and generation of language",
      x: 65,
      y: 60,
      connected: ["action"]
    },
    {
      id: "action",
      icon: <Zap size={28} />,
      name: "Action",
      description: "Executes decisions through behaviors and responses to the environment",
      x: 80,
      y: 70,
      connected: []
    },
  ])

  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [pulseNode, setPulseNode] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)]
      setPulseNode(randomNode.id)
      
      const timeout = setTimeout(() => {
        randomNode.connected.forEach((connectedId, index) => {
          setTimeout(() => setPulseNode(connectedId), index * 300)
        })
      }, 500)

      return () => clearTimeout(timeout)
    }, 4000)

    return () => clearInterval(interval)
  }, [nodes])

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden p-8 shadow-2xl">
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <Cog className="text-blue-400 animate-spin" />
        <h2 className="text-white text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Cognitive Architecture
        </h2>
      </div>

      <svg className="absolute inset-0 w-full h-full">
        {nodes.map((node) =>
          node.connected.map((targetId) => {
            const target = nodes.find((n) => n.id === targetId)
            if (!target) return null
            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke={activeNode === node.id ? "#60A5FA" : "#4B5563"}
                strokeWidth="3"
                className="transition-all duration-500"
              />
            )
          })
        )}
      </svg>

      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onMouseEnter={() => setShowTooltip(node.id)}
          onMouseLeave={() => setShowTooltip(null)}
          onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
        >
          <div
            className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl cursor-pointer
              ${pulseNode === node.id ? "animate-pulse" : ""}
              ${activeNode === node.id 
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                : "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200 hover:from-gray-600 hover:to-gray-700"}
              transition-all duration-300 transform hover:scale-110`}
          >
            {node.icon}
            <span className="text-sm font-medium">{node.name}</span>
            
            {showTooltip === node.id && (
              <div className="absolute top-full mt-2 p-3 bg-gray-800 rounded-lg shadow-xl z-10 w-48 text-sm text-gray-200">
                <div className="flex items-start gap-2">
                  <Info size={16} className="mt-1 text-blue-400" />
                  <p>{node.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-4 right-4 bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
        <p className="text-gray-200 text-sm leading-relaxed">
          Explore how cognitive processes interact in AI systems by hovering over nodes to learn more and clicking to highlight connections. Watch as information pulses through the network, simulating real-time cognitive processing!
        </p>
      </div>
    </div>
  )
}

export default CognitiveArchitectureDemo