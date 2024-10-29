"use client"
import { useState, useEffect } from "react"
import { Brain, BookOpen, Zap, Database, Cpu, GitBranch, AlertTriangle } from "lucide-react"

interface Resource {
  name: string
  level: number
  icon: JSX.Element
  description: string
}

interface Generation {
  number: number
  capabilities: string[]
  resources: Resource[]
}

const RSISimulator = () => {
  const [generation, setGeneration] = useState<number>(1)
  const [resources, setResources] = useState<Resource[]>([
    {
      name: "Processing Power",
      level: 1,
      icon: <Cpu className="w-6 h-6" />,
      description: "Computational capabilities"
    },
    {
      name: "Knowledge Base", 
      level: 1,
      icon: <Database className="w-6 h-6" />,
      description: "Accumulated information"
    },
    {
      name: "Algorithm Efficiency",
      level: 1,
      icon: <GitBranch className="w-6 h-6" />,
      description: "Code optimization level"
    }
  ])
  const [isImproving, setIsImproving] = useState<boolean>(false)
  const [selectedResource, setSelectedResource] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")

  useEffect(() => {
    if (isImproving) {
      const timer = setInterval(() => {
        improveResources()
      }, 2000)
      return () => clearInterval(timer)
    }
  }, [isImproving, resources])

  const improveResources = () => {
    setResources(prev => prev.map(resource => {
      if (resource.name === selectedResource) {
        return {
          ...resource,
          level: Math.min(10, resource.level + 1)
        }
      }
      return {
        ...resource,
        level: Math.min(10, resource.level + 0.2)
      }
    }))
    setGeneration(prev => prev + 1)
  }

  const handleResourceSelect = (name: string) => {
    setSelectedResource(name)
    setFeedback(`Focusing improvement on ${name}`)
  }

  const handleStart = () => {
    if (!selectedResource) {
      setFeedback("Please select a resource to improve first")
      return
    }
    setIsImproving(true)
  }

  const handleReset = () => {
    setIsImproving(false)
    setGeneration(1)
    setResources(prev => prev.map(r => ({ ...r, level: 1 })))
    setSelectedResource("")
    setFeedback("")
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg" role="main">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">AI Self-Improvement Simulator</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Generation {generation}
          </h2>
          
          <div className="space-y-4">
            {resources.map(resource => (
              <button
                key={resource.name}
                onClick={() => handleResourceSelect(resource.name)}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  selectedResource === resource.name 
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                aria-pressed={selectedResource === resource.name}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {resource.icon}
                    <span>{resource.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(resource.level/10)*100}%` }}
                      />
                    </div>
                    <span className="text-sm">{resource.level.toFixed(1)}/10</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Improvement Controls
          </h2>

          {feedback && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {feedback}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleStart}
              disabled={isImproving}
              className="w-full py-2 px-4 rounded-lg bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              Start Improvement Cycle
            </button>

            <button
              onClick={handleReset}
              className="w-full py-2 px-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
            >
              Reset Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RSISimulator