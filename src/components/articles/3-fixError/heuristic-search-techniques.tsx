"use client"
import { useState, useEffect } from "react"
import { Target, Circle, ArrowRight, Brain, Info, Compass, Flag } from "lucide-react"

interface NodeProps {
  x: number
  y: number
  value: number
  isVisited: boolean
  isTarget: boolean
  isCurrent: boolean
}

interface TooltipProps {
  show: boolean
  x: number
  y: number
  message: string
}

export default function HeuristicSearchDemo() {
  const [nodes, setNodes] = useState<NodeProps[]>([])
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number>(0)
  const [isSearching, setIsSearching] = useState(false)
  const [foundTarget, setFoundTarget] = useState(false)
  const [steps, setSteps] = useState(0)
  const [tooltip, setTooltip] = useState<TooltipProps>({ show: false, x: 0, y: 0, message: '' })

  useEffect(() => {
    const initialNodes: NodeProps[] = Array.from({ length: 8 }, (_, i) => ({
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 300,
      value: Math.floor(Math.random() * 100),
      isVisited: false,
      isTarget: i === 7,
      isCurrent: i === 0
    }))
    setNodes(initialNodes)
    return () => setNodes([])
  }, [])

  useEffect(() => {
    if (isSearching && !foundTarget) {
      const searchInterval = setInterval(() => {
        setNodes(prev => {
          const current = prev[currentNodeIndex]
          if (current.isTarget) {
            setFoundTarget(true)
            setIsSearching(false)
            return prev
          }

          const target = prev.find(n => n.isTarget)!
          let nextNodeIndex = currentNodeIndex
          let minDistance = Infinity

          prev.forEach((node, index) => {
            if (!node.isVisited && !node.isTarget) {
              const distance = Math.sqrt(
                Math.pow(target.x - node.x, 2) + Math.pow(target.y - node.y, 2)
              )
              if (distance < minDistance) {
                minDistance = distance
                nextNodeIndex = index
              }
            }
          })

          const newNodes = prev.map((node, i) => ({
            ...node,
            isVisited: i === currentNodeIndex ? true : node.isVisited,
            isCurrent: i === nextNodeIndex
          }))

          setCurrentNodeIndex(nextNodeIndex)
          setSteps(s => s + 1)
          return newNodes
        })
      }, 800)

      return () => clearInterval(searchInterval)
    }
  }, [isSearching, currentNodeIndex, foundTarget])

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 overflow-hidden shadow-2xl">
      <div className="absolute top-6 left-6 space-y-4 bg-slate-700/50 p-4 rounded-lg backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-blue-400">
            Heuristic Pathfinding
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-slate-300">
          <Compass className="w-5 h-5" />
          <p>AI uses smart guesses to find the optimal path</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsSearching(true)}
            disabled={isSearching || foundTarget}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 
            transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-blue-500/20"
          >
            <Flag className="w-4 h-4" />
            <span>Start Search</span>
          </button>
          <div className="px-6 py-3 bg-slate-600/50 text-slate-200 rounded-lg backdrop-blur-sm">
            Steps: {steps}
          </div>
        </div>
      </div>

      <div className="relative w-full h-full">
        {nodes.map((node, i) => (
          <div
            key={i}
            style={{ left: node.x, top: node.y }}
            className={`absolute transition-all duration-500 ${
              node.isCurrent ? "scale-150" : node.isVisited ? "opacity-40" : "opacity-100"
            }`}
            onMouseEnter={() => setTooltip({
              show: true,
              x: node.x,
              y: node.y,
              message: node.isTarget ? 'Target Node' : node.isCurrent ? 'Current Position' : 'Unexplored Node'
            })}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          >
            {node.isTarget ? (
              <Target className={`w-10 h-10 ${foundTarget ? "text-green-400" : "text-red-400"} 
              drop-shadow-lg animate-pulse`} />
            ) : node.isCurrent ? (
              <Circle className="w-10 h-10 text-blue-400 animate-ping" />
            ) : (
              <Circle className={`w-10 h-10 ${node.isVisited ? "text-slate-500" : "text-slate-300"} 
              transition-colors duration-300`} />
            )}
          </div>
        ))}

        {tooltip.show && (
          <div
            style={{ left: tooltip.x + 20, top: tooltip.y - 20 }}
            className="absolute bg-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm z-10 
            shadow-xl transition-all duration-300"
          >
            {tooltip.message}
          </div>
        )}

        {isSearching && nodes.map((node, i) => {
          const nextNode = nodes[currentNodeIndex]
          if (node.isCurrent) {
            return (
              <ArrowRight
                key={`arrow-${i}`}
                className="absolute w-8 h-8 text-blue-400 animate-pulse"
                style={{
                  left: (node.x + nextNode.x) / 2,
                  top: (node.y + nextNode.y) / 2,
                  transform: `rotate(${Math.atan2(nextNode.y - node.y, nextNode.x - node.x)}rad)`,
                }}
              />
            )
          }
          return null
        })}
      </div>

      {foundTarget && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-green-500 text-white px-8 py-6 rounded-xl shadow-2xl backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <p className="text-xl font-bold">Target Found!</p>
          </div>
          <p className="mt-2">Solved in {steps} steps</p>
        </div>
      )}
    </div>
  )
}