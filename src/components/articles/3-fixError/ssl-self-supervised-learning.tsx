"use client"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Brain, Image, Lock, Info, Sparkles } from "lucide-react"

interface ComponentProps {}

type ImagePatchType = {
  id: number
  visible: boolean
  content: string
}

const PATCH_CONTENTS = [
  "🌟", "🎨", "🔮", "🎯",
  "🎪", "🎭", "🎪", "🎨",
  "🔮", "🎯", "🌟", "🎭",
  "🎪", "🔮", "🎨", "🌟"
]

const SSLComponent: React.FC<ComponentProps> = () => {
  const [patches, setPatches] = useState<ImagePatchType[]>(
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      visible: true,
      content: PATCH_CONTENTS[i]
    }))
  )
  const [isLearning, setIsLearning] = useState<boolean>(false)
  const [prediction, setPrediction] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  const startLearning = () => {
    setIsLearning(true)
    const randomPatch = Math.floor(Math.random() * patches.length)
    setPrediction(null)
    setPatches(prev => 
      prev.map(patch => 
        patch.id === randomPatch 
          ? { ...patch, visible: false }
          : patch
      )
    )
  }

  useEffect(() => {
    if (isLearning) {
      const timer = setTimeout(() => {
        setPrediction(patches.findIndex(p => !p.visible))
        setIsLearning(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isLearning, patches])

  const resetDemo = () => {
    setIsLearning(false)
    setPrediction(null)
    setPatches(prev => prev.map(patch => ({ ...patch, visible: true })))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-3xl w-full space-y-6 md:space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Self-Supervised Learning
            </h1>
            <button
              onMouseEnter={() => setShowTooltip(1)}
              onMouseLeave={() => setShowTooltip(null)}
              className="relative"
            >
              <Info className="w-5 h-5 text-blue-500" />
              {showTooltip === 1 && (
                <div className="absolute z-10 w-64 p-3 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl -top-2 left-6 transform">
                  AI learns by predicting hidden parts of data using visible parts as context
                </div>
              )}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            Watch the AI system learn patterns and predict missing elements in this interactive demonstration
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 md:gap-4 bg-white/90 dark:bg-gray-800/90 p-4 md:p-6 rounded-xl shadow-lg backdrop-blur-sm">
          {patches.map((patch) => (
            <div
              key={patch.id}
              className={`aspect-square rounded-lg transition-all duration-500 transform hover:scale-105
                ${prediction === patch.id ? "ring-4 ring-blue-500 scale-105" : ""}
                ${isLearning ? "animate-pulse" : ""}`}
            >
              <div
                className={`w-full h-full flex items-center justify-center rounded-lg
                  ${patch.visible 
                    ? "bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600" 
                    : "bg-gray-300 dark:bg-gray-700"}`}
              >
                {patch.visible ? (
                  <span className="text-2xl">{patch.content}</span>
                ) : (
                  <EyeOff className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={startLearning}
            disabled={isLearning}
            className={`w-full md:w-auto px-6 py-3 rounded-lg flex items-center justify-center space-x-2 
              ${isLearning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              } text-white transition-all duration-300 shadow-md hover:shadow-lg`}
          >
            <Brain className="w-5 h-5" />
            <span>Start Learning</span>
          </button>

          <button
            onClick={resetDemo}
            className="w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 
              hover:from-gray-600 hover:to-gray-700 text-white flex items-center justify-center space-x-2 
              transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Lock className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {prediction !== null && (
          <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 font-semibold">
              <Sparkles className="w-5 h-5" />
              <span>Pattern successfully predicted! The AI has learned to recognize the context.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SSLComponent