"use client"
import { useState, useEffect } from "react"
import { Brain, Music, Code, Palette, Calculator, Book, Microscope, Globe, Info, Sparkles } from "lucide-react"

interface PolymathSkill {
  icon: React.ReactNode
  name: string
  description: string
  color: string
  detail: string
}

const SKILLS: PolymathSkill[] = [
  {
    icon: <Music className="w-8 h-8" />,
    name: "Music Composition",
    description: "Creating harmonious melodies",
    color: "bg-blue-500",
    detail: "Composes complex musical pieces by understanding rhythm, harmony, and emotional resonance"
  },
  {
    icon: <Code className="w-8 h-8" />,
    name: "Programming",
    description: "Mastering multiple languages",
    color: "bg-emerald-500",
    detail: "Writes efficient code across various programming paradigms and frameworks"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    name: "Art Creation",
    description: "Generating visual masterpieces",
    color: "bg-violet-500",
    detail: "Creates stunning artwork while understanding composition, color theory, and artistic styles"
  },
  {
    icon: <Calculator className="w-8 h-8" />,
    name: "Mathematics",
    description: "Solving complex problems",
    color: "bg-rose-500",
    detail: "Processes advanced mathematical concepts and solves intricate equations"
  },
  {
    icon: <Book className="w-8 h-8" />,
    name: "Literature",
    description: "Crafting compelling narratives",
    color: "bg-amber-500",
    detail: "Understands and creates rich literary works across genres and styles"
  },
  {
    icon: <Microscope className="w-8 h-8" />,
    name: "Science",
    description: "Exploring natural phenomena",
    color: "bg-indigo-500",
    detail: "Analyzes scientific data and understands complex natural systems"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    name: "Languages",
    description: "Breaking language barriers",
    color: "bg-pink-500",
    detail: "Processes and translates multiple human languages with cultural context"
  }
]

export default function PolymathicAI() {
  const [activeSkills, setActiveSkills] = useState<number[]>([])
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkills(prev => {
        const next = prev.length === SKILLS.length ? [] : [...prev, prev.length]
        setIsProcessing(next.length > 0)
        return next
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <Brain className="w-14 h-14 text-blue-400 animate-pulse" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Polymathic AI
          </h1>
        </div>

        <p className="text-xl mb-12 text-gray-300 leading-relaxed">
          Witness the evolution of artificial intelligence as it masters multiple domains simultaneously,
          much like the great polymaths of the Renaissance era.
        </p>

        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className={`w-32 h-32 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center transition-all duration-500 ${isProcessing ? 'scale-110 animate-pulse' : ''}`}>
              <Brain className="w-16 h-16 text-blue-400" />
            </div>
          </div>

          <div className="relative w-[600px] h-[600px] mx-auto">
            {SKILLS.map((skill, index) => {
              const angle = (index * 2 * Math.PI) / SKILLS.length
              const radius = 240
              const x = radius * Math.cos(angle)
              const y = radius * Math.sin(angle)

              return (
                <div
                  key={skill.name}
                  className={`absolute transition-all duration-500 group ${
                    activeSkills.includes(index) ? 'opacity-100 scale-100' : 'opacity-50 scale-90'
                  }`}
                  style={{
                    transform: `translate(${x + 300}px, ${y + 300}px)`
                  }}
                  onMouseEnter={() => setHoveredSkill(index)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className={`w-24 h-24 rounded-xl ${skill.color} p-4 shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 backdrop-blur-sm relative`}>
                    {skill.icon}
                    {hoveredSkill === index && (
                      <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 bg-gray-800 p-4 rounded-lg shadow-xl w-64 z-20">
                        <p className="text-sm text-gray-300">{skill.detail}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap text-center">
                    <p className="font-semibold text-lg">{skill.name}</p>
                    <p className="text-sm text-gray-400">{skill.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-300 text-lg flex items-center justify-center gap-2">
            <Info className="w-5 h-5" />
            Hover over each skill to learn more about the AI's capabilities
          </p>
        </div>
      </div>
    </div>
  )
}