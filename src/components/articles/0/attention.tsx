"use client"
import { useState, useEffect } from 'react'
import { 
  Brain, 
  Sparkles, 
  Zap, 
  ArrowRight,
  Image,
  MessageSquare,
  Database,
  Network,
  Heart,
  Blocks,
  GitBranch
} from 'lucide-react'

interface AttentionNode {
  id: string
  label: string
  description: string
  strength: number
  icon: JSX.Element
}

const AttentionDemo = () => {
  const [focusedId, setFocusedId] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [energy, setEnergy] = useState(0)

  const nodes: AttentionNode[] = [
    { 
      id: '1', 
      label: 'Visual Input', 
      description: 'Processing visual information', 
      strength: 0.9,
      icon: <Image className="w-4 h-4 sm:w-6 sm:h-6" />
    },
    { 
      id: '2', 
      label: 'Language', 
      description: 'Understanding text and speech', 
      strength: 0.8,
      icon: <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6" />
    },
    { 
      id: '3', 
      label: 'Memory', 
      description: 'Accessing stored knowledge', 
      strength: 0.7,
      icon: <Database className="w-4 h-4 sm:w-6 sm:h-6" />
    },
    { 
      id: '4', 
      label: 'Logic', 
      description: 'Reasoning and analysis', 
      strength: 0.85,
      icon: <Network className="w-4 h-4 sm:w-6 sm:h-6" />
    },
    { 
      id: '5', 
      label: 'Emotion', 
      description: 'Understanding context and tone', 
      strength: 0.6,
      icon: <Heart className="w-4 h-4 sm:w-6 sm:h-6" />
    },
    { 
      id: '6', 
      label: 'Patterns', 
      description: 'Recognizing patterns', 
      strength: 0.75,
      icon: <Blocks className="w-4 h-4 sm:w-6 sm:h-6" />
    },
    { 
      id: '7', 
      label: 'Integration', 
      description: 'Combining information', 
      strength: 0.95,
      icon: <GitBranch className="w-4 h-4 sm:w-6 sm:h-6" />
    }
  ]

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const nextId = Math.floor(Math.random() * nodes.length + 1).toString()
        setFocusedId(nextId)
        setEnergy(prev => (prev + 1) % 100)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const getNodePosition = (index: number, total: number) => {
    const angle = ((index * 2 * Math.PI) / total) + Math.PI/2
    const radius = typeof window !== 'undefined' && window.innerWidth < 640 ? 35 : 40
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 bg-gray-900 flex flex-col items-center justify-center">
      <div className="text-center mb-2">
        <h2 className="mt-6 text-xl sm:text-2xl font-bold text-blue-400 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          Neural Attention Flow
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 mb-2 max-w-2xl mx-auto px-2">
          Experience how AI dynamically focuses its attention, creating a symphony of neural connections
          to process information.
        </p>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="my-8 px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto group"
        >
          {isPlaying ? 'Pause Flow' : 'Start Flow'}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      <div className="mb-6 relative aspect-square w-full max-w-[280px] sm:max-w-lg mx-auto rounded-full bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden border border-gray-700">
        {/* Central Brain */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20">
          <div className={`absolute inset-0 rounded-full bg-blue-500 opacity-10 transform transition-transform duration-1000 ${isPlaying ? 'scale-150' : 'scale-100'}`} />
          <div className={`absolute inset-0 rounded-full bg-purple-500 opacity-10 transform transition-transform duration-1000 delay-100 ${isPlaying ? 'scale-125' : 'scale-100'}`} />
          <Brain className="w-full h-full text-blue-400 animate-pulse" />
        </div>

        {/* Attention Nodes */}
        {nodes.map((node, index) => {
          const pos = getNodePosition(index, nodes.length)
          const isFocused = focusedId === node.id
          const baseOpacity = isFocused ? 'opacity-100' : 'opacity-70'
          const bgOpacity = isFocused ? 'opacity-20' : 'opacity-10'

          return (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${baseOpacity} cursor-pointer group`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => setFocusedId(node.id)}
            >
              {/* Connection Lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className={`h-px transform origin-center transition-all duration-500 ${isFocused ? 'w-full bg-gradient-to-r from-blue-500 to-purple-500' : 'w-1/2 bg-gray-600'}`}
                  style={{
                    transform: `rotate(${Math.atan2(50 - pos.y, 50 - pos.x) * (180 / Math.PI)}deg)`
                  }}
                >
                  {isFocused && (
                    <div className="absolute top-1/2 transform -translate-y-1/2 animate-ping">
                      <Zap className="w-3 h-3 text-blue-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Node Circle */}
              <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${isFocused ? 'scale-125' : ''}`}>
                <div className={`absolute inset-0 rounded-full transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-purple-500 ${bgOpacity}`} />
                <div className={`relative z-10 text-blue-${isFocused ? '400' : '200'}`}>
                  {node.icon}
                </div>
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <div className="bg-gray-800 text-white px-2 py-1 rounded-lg shadow-lg border border-gray-700 text-xs whitespace-nowrap">
                    <p className="font-semibold">{node.label}</p>
                    <p className="text-[10px] text-gray-400">{node.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Energy Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-400 rounded-full opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${2 + Math.random() * 3}s infinite`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); }
        }
      `}</style>
    </div>
  )
}

export default AttentionDemo