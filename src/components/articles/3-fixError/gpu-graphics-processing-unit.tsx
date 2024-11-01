"use client"
import { useState, useEffect } from "react"
import { Cpu, Gpu, Zap, Info, Clock, Maximize2, Layers, ArrowRight } from "lucide-react"

interface ComponentProps {}

interface Task {
  id: number
  processed: boolean
}

const GPUSimulator: React.FC<ComponentProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isParallel, setIsParallel] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  const [completedCount, setCompletedCount] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<string>("")

  useEffect(() => {
    const initialTasks = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      processed: false,
    }))
    setTasks(initialTasks)

    return () => {
      setTasks([])
      setProcessing(false)
    }
  }, [])

  const processTask = () => {
    setProcessing(true)
    if (isParallel) {
      const timer = setTimeout(() => {
        setTasks((prev) => prev.map((task) => ({ ...task, processed: true })))
        setCompletedCount(24)
        setProcessing(false)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      let count = 0
      const interval = setInterval(() => {
        if (count < tasks.length) {
          setTasks((prev) =>
            prev.map((task, idx) =>
              idx === count ? { ...task, processed: true } : task
            )
          )
          setCompletedCount((prev) => prev + 1)
          count++
        } else {
          clearInterval(interval)
          setProcessing(false)
        }
      }, 200)
      return () => clearInterval(interval)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-3xl w-full space-y-8 border border-gray-700">
        <div className="relative flex items-center justify-center space-x-4 bg-gray-900 p-6 rounded-2xl">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {isParallel ? "GPU Processing" : "CPU Processing"}
          </h2>
          {isParallel ? (
            <Gpu className="w-10 h-10 text-blue-400 animate-pulse" />
          ) : (
            <Cpu className="w-10 h-10 text-gray-400" />
          )}
          <Info
            className="absolute right-4 top-4 w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-400 transition-colors duration-300"
            onMouseEnter={() => setShowTooltip("mode")}
            onMouseLeave={() => setShowTooltip("")}
          />
          {showTooltip === "mode" && (
            <div className="absolute -top-12 right-0 bg-gray-900 text-white p-3 rounded-lg text-sm shadow-xl border border-gray-700">
              {isParallel ? "Processes multiple tasks simultaneously" : "Processes one task at a time"}
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-6">
          <button
            onClick={() => setIsParallel(false)}
            className={`group relative px-8 py-4 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
              !isParallel ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>Sequential</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsParallel(true)}
            className={`group relative px-8 py-4 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
              isParallel ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            <Layers className="w-5 h-5" />
            <span>Parallel</span>
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-4 bg-gray-900 p-6 rounded-2xl">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`aspect-square rounded-xl transition-all duration-500 flex items-center justify-center ${
                task.processed
                  ? "bg-gradient-to-br from-green-400 to-green-600 transform scale-95"
                  : "bg-gray-700"
              }`}
            >
              {task.processed && (
                <div className="w-3 h-3 bg-white rounded-full animate-ping" />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center bg-gray-900 p-6 rounded-2xl">
          <div className="text-gray-300 flex items-center space-x-2">
            <span className="text-xl font-semibold">
              {completedCount} / {tasks.length}
            </span>
            <span className="text-sm text-gray-400">tasks completed</span>
          </div>
          <button
            onClick={processTask}
            disabled={processing}
            className={`px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
              processing
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            } text-white`}
          >
            <Zap className={`w-6 h-6 ${processing ? "animate-pulse" : ""}`} />
            <span className="font-semibold">Process Tasks</span>
          </button>
        </div>

        <div className="text-center text-lg font-medium bg-gray-900 p-4 rounded-xl">
          <span className={`${isParallel ? "text-blue-400" : "text-gray-400"}`}>
            {isParallel
              ? "⚡ GPU processes all tasks in parallel for maximum efficiency!"
              : "🔄 CPU handles tasks one by one in sequence"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default GPUSimulator