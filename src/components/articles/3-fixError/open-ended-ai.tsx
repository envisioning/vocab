"use client"
import { useState, useEffect } from "react"
import { Brain, Sparkles, Tree, Lightbulb, Palette, Music, Code, Book, Info, Zap, Stars } from "lucide-react"

interface OpenEndedAIProps {}

type IdeaType = {
  id: number
  icon: JSX.Element
  text: string
  description: string
  color: string
  x: number
  y: number
}

const OpenEndedAI: React.FC<OpenEndedAIProps> = () => {
  const [ideas, setIdeas] = useState<IdeaType[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  const concepts = [
    {
      icon: <Palette size={28} />,
      text: "Creative Expression",
      description: "Generates original artwork and designs autonomously",
      color: "text-pink-500"
    },
    {
      icon: <Music size={28} />,
      text: "Pattern Recognition",
      description: "Identifies complex patterns across different domains",
      color: "text-purple-500"
    },
    {
      icon: <Stars size={28} />,
      text: "Continuous Learning",
      description: "Evolves and improves through ongoing experiences",
      color: "text-blue-500"
    },
    {
      icon: <Zap size={28} />,
      text: "Adaptive Thinking",
      description: "Adjusts strategies based on new information",
      color: "text-green-500"
    },
    {
      icon: <Tree size={28} />,
      text: "Knowledge Growth",
      description: "Expands understanding beyond initial training",
      color: "text-yellow-500"
    },
    {
      icon: <Lightbulb size={28} />,
      text: "Novel Solutions",
      description: "Discovers unexpected approaches to problems",
      color: "text-orange-500"
    }
  ]

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setIdeas(prev => {
          if (prev.length > 8) return prev.slice(1)
          const concept = concepts[Math.floor(Math.random() * concepts.length)]
          const newIdea: IdeaType = {
            id: Date.now(),
            icon: concept.icon,
            text: concept.text,
            description: concept.description,
            color: concept.color,
            x: Math.random() * 70 + 15,
            y: Math.random() * 70 + 15
          }
          return [...prev, newIdea]
        })
      }, 2500)

      return () => clearInterval(interval)
    }
  }, [isGenerating])

  return (
    <div className="relative min-h-[600px] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 overflow-hidden shadow-xl border border-gray-700">
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <div className="relative group">
          <Brain className="w-10 h-10 text-blue-400 animate-pulse" />
          <div className="absolute left-0 top-12 hidden group-hover:block bg-gray-800 text-white p-3 rounded-lg shadow-xl w-64">
            <h3 className="font-bold mb-2">Open-Ended AI</h3>
            <p className="text-sm">AI systems that continuously learn, adapt, and generate novel solutions without predetermined limits.</p>
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Open-Ended AI
        </h2>
      </div>

      <button
        onClick={() => setIsGenerating(prev => !prev)}
        className={`absolute top-6 right-6 px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-300 transform hover:scale-105 ${
          isGenerating ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        <Sparkles className="w-5 h-5 text-white" />
        <span className="text-white font-semibold">
          {isGenerating ? "Pause Evolution" : "Start Evolution"}
        </span>
      </button>

      <div className="relative w-full h-[450px] mt-20">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="absolute flex items-center gap-3 transition-all duration-500"
            style={{
              left: `${idea.x}%`,
              top: `${idea.y}%`,
            }}
            onMouseEnter={() => setShowTooltip(idea.id)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <div className={`${idea.color} p-3 bg-gray-800/50 rounded-full backdrop-blur-sm`}>
              {idea.icon}
            </div>
            <div className="relative">
              <span className="text-white text-sm font-medium bg-gray-800/90 px-4 py-2 rounded-full shadow-lg">
                {idea.text}
              </span>
              {showTooltip === idea.id && (
                <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white text-sm p-3 rounded-lg shadow-xl w-48 z-10">
                  {idea.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 right-6 text-gray-300 text-sm text-center bg-gray-800/50 backdrop-blur-sm p-4 rounded-full">
        Observe as the AI explores endless possibilities, adapting and evolving with each new iteration
      </div>
    </div>
  )
}

export default OpenEndedAI