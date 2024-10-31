"use client"
import { useState, useEffect } from "react"
import { Brain, CircuitBoard, Zap, Info, Network } from "lucide-react"

interface NodeType {
    id: number
    x: number
    y: number
    active: boolean
    label: string
}

interface NeuralNetworkProps {}

const NeuralNetwork: React.FC<NeuralNetworkProps> = () => {
    const [nodes, setNodes] = useState<NodeType[]>([])
    const [connections, setConnections] = useState<number[][]>([])
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [activePathIndex, setActivePathIndex] = useState<number>(0)
    const [hoveredNode, setHoveredNode] = useState<number | null>(null)

    useEffect(() => {
        const initialNodes = [
            { id: 1, x: 100, y: 150, active: false, label: "Input Layer" },
            { id: 2, x: 100, y: 250, active: false, label: "Input Layer" },
            { id: 3, x: 100, y: 350, active: false, label: "Input Layer" },
            { id: 4, x: 300, y: 200, active: false, label: "Hidden Layer" },
            { id: 5, x: 300, y: 300, active: false, label: "Hidden Layer" },
            { id: 6, x: 500, y: 250, active: false, label: "Output Layer" },
        ]
        const initialConnections = [
            [1, 4], [1, 5], [2, 4], [2, 5],
            [3, 4], [3, 5], [4, 6], [5, 6]
        ]
        setNodes(initialNodes)
        setConnections(initialConnections)

        return () => {
            setNodes([])
            setConnections([])
        }
    }, [])

    useEffect(() => {
        if (isProcessing) {
            const interval = setInterval(() => {
                setActivePathIndex((prev) => {
                    const nextIndex = prev + 1
                    if (nextIndex >= connections.length) {
                        setIsProcessing(false)
                        return 0
                    }
                    const connection = connections[prev]
                    setNodes(prevNodes => prevNodes.map(node => ({
                        ...node,
                        active: [connection[0], connection[1]].includes(node.id)
                    })))
                    return nextIndex
                })
            }, 800)

            return () => clearInterval(interval)
        }
    }, [isProcessing, connections])

    const handleProcess = () => {
        setIsProcessing(true)
        setActivePathIndex(0)
    }

    return (
        <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 overflow-hidden shadow-xl">
            <div className="absolute top-4 left-4 flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Neural Network Simulator</h2>
                    <p className="text-blue-300 text-sm">Visualizing artificial neural connections</p>
                </div>
            </div>

            <div className="absolute top-4 right-4 space-y-2">
                <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg 
                              hover:bg-blue-600 transition duration-300 disabled:opacity-50 shadow-lg"
                >
                    <Zap className="w-5 h-5" />
                    Activate Network
                </button>
            </div>

            <svg className="w-full h-full">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                {connections.map((conn, idx) => {
                    const fromNode = nodes.find((n) => n.id === conn[0])
                    const toNode = nodes.find((n) => n.id === conn[1])
                    if (!fromNode || !toNode) return null

                    return (
                        <line
                            key={`${conn[0]}-${conn[1]}`}
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={idx === activePathIndex && isProcessing ? "#60A5FA" : "#4B5563"}
                            strokeWidth={idx === activePathIndex && isProcessing ? "4" : "2"}
                            className="transition-all duration-500"
                            filter={idx === activePathIndex && isProcessing ? "url(#glow)" : ""}
                        />
                    )
                })}

                {nodes.map((node) => (
                    <g 
                        key={node.id}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={25}
                            className={`
                                ${node.active ? "fill-blue-500" : "fill-gray-700"}
                                transition-all duration-500 cursor-pointer
                            `}
                            stroke={node.active ? "#60A5FA" : "#4B5563"}
                            strokeWidth="3"
                            filter={node.active ? "url(#glow)" : ""}
                        />
                        
                        {hoveredNode === node.id && (
                            <g>
                                <rect
                                    x={node.x + 30}
                                    y={node.y - 15}
                                    width="100"
                                    height="30"
                                    rx="5"
                                    fill="#1F2937"
                                    className="opacity-90"
                                />
                                <text
                                    x={node.x + 80}
                                    y={node.y + 5}
                                    textAnchor="middle"
                                    className="fill-white text-sm"
                                >
                                    {node.label}
                                </text>
                            </g>
                        )}
                    </g>
                ))}
            </svg>

            <div className="absolute bottom-4 left-4 right-4 bg-slate-800 p-4 rounded-lg bg-opacity-80">
                <div className="flex items-center gap-2 text-blue-300">
                    <Info className="w-5 h-5" />
                    <p className="text-sm">
                        Neurons process and transmit information through connections, similar to biological neural networks.
                        Hover over nodes to see their layer type!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NeuralNetwork