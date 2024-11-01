"use client"
import { useState, useEffect } from "react"
import { Brain, Code2, Play, Pause, Database, Network, ArrowRight, Info } from "lucide-react"

interface TensorFlowNode {
    id: number
    x: number
    y: number
    type: "input" | "hidden" | "output"
    label: string
    description: string
}

const INITIAL_NODES: TensorFlowNode[] = [
    { id: 1, x: 100, y: 150, type: "input", label: "Input Layer", description: "Receives raw data like images or text" },
    { id: 2, x: 300, y: 100, type: "hidden", label: "Hidden Layer 1", description: "Processes features and patterns" },
    { id: 3, x: 300, y: 200, type: "hidden", label: "Hidden Layer 2", description: "Learns complex relationships" },
    { id: 4, x: 500, y: 150, type: "output", label: "Output Layer", description: "Produces predictions or results" }
]

export default function TensorFlowVisualizer() {
    const [nodes, setNodes] = useState<TensorFlowNode[]>(INITIAL_NODES)
    const [isAnimating, setIsAnimating] = useState<boolean>(false)
    const [dataFlow, setDataFlow] = useState<number>(0)
    const [activeNode, setActiveNode] = useState<TensorFlowNode | null>(null)

    useEffect(() => {
        let animationFrame: number
        
        const animate = () => {
            if (isAnimating) {
                setDataFlow(prev => (prev + 1) % 100)
                animationFrame = requestAnimationFrame(animate)
            }
        }

        if (isAnimating) {
            animationFrame = requestAnimationFrame(animate)
        }

        return () => cancelAnimationFrame(animationFrame)
    }, [isAnimating])

    return (
        <div className="flex flex-col items-center p-8 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
            <div className="mb-8 text-center">
                <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3 justify-center">
                    <Brain className="w-12 h-12 text-blue-500" />
                    TensorFlow Explorer
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 flex items-center gap-2 justify-center">
                    <Code2 className="w-5 h-5" />
                    Interactive Neural Network Visualization
                </p>
            </div>

            <div className="relative w-[900px] h-[500px] bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={() => setIsAnimating(!isAnimating)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                        {isAnimating ? (
                            <>
                                <Pause className="w-4 h-4" /> Pause Flow
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" /> Start Flow
                            </>
                        )}
                    </button>
                </div>

                <svg className="w-full h-full">
                    <defs>
                        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#22C55E" />
                        </linearGradient>
                    </defs>
                    {nodes.map((node) => (
                        <g key={node.id}>
                            {nodes.map((target) => {
                                if ((node.type === "input" && target.type === "hidden") ||
                                    (node.type === "hidden" && target.type === "output")) {
                                    return (
                                        <line
                                            key={`${node.id}-${target.id}`}
                                            x1={node.x}
                                            y1={node.y}
                                            x2={target.x}
                                            y2={target.y}
                                            className="stroke-current"
                                            stroke="url(#flowGradient)"
                                            strokeWidth="3"
                                            strokeDasharray="8"
                                            strokeDashoffset={isAnimating ? -dataFlow : "0"}
                                        />
                                    )
                                }
                                return null
                            })}
                            <g
                                onMouseEnter={() => setActiveNode(node)}
                                onMouseLeave={() => setActiveNode(null)}
                                className="cursor-pointer"
                            >
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="25"
                                    className={`
                                        ${node.type === "input" ? "fill-blue-500" : ""}
                                        ${node.type === "hidden" ? "fill-purple-500" : ""}
                                        ${node.type === "output" ? "fill-green-500" : ""}
                                        transition-all duration-300 hover:filter hover:brightness-110
                                    `}
                                />
                                {activeNode?.id === node.id && (
                                    <foreignObject
                                        x={node.x - 100}
                                        y={node.y - 80}
                                        width="200"
                                        height="60"
                                    >
                                        <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-lg text-center text-sm">
                                            <p className="font-bold text-gray-800 dark:text-white">{node.label}</p>
                                            <p className="text-gray-600 dark:text-gray-300 text-xs">{node.description}</p>
                                        </div>
                                    </foreignObject>
                                )}
                            </g>
                        </g>
                    ))}
                </svg>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-8 max-w-3xl">
                <div className="p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg backdrop-blur-sm">
                    <Database className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className="font-bold text-lg dark:text-white mb-2">Data Processing</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Handles and transforms raw input data</p>
                </div>
                <div className="p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg backdrop-blur-sm">
                    <Network className="w-8 h-8 text-purple-500 mb-3" />
                    <h3 className="font-bold text-lg dark:text-white mb-2">Neural Networks</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Processes information in layers</p>
                </div>
                <div className="p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg backdrop-blur-sm">
                    <ArrowRight className="w-8 h-8 text-green-500 mb-3" />
                    <h3 className="font-bold text-lg dark:text-white mb-2">Model Output</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Generates predictions and results</p>
                </div>
            </div>
        </div>
    )
}