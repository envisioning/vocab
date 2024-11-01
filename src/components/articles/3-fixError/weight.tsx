"use client"
import { useState, useEffect } from "react"
import { Scale, Brain, ArrowRight, Zap, Info, Sparkles, GraduationCap } from "lucide-react"

interface WeightDemoProps {}

type Feature = {
  name: string
  weight: number
  value: number
  description: string
}

const WeightDemo: React.FC<WeightDemoProps> = () => {
  const [features, setFeatures] = useState<Feature[]>([
    { 
      name: "Study Focus", 
      weight: 0.7, 
      value: 8,
      description: "How well you concentrate during study sessions"
    },
    { 
      name: "Practice Tests", 
      weight: 0.6, 
      value: 7,
      description: "Number of practice tests completed"
    },
    { 
      name: "Anxiety Level", 
      weight: -0.4, 
      value: 5,
      description: "Test anxiety impact on performance"
    }
  ])

  const [prediction, setPrediction] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  useEffect(() => {
    const prediction = features.reduce((acc, feature) => {
      return acc + feature.weight * feature.value
    }, 0)
    setPrediction(Number(prediction.toFixed(2)))

    return () => setHoveredFeature(null)
  }, [features])

  const handleWeightChange = (index: number, increment: boolean) => {
    setFeatures(prev => prev.map((feature, i) => {
      if (i === index) {
        const newWeight = increment 
          ? Math.min(1, feature.weight + 0.1)
          : Math.max(-1, feature.weight - 0.1)
        return {...feature, weight: Number(newWeight.toFixed(1))}
      }
      return feature
    }))
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 400)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-3xl w-full space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Test Performance Predictor
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Discover how different factors influence your test results
          </p>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div 
              key={feature.name}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 p-4 rounded-xl transition-all duration-300 hover:shadow-md"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {feature.name}
                  </span>
                  {hoveredFeature === index && (
                    <div className="absolute mt-8 bg-gray-800 text-white p-2 rounded-md text-sm z-10">
                      {feature.description}
                    </div>
                  )}
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleWeightChange(index, false)}
                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    -
                  </button>
                  <span className={`font-mono text-lg ${feature.weight > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {feature.weight > 0 ? '+' : ''}{feature.weight}
                  </span>
                  <button
                    onClick={() => handleWeightChange(index, true)}
                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                    feature.weight > 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${Math.abs(feature.weight * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 bg-blue-50 dark:bg-gray-700 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <ArrowRight className={`w-6 h-6 text-blue-500 transform transition-transform duration-300 ${isAnimating ? 'translate-x-2' : ''}`} />
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Predicted Score: {prediction}
          </div>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          Adjust the importance (weights) of each factor to see how they affect your predicted test score.
          <br/>
          <span className="text-blue-500 dark:text-blue-400">Hover over factors for more details!</span>
        </p>
      </div>
    </div>
  )
}

export default WeightDemo