"use client"
import { useState, useEffect } from "react"
import { Brain, Cpu, Database, Network, Code, ChevronRight, Info, ChevronDown } from 'lucide-react'

type TensorNode = {
  id: number
  x: number
  y: number
  type: 'input' | 'hidden' | 'output'
}

type Feature = {
  icon: any
  text: string
  description: string
}

const EXPLANATION = {
  icon: Brain,
  text: "Inside TensorFlow's Neural Network",
  description: "This visualization demonstrates how TensorFlow, Google's powerful AI framework, implements neural networks - the foundation of modern artificial intelligence. The hidden layer (purple nodes) is where the actual AI learning happens - it processes input data through mathematical operations to find complex patterns, just like how a human brain processes information. The animated lines show how TensorFlow moves data from input nodes (blue) through hidden layers to output nodes (green), mirroring how AI systems transform raw data into meaningful predictions. This flow of information and learning process is what enables AI applications like image recognition, language translation, and decision-making systems to work in TensorFlow."
}

const TensorFlowVisualizer = () => {
  const [nodes, setNodes] = useState<TensorNode[]>([])
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    const initialNodes: TensorNode[] = [
      {id: 1, x: 150, y: 100, type: 'input'},
      {id: 2, x: 150, y: 180, type: 'input'},
      {id: 3, x: 150, y: 260, type: 'input'},
      {id: 4, x: 350, y: 140, type: 'hidden'},
      {id: 5, x: 350, y: 220, type: 'hidden'},
      {id: 6, x: 550, y: 180, type: 'output'},
    ]
    setNodes(initialNodes)
    return () => setNodes([])
  }, [])

  const toggleFeature = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index)
  }

  return (
    <div className="w-full sm:aspect-[1.618/1] mx-auto p-3 sm:p-6 flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          TensorFlow: Neural Network Visualization
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          Explore how TensorFlow processes data through neural networks
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 sm:gap-6">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 h-96 overflow-hidden">
          <div className="absolute top-2 left-2 text-xs md:text-sm flex items-center flex-wrap gap-1">
            <span className="text-blue-500 font-medium">Input Layer</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-purple-500 font-medium">Hidden Layer</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-green-500 font-medium">Output Layer</span>
          </div>
          
          <svg className="w-full h-full" viewBox="100 50 500 250" preserveAspectRatio="xMidYMid meet">
            {nodes.map(node1 => 
              nodes.map(node2 => {
                if (node1.type === 'input' && node2.type === 'hidden' ||
                    node1.type === 'hidden' && node2.type === 'output') {
                  return (
                    <line
                      key={`${node1.id}-${node2.id}`}
                      x1={node1.x}
                      y1={node1.y}
                      x2={node2.x}
                      y2={node2.y}
                      className="stroke-slate-300 dark:stroke-slate-600"
                      strokeWidth="2"
                      strokeDasharray="4"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-8"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </line>
                  )
                }
                return null
              })
            )}
            
            {nodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  className={`
                    ${node.type === 'input' ? 'fill-blue-500 dark:fill-blue-400' : ''}
                    ${node.type === 'hidden' ? 'fill-purple-500 dark:fill-purple-400' : ''}
                    ${node.type === 'output' ? 'fill-green-500 dark:fill-green-400' : ''}
                  `}
                  opacity={0.8}
                >
                  <animate
                    attributeName="r"
                    values="20;22;20"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
          </svg>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 overflow-auto flex-1">

          <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedFeature(expandedFeature === 0 ? null : 0)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <EXPLANATION.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
                  {EXPLANATION.text}
                </span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  expandedFeature === 0 ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedFeature === 0 && (
              <div className="px-4 py-3 text-xs md:text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 leading-relaxed">
                {EXPLANATION.description}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
  )
}

export default TensorFlowVisualizer