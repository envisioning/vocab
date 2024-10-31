"use client"
import { useState, useEffect } from "react"
import { Brain, Cog, Lightbulb, Search, User, Zap, Info, Database, Network, Cpu } from "lucide-react"

interface ThoughtBubble {
  id: number
  icon: JSX.Element
  text: string
  description: string
  position: { x: number; y: number }
}

const CognitiveComputingDemo = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [activeThought, setActiveThought] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  const thoughtBubbles: ThoughtBubble[] = [
    {
      id: 1,
      icon: <Database className="text-blue-500 w-8 h-8" />,
      text: "Data Collection",
      description: "Gathering and organizing raw information from multiple sources",
      position: { x: 15, y: 20 }
    },
    {
      id: 2,
      icon: <Search className="text-purple-500 w-8 h-8" />,
      text: "Pattern Recognition",
      description: "Identifying meaningful patterns and relationships in data",
      position: { x: 35, y: 10 }
    },
    {
      id: 3,
      icon: <Network className="text-green-500 w-8 h-8" />,
      text: "Neural Processing",
      description: "Processing information through artificial neural networks",
      position: { x: 55, y: 20 }
    },
    {
      id: 4,
      icon: <Cpu className="text-yellow-500 w-8 h-8" />,
      text: "Decision Making",
      description: "Evaluating options and selecting optimal solutions",
      position: { x: 75, y: 10 }
    }
  ]

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setActiveThought((prev) => (prev + 1) % thoughtBubbles.length)
        setProgress((prev) => Math.min(prev + 1.5, 100))
      }, 1200)
      return () => clearInterval(interval)
    }
  }, [isProcessing])

  const handleStart = () => {
    setIsProcessing(true)
    setProgress(0)
  }

  const handleReset = () => {
    setIsProcessing(false)
    setActiveThought(0)
    setProgress(0)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="absolute top-4 right-4 text-white flex items-center gap-2">
        <Info className="w-5 h-5" />
        <span className="text-sm">Hover over elements to learn more</span>
      </div>

      <h1 className="text-4xl font-bold text-white mb-4">Cognitive Computing</h1>
      <p className="text-blue-200 mb-12 text-center max-w-lg">
        Exploring how computers simulate human thought processes through advanced algorithms and neural networks
      </p>

      <div className="relative w-[800px] h-[400px] mb-12">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative group">
            <Brain 
              className={`w-32 h-32 ${
                isProcessing ? 'text-blue-400 animate-pulse' : 'text-gray-400'
              } transition-colors duration-500`}
            />
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Digital Brain Simulation
            </div>
            <User className="w-16 h-16 text-blue-300 absolute -top-10 -left-16 animate-bounce" />
            <Zap className={`w-10 h-10 absolute top-0 right-0 ${
              isProcessing ? 'text-yellow-400 animate-ping' : 'text-gray-400'
            }`} />
          </div>
        </div>

        {thoughtBubbles.map((bubble, index) => (
          <div
            key={bubble.id}
            className={`absolute transition-all duration-500 transform cursor-help
              ${activeThought === index ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}
            style={{ left: `${bubble.position.x}%`, top: `${bubble.position.y}%` }}
            onMouseEnter={() => setShowTooltip(bubble.id)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl flex flex-col items-center gap-3 border border-white/20">
              {bubble.icon}
              <span className="text-white font-medium">{bubble.text}</span>
              {showTooltip === bubble.id && (
                <div className="absolute top-full mt-2 bg-black/90 text-white p-3 rounded-lg w-48 text-sm">
                  {bubble.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="w-96 h-3 bg-gray-700/50 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>

      <div className="flex gap-6">
        <button
          onClick={handleStart}
          disabled={isProcessing}
          className={`px-8 py-3 rounded-full font-medium text-lg
            ${isProcessing
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            } text-white transition-all duration-300 transform hover:scale-105`}
        >
          Start Processing
        </button>
        <button
          onClick={handleReset}
          className="px-8 py-3 rounded-full font-medium text-lg bg-gray-700 hover:bg-gray-600 text-white transition-all duration-300 transform hover:scale-105"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default CognitiveComputingDemo