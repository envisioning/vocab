"use client"
import { useState, useEffect } from "react"
import { Sparkles, PenTool, Music, Code, Camera, Info, Wand2 } from "lucide-react"

interface GenerativeAIProps {}

type CreationType = {
  id: number
  icon: React.ReactNode
  label: string
  description: string
  color: string
  generated: string[]
}

const CREATIONS: CreationType[] = [
  {
    id: 1,
    icon: <PenTool size={24} />,
    label: "Story",
    description: "Creates unique narratives, poetry, and creative writing",
    color: "text-pink-500",
    generated: ["🌟 An enchanted forest whispered secrets...", "✨ Through time and space, destiny called...", "🌙 In the heart of ancient mysteries..."]
  },
  {
    id: 2,
    icon: <Music size={24} />,
    label: "Music",
    description: "Composes melodies, harmonies, and complete songs",
    color: "text-purple-500",
    generated: ["🎵 Ethereal symphony in D minor", "🎸 Cosmic jazz fusion rhythm", "🎹 Dreamy lo-fi atmosphere"]
  },
  {
    id: 3,
    icon: <Code size={24} />,
    label: "Code",
    description: "Generates programming solutions and algorithms",
    color: "text-blue-500",
    generated: ["💻 Creating AI model architecture...", "⚡ Optimizing neural networks...", "🔮 Building smart algorithms..."]
  },
  {
    id: 4,
    icon: <Camera size={24} />,
    label: "Image",
    description: "Produces digital artwork and visual designs",
    color: "text-green-500",
    generated: ["🎨 Painting digital dreams...", "🖼 Crafting visual stories...", "🌅 Blending colors of imagination..."]
  }
]

export default function GenerativeAI({}: GenerativeAIProps) {
  const [selectedType, setSelectedType] = useState<CreationType>(CREATIONS[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentOutput, setCurrentOutput] = useState(0)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentOutput(prev => (prev + 1) % selectedType.generated.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isGenerating, selectedType])

  return (
    <div className="min-h-[500px] p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl">
      <div className="flex flex-col items-center space-y-6 md:space-y-8">
        <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-full">
          <Wand2 className="w-6 h-6 text-yellow-400 animate-pulse" />
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 text-transparent bg-clip-text">
            Generative AI Laboratory
          </h2>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:space-x-4">
          {CREATIONS.map(type => (
            <div key={type.id} className="relative">
              <button
                onMouseEnter={() => setShowTooltip(type.id)}
                onMouseLeave={() => setShowTooltip(null)}
                onClick={() => setSelectedType(type)}
                className={`flex flex-col items-center p-3 md:p-4 rounded-lg transition-all duration-300 w-full
                  ${selectedType.id === type.id 
                    ? 'bg-gray-700 shadow-lg scale-105 ring-2 ring-blue-400' 
                    : 'bg-gray-800 hover:bg-gray-700 hover:scale-105'}`}
              >
                <div className={`${type.color} transition-transform duration-300 hover:scale-110`}>
                  {type.icon}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-200">
                  {type.label}
                </span>
              </button>
              {showTooltip === type.id && (
                <div className="absolute z-10 w-48 p-2 text-xs text-gray-200 bg-gray-800 rounded-md shadow-xl -bottom-12 left-1/2 transform -translate-x-1/2">
                  {type.description}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="w-full max-w-md">
          <div className="relative overflow-hidden">
            <div className="h-40 p-4 bg-gray-800 rounded-lg shadow-inner border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`${selectedType.color} transform transition-all duration-300 hover:scale-110`}>
                  {selectedType.icon}
                </div>
                <button
                  onClick={() => setIsGenerating(!isGenerating)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105
                    ${isGenerating 
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'}`}
                >
                  {isGenerating ? 'Stop Generation' : 'Start Generation'}
                </button>
              </div>
              
              <div className="text-center">
                <p className={`text-gray-200 transition-all duration-500 text-lg
                  ${isGenerating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  {selectedType.generated[currentOutput]}
                </p>
              </div>
            </div>

            {isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shimmer" />
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-gray-400 bg-gray-800/50 p-3 rounded-full">
          <Info size={16} />
          <p className="text-sm text-center">
            Explore how AI creates different types of content through pattern recognition and learning
          </p>
        </div>
      </div>
    </div>
  )
}