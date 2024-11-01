"use client"
import { useState, useEffect } from "react"
import { Image, Check, X, Brain, Camera, Info, Eye, Palette, Box } from "lucide-react"

interface ComponentProps {}

type ImageFeature = {
  id: number
  name: string
  description: string
  extracted: boolean
  icon: JSX.Element
  examples: string[]
}

const FeatureExtraction = ({}: ComponentProps) => {
  const [features, setFeatures] = useState<ImageFeature[]>([
    {
      id: 1,
      name: "Edges & Lines",
      description: "Detecting boundaries and contours in images",
      extracted: false,
      icon: <Eye className="w-6 h-6 text-blue-500" />,
      examples: ["Object boundaries", "Texture patterns", "Writing strokes"]
    },
    {
      id: 2,
      name: "Color Patterns",
      description: "Analyzing color distributions and relationships",
      extracted: false,
      icon: <Palette className="w-6 h-6 text-purple-500" />,
      examples: ["Color histograms", "Dominant colors", "Color gradients"]
    },
    {
      id: 3,
      name: "Spatial Features",
      description: "Understanding object arrangements and shapes",
      extracted: false,
      icon: <Box className="w-6 h-6 text-orange-500" />,
      examples: ["Object shapes", "Spatial relationships", "Symmetry"]
    }
  ])

  const [activeFeature, setActiveFeature] = useState<ImageFeature | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  useEffect(() => {
    if (isExtracting) {
      const interval = setInterval(() => {
        setFeatures(prev => {
          const notExtracted = prev.find(f => !f.extracted)
          if (!notExtracted) {
            setIsExtracting(false)
            setShowCompletion(true)
            return prev
          }
          return prev.map(f => 
            f.id === notExtracted.id ? {...f, extracted: true} : f
          )
        })
      }, 1500)

      return () => clearInterval(interval)
    }
  }, [isExtracting])

  const handleStartExtraction = () => {
    setIsExtracting(true)
    setShowCompletion(false)
    setActiveFeature(null)
    setFeatures(prev => prev.map(f => ({...f, extracted: false})))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Feature Extraction
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover how AI transforms raw data into meaningful patterns
          </p>
        </div>

        <div className="relative bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl backdrop-blur-sm p-8 border border-purple-100 dark:border-purple-900">
          <div className="grid grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`transform transition-all duration-500 ${
                  feature.extracted ? 'translate-y-2' : ''
                }`}
                onMouseEnter={() => setActiveFeature(feature)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div
                  className={`relative p-6 rounded-xl border-2 hover:shadow-lg transition-all duration-300 cursor-help
                    ${feature.extracted
                      ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20'
                      : 'border-purple-200 dark:border-purple-800 hover:border-purple-300'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {feature.icon}
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {feature.name}
                      </span>
                    </div>
                    {feature.extracted ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Info className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeFeature && (
            <div className="absolute -bottom-32 left-0 right-0 bg-white/95 dark:bg-gray-800/95 rounded-xl p-4 shadow-lg border border-purple-100 dark:border-purple-900 backdrop-blur-sm">
              <h4 className="font-medium text-purple-600 dark:text-purple-400 mb-2">{activeFeature.description}</h4>
              <div className="flex gap-2 text-sm">
                {activeFeature.examples.map((example, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <button
              onClick={handleStartExtraction}
              disabled={isExtracting}
              className={`
                px-8 py-4 rounded-xl font-medium text-white
                transform transition-all duration-300 shadow-lg
                ${isExtracting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105'
                }
              `}
            >
              {isExtracting ? 'Extracting Features...' : 'Start Feature Extraction'}
            </button>
          </div>
        </div>

        <div className="bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-xl backdrop-blur-sm border border-blue-100 dark:border-blue-900">
          <div className="flex items-start space-x-4">
            <Brain className="w-8 h-8 text-blue-500" />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Just as your brain processes visual information by identifying patterns, edges, and colors,
              AI systems break down complex data into these fundamental features to understand and analyze content more effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureExtraction