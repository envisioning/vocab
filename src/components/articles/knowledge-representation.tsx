"use client"
import { useState, useEffect } from "react"
import { Brain, Database, Network, Book, Tree, Map, Info, Sparkles } from "lucide-react"

interface KnowledgeNode {
  id: number
  icon: JSX.Element
  label: string
  description: string
  connections: number[]
  x: number
  y: number
}

export default function KnowledgeRepresentation() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([
    {
      id: 1,
      icon: <Brain className="w-10 h-10 text-purple-500" />,
      label: "Concepts",
      description: "Abstract ideas and mental representations that AI uses to understand the world",
      connections: [2, 3],
      x: 150,
      y: 100
    },
    {
      id: 2,
      icon: <Database className="w-10 h-10 text-blue-500" />,
      label: "Facts",
      description: "Concrete pieces of information that AI stores as true statements",
      connections: [1, 4],
      x: 300,
      y: 200
    },
    {
      id: 3,
      icon: <Book className="w-10 h-10 text-green-500" />,
      label: "Rules",
      description: "Logical principles that guide AI's reasoning and decision-making",
      connections: [1, 4],
      x: 300,
      y: 400
    },
    {
      id: 4,
      icon: <Tree className="w-10 h-10 text-orange-500" />,
      label: "Logic",
      description: "Framework for combining facts and rules to reach new conclusions",
      connections: [2, 3, 5],
      x: 450,
      y: 300
    },
    {
      id: 5,
      icon: <Map className="w-10 h-10 text-red-500" />,
      label: "Knowledge",
      description: "Complete understanding that emerges from connecting all pieces together",
      connections: [4],
      x: 600,
      y: 300
    }
  ])

  const [activeNode, setActiveNode] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [pulseEffect, setPulseEffect] = useState<boolean>(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseEffect(prev => !prev)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[700px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 overflow-hidden">
      <div className="absolute top-6 left-6 max-w-md">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          Knowledge Representation
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="text-gray-300 mt-3 leading-relaxed">
          Explore how AI systems organize and connect information to create understanding.
          Hover over nodes to learn more, and click to see connections.
        </p>
      </div>

      <div className="relative w-full h-full mt-12">
        {nodes.map(node => (
          <div key={node.id}>
            {node.connections.map(connectionId => {
              const connectedNode = nodes.find(n => n.id === connectionId)
              if (!connectedNode) return null
              return (
                <svg key={`${node.id}-${connectionId}`} className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <line
                    x1={node.x + 32}
                    y1={node.y + 32}
                    x2={connectedNode.x + 32}
                    y2={connectedNode.y + 32}
                    className={`
                      ${activeNode === node.id || activeNode === connectionId
                        ? "stroke-blue-400 stroke-2"
                        : "stroke-gray-600"}
                      ${pulseEffect ? "opacity-90" : "opacity-40"}
                      transition-all duration-500
                    `}
                    strokeWidth="2"
                    strokeDasharray={pulseEffect ? "0" : "5,5"}
                  />
                </svg>
              )
            })}
          </div>
        ))}

        {nodes.map(node => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: node.x, top: node.y }}
          >
            <div
              className={`
                relative group cursor-pointer
                ${activeNode === node.id ? "scale-110" : "scale-100"}
                transition-all duration-300
              `}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              onMouseEnter={() => setShowTooltip(node.id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div className={`
                p-6 rounded-full bg-gray-800 border-2
                ${activeNode === node.id 
                  ? "border-blue-400 shadow-lg shadow-blue-500/20" 
                  : "border-gray-700 hover:border-gray-600"}
                transition-all duration-300
              `}>
                {node.icon}
              </div>
              <div className="mt-3 text-center">
                <span className="font-medium text-white text-lg">{node.label}</span>
              </div>
              
              {showTooltip === node.id && (
                <div className="absolute z-10 w-64 p-4 mt-2 -ml-28 text-sm bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
                  <p className="text-gray-300">{node.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}