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
      // Keep load between 60-95% to simulate real-world compute limitations
      setProcessingLoad(prev => {
        const newLoad = prev + Math.random() * 5;
        return newLoad >= 95 ? 60 : newLoad;
      })
    }

    const interval = setInterval(processUnits, 300)
  }

  return (
    <div className="flex flex-col items-center min-h-fit pt-8 sm:pt-12 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 p-4 sm:p-6 lg:p-8 pb-8">
      <div className="text-center mb-6 space-y-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-300 mb-2 flex items-center justify-center gap-2 sm:gap-3">
          <Brain className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 animate-pulse" />
          AI Compute Architecture
        </h1>
        <p className="text-blue-800 dark:text-blue-100 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed px-4">
          Explore how different computing components work together to power AI models
        </p>
      </div>

      <div className="relative w-full max-w-3xl p-4 sm:p-6 lg:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-500/20">
        <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
          {computeUnits.map(unit => (
            <div
              key={unit.id}
              onMouseEnter={(e) => handleMouseEnter(e, tooltipContent[unit.type])}
              onMouseLeave={handleMouseLeave}
              className={`relative p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl transition-all duration-500 transform hover:scale-105
                ${unit.isProcessing 
                  ? "bg-blue-100/80 dark:bg-blue-500/30 shadow-lg shadow-blue-200/50 dark:shadow-blue-500/30" 
                  : "bg-gray-100/80 dark:bg-gray-700/50"}
                border-2 ${unit.isProcessing ? "border-blue-300 dark:border-blue-400/50" : "border-transparent"}`}
            >
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <Server className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${unit.isProcessing ? "text-blue-600 dark:text-blue-300" : "text-gray-400"}`} />
                <span className="text-[10px] sm:text-xs font-mono text-blue-900 dark:text-blue-200 uppercase">{unit.type}</span>
                {unit.isProcessing && (
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-500 dark:text-green-400 absolute top-1 right-1 sm:top-2 sm:right-2 animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="relative h-4 sm:h-6 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 dark:from-blue-600 dark:via-blue-400 dark:to-blue-500 transition-all duration-300"
            style={{ width: `${processingLoad}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-mono text-blue-900 dark:text-blue-100">
            {Math.floor(processingLoad)}% Utilization
          </div>
        </div>

        <div className="mt-4 text-center text-xs sm:text-sm text-blue-900/80 dark:text-blue-200/80 max-w-lg mx-auto">
          <Info className="inline-block w-4 h-4 mr-1 mb-1" />
          The compute load fluctuates between 60-95%, mirroring real AI systems where achieving 100% utilization is impractical due to task scheduling, memory management, and thermal constraints.
        </div>

        <button
          onClick={handleProcessing}
          disabled={isAnimating}
          className={`mt-4 sm:mt-6 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 sm:gap-3 w-full text-sm sm:text-base lg:text-lg font-semibold text-white
            ${isAnimating 
              ? "bg-gray-400 dark:bg-gray-600" 
              : "bg-blue-500 hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500"} 
            transition-all duration-300 transform hover:scale-[1.02]`}
        >
          {isAnimating ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 animate-spin" />
              Processing Workload...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              Initialize Compute
            </>
          )}
        </button>
      </div>

      {tooltip.show && (
        <div 
          className="fixed bg-white dark:bg-gray-900 text-blue-900 dark:text-blue-100 p-3 sm:p-4 rounded-lg shadow-xl border border-blue-200 dark:border-blue-500/30 text-xs sm:text-sm max-w-xs"
          style={{ left: tooltip.position.x + 10, top: tooltip.position.y + 10 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}