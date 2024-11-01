"use client"
import { useState, useEffect } from "react"
import { Brain, Eye, Tag, Lightbulb, ArrowRight, Info, MessageSquare } from "lucide-react"

interface ComponentProps {}

type UnderstandingPhase = 'perception' | 'analysis' | 'comprehension'

interface ScenarioType {
  input: string
  features: string[]
  context: string
  insight: string
}

const SCENARIOS: ScenarioType[] = [
  {
    input: "A child sharing their lunch with a classmate",
    features: ["social interaction", "empathy", "sharing", "school environment"],
    context: "Educational Setting",
    insight: "Demonstrates prosocial behavior and emotional intelligence"
  },
  {
    input: "A robot carefully arranging books on a shelf",
    features: ["automation", "precision", "organization", "task execution"],
    context: "Human-Robot Interaction",
    insight: "Shows mechanical understanding of spatial relationships"
  },
  {
    input: "Musicians improvising together in a jazz band",
    features: ["collaboration", "creativity", "rhythm", "real-time adaptation"],
    context: "Artistic Performance",
    insight: "Exhibits dynamic pattern recognition and response"
  }
]

export default function EnhancedMachineUnderstanding({}: ComponentProps) {
  const [currentScenario, setCurrentScenario] = useState<number>(0)
  const [phase, setPhase] = useState<UnderstandingPhase>('perception')
  const [showTooltip, setShowTooltip] = useState<string>("")

  useEffect(() => {
    if (phase === 'perception') {
      const timer = setTimeout(() => setPhase('analysis'), 2000)
      return () => clearTimeout(timer)
    }
    if (phase === 'analysis') {
      const timer = setTimeout(() => setPhase('comprehension'), 2000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const handleNextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length)
    setPhase('perception')
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
            Machine Understanding
          </h2>
          <button
            onMouseEnter={() => setShowTooltip("info")}
            onMouseLeave={() => setShowTooltip("")}
            className="relative p-2 text-gray-600 hover:text-blue-500 transition-colors duration-300"
          >
            <Info className="w-6 h-6" />
            {showTooltip === "info" && (
              <div className="absolute right-0 w-64 p-3 mt-2 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                Watch how AI processes and understands information in three phases: perception, analysis, and comprehension
              </div>
            )}
          </button>
        </div>

        <div className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-all duration-500">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Eye className={`w-6 h-6 ${phase === 'perception' ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
              <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-lg font-medium">{SCENARIOS[currentScenario].input}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Tag className={`w-6 h-6 ${phase === 'analysis' ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
              <div className="flex-1 flex flex-wrap gap-2">
                {SCENARIOS[currentScenario].features.map((feature, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 
                      ${phase === 'perception' ? 'opacity-0' : 'opacity-100'}
                      ${phase === 'comprehension' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Lightbulb className={`w-6 h-6 ${phase === 'comprehension' ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
              <div className={`flex-1 p-4 rounded-lg transition-all duration-500 ${phase === 'comprehension' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <p className="text-sm">{SCENARIOS[currentScenario].insight}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Scene {currentScenario + 1} of {SCENARIOS.length}
          </div>
          <button
            onClick={handleNextScenario}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            <span>Next Scene</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}