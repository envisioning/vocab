"use client"
import { useState, useEffect } from "react"
import { Image, Filter, Layers, Zap, Eye, Info, Brain, Camera } from "lucide-react"

interface ConvolutionProps {}

type FeatureType = {
  id: number
  x: number
  y: number
  opacity: number
  highlighted: boolean
}

const INITIAL_FEATURES: FeatureType[] = Array.from({length: 25}, (_, i) => ({
  id: i,
  x: (i % 5) * 60,
  y: Math.floor(i / 5) * 60,
  opacity: 1,
  highlighted: false
}))

const ConvolutionalNN: React.FC<ConvolutionProps> = () => {
  const [features, setFeatures] = useState<FeatureType[]>(INITIAL_FEATURES)
  const [isConvolving, setIsConvolving] = useState(false)
  const [step, setStep] = useState(0)
  const [kernelPos, setKernelPos] = useState({x: 0, y: 0})
  const [showTooltip, setShowTooltip] = useState("")

  useEffect(() => {
    if (!isConvolving) return
    
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= 12) {
          setIsConvolving(false)
          return 0
        }
        return prev + 1
      })
      
      setKernelPos(prev => ({
        x: (step % 3) * 60,
        y: Math.floor(step / 3) * 60
      }))

      setFeatures(prev => 
        prev.map(f => ({
          ...f,
          opacity: Math.random() * 0.5 + 0.5,
          highlighted: Math.random() > 0.7
        }))
      )
    }, 800)

    return () => clearInterval(interval)
  }, [isConvolving, step])

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-3xl text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Brain className="w-12 h-12 text-blue-500" />
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
            Convolutional Neural Networks
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          Discover how AI learns to see like humans! 👀
        </p>
        <div className="flex justify-center gap-8 text-sm">
          <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-700 dark:text-blue-300">
            Image Recognition
          </span>
          <span className="px-4 py-2 bg-green-100 dark:bg-green-900 rounded-full text-green-700 dark:text-green-300">
            Feature Detection
          </span>
          <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-700 dark:text-purple-300">
            Pattern Learning
          </span>
        </div>
      </div>

      <div className="relative w-[300px] h-[300px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl mb-12 transform hover:scale-105 transition-transform duration-300">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
          Neural Processing in Action
        </div>
        {features.map(feature => (
          <div
            key={feature.id}
            className={`absolute w-12 h-12 transition-all duration-500 ${
              feature.highlighted ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
            }`}
            style={{
              transform: `translate(${feature.x}px, ${feature.y}px)`,
              opacity: feature.opacity
            }}
          >
            <div className="w-full h-full bg-blue-500 dark:bg-blue-400 rounded-md" />
          </div>
        ))}

        {isConvolving && (
          <div 
            className="absolute w-36 h-36 border-4 border-green-500 rounded-lg transition-all duration-300"
            style={{
              transform: `translate(${kernelPos.x}px, ${kernelPos.y}px)`
            }}
          >
            <div className="absolute inset-0 bg-green-500 opacity-20" />
            <Filter className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500" />
          </div>
        )}
      </div>

      <button
        onClick={() => setIsConvolving(true)}
        disabled={isConvolving}
        className="group flex items-center gap-3 px-8 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full shadow-lg transition duration-300 mb-12"
      >
        <Camera className="w-6 h-6 group-hover:animate-pulse" />
        <span className="text-lg">Process Image</span>
        <Zap className="w-6 h-6 group-hover:animate-bounce" />
      </button>

      <div className="grid grid-cols-3 gap-8 text-center max-w-3xl">
        {[
          { icon: Image, label: "Input Processing", desc: "Raw image data enters the network" },
          { icon: Filter, label: "Feature Detection", desc: "Filters identify important patterns" },
          { icon: Layers, label: "Pattern Recognition", desc: "Multiple layers build understanding" }
        ].map(({ icon: Icon, label, desc }, i) => (
          <div key={i} className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <Icon className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="font-bold mb-2 text-gray-800 dark:text-white">{label}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConvolutionalNN