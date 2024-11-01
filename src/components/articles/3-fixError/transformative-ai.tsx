"use client"
import { useState, useEffect } from "react"
import { Brain, Building2, Factory, Dna, Zap, Rocket, Globe, Cpu, Info, ChevronLeft, ChevronRight } from "lucide-react"

interface TransformativeAIProps {}

type Era = {
  icon: JSX.Element
  title: string
  description: string
  details: string[]
  color: string
}

const ERAS: Era[] = [
  {
    icon: <Factory className="w-12 h-12" />,
    title: "Industrial Revolution",
    description: "Mechanical Power & Mass Production",
    details: ["Steam engines", "Assembly lines", "Mechanical automation"],
    color: "from-amber-400 to-amber-600"
  },
  {
    icon: <Cpu className="w-12 h-12" />,
    title: "Digital Revolution",
    description: "Computing & Internet Age",
    details: ["Personal computers", "World Wide Web", "Digital automation"],
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: <Brain className="w-12 h-12" />,
    title: "AI Revolution",
    description: "Intelligent Systems Era",
    details: ["Machine learning", "Neural networks", "Autonomous systems"],
    color: "from-purple-400 to-purple-600"
  }
]

const IMPACTS = [
  { icon: <Building2 className="w-6 h-6" />, label: "Economy", detail: "Revolutionizing industries and creating new business models" },
  { icon: <Globe className="w-6 h-6" />, label: "Society", detail: "Transforming how we live, work, and interact" },
  { icon: <Dna className="w-6 h-6" />, label: "Healthcare", detail: "Advancing medical research and patient care" },
  { icon: <Rocket className="w-6 h-6" />, label: "Innovation", detail: "Accelerating technological progress" }
]

export default function TransformativeAI({}: TransformativeAIProps) {
  const [currentEra, setCurrentEra] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEra(prev => (prev + 1) % ERAS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 flex items-center gap-3">
          Transformative AI
          <Zap className="w-8 h-8 text-blue-500 animate-pulse" />
        </h1>

        <div className="relative w-full max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setCurrentEra(prev => (prev - 1 + ERAS.length) % ERAS.length)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className={`flex flex-col items-center p-6 rounded-xl bg-gradient-to-br ${ERAS[currentEra].color} text-white transform transition-all duration-500 hover:scale-105`}>
                {ERAS[currentEra].icon}
                <h2 className="text-xl md:text-2xl font-bold mt-4">{ERAS[currentEra].title}</h2>
                <p className="text-sm md:text-base opacity-90 mt-2">{ERAS[currentEra].description}</p>
              </div>

              <button 
                onClick={() => setCurrentEra(prev => (prev + 1) % ERAS.length)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <ul className="space-y-2">
              {ERAS[currentEra].details.map((detail, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {IMPACTS.map((impact, i) => (
            <div
              key={impact.label}
              className="relative group"
              onMouseEnter={() => setShowTooltip(i)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3">
                <div className="text-blue-500 group-hover:text-blue-600 transition-colors duration-300">
                  {impact.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {impact.label}
                </span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              {showTooltip === i && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg z-10">
                  {impact.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}