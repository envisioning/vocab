"use client"
import { useState, useEffect } from "react"
import { Brain, Zap, Star, Cpu, RocketLaunch, Sparkles, Lock, Info, RefreshCw } from "lucide-react"

interface FrontierModelProps {}

type ModelFeature = {
  id: number
  name: string
  icon: JSX.Element
  description: string
  unlocked: boolean
}

const FEATURES: ModelFeature[] = [
  {
    id: 1,
    name: "Advanced Reasoning",
    icon: <Brain className="w-8 h-8" />,
    description: "Processes complex logic and abstract concepts like human experts",
    unlocked: false
  },
  {
    id: 2,
    name: "Multi-Modal Processing",
    icon: <Zap className="w-8 h-8" />,
    description: "Understands and generates text, images, audio, and video simultaneously",
    unlocked: false
  },
  {
    id: 3,
    name: "Complex Problem Solving",
    icon: <Cpu className="w-8 h-8" />,
    description: "Tackles intricate real-world challenges with innovative solutions",
    unlocked: false
  },
  {
    id: 4,
    name: "Emergent Abilities",
    icon: <Star className="w-8 h-8" />,
    description: "Develops unexpected capabilities beyond its initial training",
    unlocked: false
  }
]

export default function FrontierModels({}: FrontierModelProps) {
  const [features, setFeatures] = useState<ModelFeature[]>(FEATURES)
  const [progress, setProgress] = useState<number>(0)
  const [isLaunching, setIsLaunching] = useState<boolean>(false)
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)
  const [isRestarting, setIsRestarting] = useState<boolean>(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 1, 100))
      }
    }, 50)

    return () => clearInterval(interval)
  }, [progress])

  useEffect(() => {
    if (progress >= 25 && !features[0].unlocked) unlockFeature(0)
    if (progress >= 50 && !features[1].unlocked) unlockFeature(1)
    if (progress >= 75 && !features[2].unlocked) unlockFeature(2)
    if (progress >= 100 && !features[3].unlocked) {
      unlockFeature(3)
      setIsLaunching(true)
    }
  }, [progress, features])

  const unlockFeature = (index: number) => {
    setFeatures(prev => 
      prev.map((feature, i) => 
        i === index ? {...feature, unlocked: true} : feature
      )
    )
  }

  const handleRestart = () => {
    setIsRestarting(true)
    setTimeout(() => {
      setProgress(0)
      setFeatures(FEATURES)
      setIsLaunching(false)
      setIsRestarting(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <RocketLaunch className="w-8 h-8 text-blue-500 animate-pulse" />
            Frontier Models
            <RocketLaunch className="w-8 h-8 text-blue-500 animate-pulse" />
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the evolution of AI as it unlocks increasingly powerful capabilities,
            pushing the boundaries of artificial intelligence.
          </p>
        </div>

        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
          <div className="absolute -top-4 -right-4">
            <Sparkles className={`w-12 h-12 ${isLaunching ? 'text-yellow-400 animate-spin' : 'text-gray-600'}`} />
          </div>

          <div className="space-y-4">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className={`relative group flex items-center gap-4 p-4 rounded-lg transition-all duration-500 transform
                  ${feature.unlocked 
                    ? 'bg-blue-500/20 translate-x-0 opacity-100 hover:bg-blue-500/30' 
                    : 'bg-gray-800/50 -translate-x-4 opacity-50'
                  }`}
                onMouseEnter={() => setActiveTooltip(feature.id)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div className={`transition-colors duration-300 ${feature.unlocked ? 'text-blue-400' : 'text-gray-500'}`}>
                  {feature.icon}
                </div>
                <span className="text-lg font-semibold">{feature.name}</span>
                <Info className="w-5 h-5 text-gray-400 ml-2" />
                <Lock className={`w-5 h-5 ml-auto transition-opacity duration-300 
                  ${feature.unlocked ? 'opacity-0' : 'opacity-100'} text-gray-500`} 
                />
                
                {activeTooltip === feature.id && (
                  <div className="absolute -top-12 left-0 right-0 bg-gray-900 text-sm p-3 rounded-lg shadow-xl z-10">
                    {feature.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress: {progress}%</span>
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                disabled={isRestarting}
              >
                <RefreshCw className={`w-4 h-4 ${isRestarting ? 'animate-spin' : ''}`} />
                Restart
              </button>
            </div>
            <div className="text-center font-semibold text-blue-400">
              {progress < 100 
                ? "Training in progress..." 
                : "🎉 Frontier Model Activated! Ready for advanced tasks 🚀"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}