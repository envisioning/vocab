"use client"
import { useState, useEffect } from "react"
import { Cpu, Server, Timer, Zap, Info, Check, RefreshCcw } from "lucide-react"

interface ComponentProps {}

type Task = {
  id: number
  size: number
  status: "waiting" | "processing" | "complete"
}

export default function ComputeEfficiencyDemo({}: ComponentProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [cpuLoad, setCpuLoad] = useState(0)
  const [isOptimized, setIsOptimized] = useState(false)
  const [score, setScore] = useState(0)
  const [showTooltip, setShowTooltip] = useState("")

  useEffect(() => {
    const generateTasks = () => {
      const initialTasks: Task[] = Array.from({length: 6}, (_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 40) + 10,
        status: "waiting"
      }))
      setTasks(initialTasks)
    }
    generateTasks()

    return () => {
      setTasks([])
      setCpuLoad(0)
      setScore(0)
    }
  }, [])

  const processTask = (taskId: number) => {
    if (cpuLoad >= 100) {
      setShowTooltip("CPU is at maximum capacity!")
      return
    }

    setTasks(prev => prev.map(task => 
      task.id === taskId ? {...task, status: "processing"} : task
    ))
    setCpuLoad(prev => prev + tasks.find(t => t.id === taskId)?.size || 0)
  }

  const completeTask = (taskId: number) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? {...task, status: "complete"} : task
    ))
    setCpuLoad(prev => prev - tasks.find(t => t.id === taskId)?.size || 0)
    setScore(prev => prev + 10)
  }

  const toggleOptimization = () => {
    setIsOptimized(!isOptimized)
    if (!isOptimized) {
      setTasks(prev => [...prev].sort((a, b) => a.size - b.size))
    }
  }

  const resetGame = () => {
    setTasks([])
    setCpuLoad(0)
    setScore(0)
    setIsOptimized(false)
    const newTasks: Task[] = Array.from({length: 6}, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 40) + 10,
      status: "waiting"
    }))
    setTasks(newTasks)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-pulse">
            Compute Efficiency Explorer
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Master resource optimization by efficiently managing CPU tasks!
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-gray-700 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 group relative">
              <Cpu className="w-6 h-6 text-blue-400" />
              <div className="w-32 md:w-48 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    cpuLoad > 80 ? 'bg-red-500' : 'bg-blue-500'
                  } ${cpuLoad > 0 ? 'animate-pulse' : ''}`}
                  style={{width: `${cpuLoad}%`}}
                />
              </div>
              <div className="absolute -top-8 left-0 hidden group-hover:block bg-gray-800 p-2 rounded text-xs">
                CPU Load: {cpuLoad}%
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                <span className="text-xl font-bold">{score}</span>
              </div>
              <button
                onClick={resetGame}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-300"
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tasks.map(task => (
              <div 
                key={task.id}
                className={`relative p-4 rounded-lg border transition-all duration-300 cursor-pointer transform hover:scale-105
                  ${task.status === 'waiting' 
                    ? 'border-gray-600 hover:border-blue-400 bg-gray-800/30' 
                    : task.status === 'processing'
                    ? 'border-yellow-400 bg-yellow-400/10 animate-pulse'
                    : 'border-green-400 bg-green-400/10'
                  }`}
                onClick={() => task.status === 'waiting' 
                  ? processTask(task.id)
                  : task.status === 'processing'
                  ? completeTask(task.id)
                  : null
                }
              >
                <div className="flex justify-between items-center">
                  <Server className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-mono bg-gray-900/50 px-2 py-1 rounded">
                    {task.size}MB
                  </span>
                </div>
                <div className="absolute bottom-2 right-2">
                  {task.status === 'waiting' && <Timer className="w-4 h-4 text-gray-400" />}
                  {task.status === 'processing' && (
                    <div className="animate-spin">
                      <Cpu className="w-4 h-4 text-yellow-400" />
                    </div>
                  )}
                  {task.status === 'complete' && <Check className="w-4 h-4 text-green-400" />}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={toggleOptimization}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                ${isOptimized 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
            >
              <Info className="w-4 h-4" />
              {isOptimized ? 'Optimized' : 'Optimize Tasks'}
            </button>
            {showTooltip && (
              <div className="text-red-400 text-sm animate-fade-out">
                {showTooltip}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}