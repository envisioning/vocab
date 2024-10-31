"use client"
import { useState, useEffect } from "react"
import { Cpu, Server, Zap, Brain, Activity, Info, ChevronRight, Loader2, Database } from "lucide-react"

interface ComputeUnit {
  id: number
  power: number
  isProcessing: boolean
  type: 'cpu' | 'gpu' | 'tpu' | 'memory'
}

interface Tooltip {
  show: boolean
  content: string
  position: { x: number; y: number }
}

export default function ComputeVisualizer() {
  const [computeUnits, setComputeUnits] = useState<ComputeUnit[]>([])
  const [processingLoad, setProcessingLoad] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [tooltip, setTooltip] = useState<Tooltip>({ show: false, content: '', position: { x: 0, y: 0 } })

  const computeTypes = ['cpu', 'gpu', 'tpu', 'memory']
  const tooltipContent = {
    cpu: "Central Processing Unit: Handles basic computations",
    gpu: "Graphics Processing Unit: Processes parallel tasks",
    tpu: "Tensor Processing Unit: Specialized for AI operations",
    memory: "RAM: Stores active AI model data"
  }

  useEffect(() => {
    const initialUnits = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      power: Math.random() * 100,
      isProcessing: false,
      type: computeTypes[i % 4] as 'cpu' | 'gpu' | 'tpu' | 'memory'
    }))
    setComputeUnits(initialUnits)

    return () => {
      setComputeUnits([])
      setIsAnimating(false)
    }
  }, [])

  const handleMouseEnter = (e: React.MouseEvent, content: string) => {
    setTooltip({
      show: true,
      content,
      position: { x: e.clientX, y: e.clientY - 10 }
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, show: false })
  }

  const handleProcessing = () => {
    if (isAnimating) return
    setIsAnimating(true)
    
    const processUnits = () => {
      setComputeUnits(prev =>
        prev.map(unit => ({
          ...unit,
          isProcessing: Math.random() > 0.3,
          power: Math.random() * 100
        }))
      )
      setProcessingLoad(prev => (prev + 5) % 101)
    }

    const interval = setInterval(processUnits, 300)
    setTimeout(() => {
      clearInterval(interval)
      setIsAnimating(false)
    }, 6000)

    return () => clearInterval(interval)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-5xl font-bold text-blue-300 mb-4 flex items-center justify-center gap-3">
          <Brain className="w-12 h-12 animate-pulse" />
          AI Compute Architecture
        </h1>
        <p className="text-blue-100 max-w-xl text-lg leading-relaxed">
          Explore how different computing components work together to power AI models
        </p>
      </div>

      <div className="relative w-full max-w-3xl p-8 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-500/20">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {computeUnits.map(unit => (
            <div
              key={unit.id}
              onMouseEnter={(e) => handleMouseEnter(e, tooltipContent[unit.type])}
              onMouseLeave={handleMouseLeave}
              className={`relative p-6 rounded-xl transition-all duration-500 transform hover:scale-105
                ${unit.isProcessing ? "bg-blue-500/30 shadow-lg shadow-blue-500/30" : "bg-gray-700/50"}
                border-2 ${unit.isProcessing ? "border-blue-400/50" : "border-transparent"}`}
            >
              <div className="flex flex-col items-center gap-2">
                <Server className={`w-10 h-10 ${unit.isProcessing ? "text-blue-300" : "text-gray-400"}`} />
                <span className="text-xs font-mono text-blue-200 uppercase">{unit.type}</span>
                {unit.isProcessing && (
                  <Activity className="w-5 h-5 text-green-400 absolute top-2 right-2 animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="relative h-6 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 transition-all duration-300"
            style={{ width: `${processingLoad}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-blue-100">
            {processingLoad}% Utilization
          </div>
        </div>

        <button
          onClick={handleProcessing}
          disabled={isAnimating}
          className={`mt-8 px-8 py-4 rounded-xl flex items-center justify-center gap-3 w-full text-lg font-semibold
            ${isAnimating ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"} 
            transition-all duration-300 transform hover:scale-[1.02]`}
        >
          {isAnimating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing Workload...
            </>
          ) : (
            <>
              <Zap className="w-6 h-6" />
              Initialize Compute
            </>
          )}
        </button>
      </div>

      {tooltip.show && (
        <div 
          className="fixed bg-gray-900 text-blue-100 p-4 rounded-lg shadow-xl border border-blue-500/30 text-sm max-w-xs"
          style={{ left: tooltip.position.x + 10, top: tooltip.position.y + 10 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}