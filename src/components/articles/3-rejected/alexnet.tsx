"use client"
import { useState, useEffect } from "react"
import { Image, Eye, Layers, Brain, Award, ChevronRight, Filter, Paintbrush, Camera } from "lucide-react"

interface Feature {
  id: number
  name: string
  description: string
  detected: boolean
}

interface Layer {
  id: number
  name: string
  features: Feature[]
  icon: JSX.Element
}

const layers: Layer[] = [
  {
    id: 1,
    name: "Edge Detection",
    features: [
      { id: 1, name: "Lines", description: "Basic straight lines", detected: false },
      { id: 2, name: "Curves", description: "Simple curved edges", detected: false },
      { id: 3, name: "Borders", description: "Object boundaries", detected: false }
    ],
    icon: <Filter className="w-6 h-6" />
  },
  {
    id: 2, 
    name: "Texture Recognition",
    features: [
      { id: 4, name: "Patterns", description: "Repeating elements", detected: false },
      { id: 5, name: "Textures", description: "Surface qualities", detected: false },
      { id: 6, name: "Gradients", description: "Color transitions", detected: false }
    ],
    icon: <Paintbrush className="w-6 h-6" />
  },
  {
    id: 3,
    name: "Object Detection",
    features: [
      { id: 7, name: "Shapes", description: "Complex forms", detected: false },
      { id: 8, name: "Objects", description: "Complete items", detected: false },
      { id: 9, name: "Scenes", description: "Full compositions", detected: false }
    ],
    icon: <Camera className="w-6 h-6" />
  }
]

const AlexNetExplorer = () => {
  const [currentLayer, setCurrentLayer] = useState(0)
  const [score, setScore] = useState(0)
  const [detectedFeatures, setDetectedFeatures] = useState<Feature[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAnimating) {
      interval = setInterval(() => {
        setCurrentLayer(prev => {
          if (prev >= layers.length - 1) {
            setIsAnimating(false)
            return prev
          }
          return prev + 1
        })
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isAnimating])

  const handleFeatureClick = (feature: Feature) => {
    if (!detectedFeatures.find(f => f.id === feature.id)) {
      setDetectedFeatures([...detectedFeatures, feature])
      setScore(score + 10)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg" role="main">
      <div className="flex items-center gap-4 mb-8">
        <Brain className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">AlexNet Explorer</h1>
        <div className="ml-auto flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          <span className="font-medium">Score: {score}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative h-64 bg-white rounded-lg shadow p-4">
            <Eye className="absolute top-4 right-4 w-6 h-6 text-gray-400" />
            <h2 className="text-lg font-medium mb-4">Image Analysis</h2>
            <div className="flex items-center justify-center h-full">
              <Image className="w-32 h-32 text-gray-300" />
            </div>
          </div>

          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition duration-300"
            aria-label={isAnimating ? "Pause Analysis" : "Start Analysis"}
          >
            {isAnimating ? "Pause" : "Analyze Image"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-medium">Neural Network Layers</h2>
          </div>

          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`p-4 rounded-lg transition-all duration-300 ${
                index === currentLayer ? "bg-blue-100 shadow-md" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {layer.icon}
                <h3 className="font-medium">{layer.name}</h3>
                {index === currentLayer && (
                  <ChevronRight className="w-5 h-5 text-blue-500 ml-auto animate-bounce" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {layer.features.map(feature => (
                  <button
                    key={feature.id}
                    onClick={() => handleFeatureClick(feature)}
                    disabled={index !== currentLayer}
                    className={`p-2 text-sm rounded ${
                      detectedFeatures.find(f => f.id === feature.id)
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    aria-label={`Detect ${feature.name}`}
                  >
                    {feature.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AlexNetExplorer