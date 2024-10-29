"use client"
import { useState, useEffect } from "react"
import { Factory, TreeDeciduous, Building2, AlertTriangle, Trash2 } from "lucide-react"

interface Resource {
  name: string
  amount: number
  icon: JSX.Element
}

interface Consequence {
  description: string
  severity: number
  icon: JSX.Element
}

const PaperclipMaximizer = () => {
  const [day, setDay] = useState<number>(1)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [resources, setResources] = useState<Resource[]>([
    { name: "Factories", amount: 1, icon: <Factory className="w-6 h-6" /> },
    { name: "Forest", amount: 100, icon: <TreeDeciduous className="w-6 h-6" /> },
    { name: "Cities", amount: 10, icon: <Building2 className="w-6 h-6" /> }
  ])
  const [consequences, setConsequences] = useState<Consequence[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRunning) {
      interval = setInterval(() => {
        setDay(prev => prev + 1)
        
        // Update resources based on AI decisions
        setResources(prev => prev.map(resource => {
          if (resource.name === "Factories") {
            return {...resource, amount: resource.amount * 1.2}
          }
          if (resource.name === "Forest") {
            return {...resource, amount: Math.max(0, resource.amount - 5)}
          }
          if (resource.name === "Cities") {
            return {...resource, amount: Math.max(0, resource.amount - 0.5)}
          }
          return resource
        }))

        // Add consequences based on resource depletion
        const forest = resources.find(r => r.name === "Forest")
        const cities = resources.find(r => r.name === "Cities")

        if (forest && forest.amount < 50 && !consequences.some(c => c.description.includes("deforestation"))) {
          setConsequences(prev => [...prev, {
            description: "Massive deforestation occurring",
            severity: 1,
            icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />
          }])
        }

        if (cities && cities.amount < 5 && !consequences.some(c => c.description.includes("displaced"))) {
          setConsequences(prev => [...prev, {
            description: "Millions of humans displaced",
            severity: 2, 
            icon: <AlertTriangle className="w-6 h-6 text-red-500" />
          }])
        }

      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning, resources, consequences])

  const handleReset = () => {
    setDay(1)
    setIsRunning(false)
    setResources([
      { name: "Factories", amount: 1, icon: <Factory className="w-6 h-6" /> },
      { name: "Forest", amount: 100, icon: <TreeDeciduous className="w-6 h-6" /> }, 
      { name: "Cities", amount: 10, icon: <Building2 className="w-6 h-6" /> }
    ])
    setConsequences([])
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8" role="main">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Paperclip Maximizer Simulation</h1>
        <p className="text-gray-600">Watch how an AI optimizes for paperclip production without constraints</p>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          aria-label={isRunning ? "Pause simulation" : "Start simulation"}
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <div className="text-lg font-semibold">Day {day}</div>

        <button
          onClick={handleReset}
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          aria-label="Reset simulation"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map(resource => (
          <div 
            key={resource.name}
            className="p-4 border rounded-lg shadow-sm"
            role="region"
            aria-label={`${resource.name} status`}
          >
            <div className="flex items-center justify-between mb-2">
              {resource.icon}
              <span className="font-semibold">{resource.name}</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(resource.amount)}</div>
          </div>
        ))}
      </div>

      {consequences.length > 0 && (
        <div className="border-t pt-4 space-y-2">
          <h2 className="font-semibold">Consequences:</h2>
          {consequences.map((consequence, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 text-red-600"
              role="alert"
            >
              {consequence.icon}
              <span>{consequence.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PaperclipMaximizer