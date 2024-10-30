'use client'
import { useState, useEffect } from 'react'
import { 
  ScanSearch, 
  Waves, 
  Fingerprint, 
  Eye, 
  Calculator,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

interface GaborStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

const STEPS: GaborStep[] = [
  {
    id: 1,
    title: "Gaussian Wave",
    description: "The Gabor function starts with a Gaussian (bell-shaped) curve that localizes information in space",
    icon: <Waves className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Frequency Analysis",
    description: "It combines with a sinusoidal wave to capture frequency information at specific locations",
    icon: <Calculator className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Feature Detection",
    description: "This combination helps detect edges and textures in images at different orientations",
    icon: <ScanSearch className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Applications",
    description: "Used in biometrics for fingerprint and iris recognition by detecting unique patterns",
    icon: <Eye className="w-6 h-6" />
  }
]

const GaborFunction = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [animationPhase, setAnimationPhase] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 100)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const renderWave = () => {
    const points: string[] = []
    const width = 300
    const height = 150
    const frequency = 0.05
    const gaussian = (x: number) => 
      Math.exp(-Math.pow((x - width/2) / (width/6), 2) / 2)

    for (let x = 0; x < width; x++) {
      const phase = (animationPhase / 100) * Math.PI * 2
      const y = height/2 + 
        (currentStep >= 2 ? 30 * Math.sin(x * frequency + phase) : 0) * 
        (currentStep >= 1 ? gaussian(x) : 1)
      points.push(`${x},${y}`)
    }

    return `M ${points.join(' L ')}`
  }

  const renderFeatureDetection = () => {
    if (currentStep < 3) return null

    const features = []
    const width = 300
    const height = 150
    const frequency = 0.05
    const gaussian = (x: number) => 
      Math.exp(-Math.pow((x - width/2) / (width/6), 2) / 2)

    // Add vertical detection lines
    for (let x = width/4; x <= 3*width/4; x += width/8) {
      const phase = (animationPhase / 100) * Math.PI * 2
      const y = height/2 + 30 * Math.sin(x * frequency + phase) * gaussian(x)
      features.push(
        <line
          key={`line-${x}`}
          x1={x}
          y1={y - 15}
          x2={x}
          y2={y + 15}
          stroke="#22C55E"
          strokeWidth="2"
          strokeDasharray="4"
          className="transition-opacity duration-300"
          opacity={currentStep === 3 ? "0.6" : "0.3"}
        />
      )
    }

    return features
  }

  const renderBiometricPatterns = () => {
    if (currentStep < 4) return null

    const patterns = []
    const width = 300
    const height = 150
    
    // Add circular patterns suggesting iris/fingerprint recognition
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI/8) {
      const radius = 40
      const centerX = width/2
      const centerY = height/2
      const startX = centerX + radius * Math.cos(angle + animationPhase/50)
      const startY = centerY + radius * Math.sin(angle + animationPhase/50)
      const endX = centerX + (radius + 10) * Math.cos(angle + animationPhase/50)
      const endY = centerY + (radius + 10) * Math.sin(angle + animationPhase/50)

      patterns.push(
        <line
          key={`pattern-${angle}`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#3B82F6"
          strokeWidth="1.5"
          opacity="0.4"
        />
      )
    }

    return patterns
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Fingerprint className="w-8 h-8 text-blue-500" />
        <h2 className="text-xl font-semibold">Gabor Function Visualizer</h2>
      </div>

      <div className="mb-8">
        <svg 
          viewBox="0 0 300 150" 
          className="w-full h-48 bg-gray-50 rounded-lg"
        >
          <path
            d={renderWave()}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            className="transition-all duration-300"
          />
          {renderFeatureDetection()}
          {renderBiometricPatterns()}
        </svg>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 
                   disabled:cursor-not-allowed transition-colors duration-300"
          aria-label="Previous step"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center px-4">
          <div className="flex items-center gap-2 justify-center mb-2">
            {STEPS[currentStep - 1].icon}
            <h3 className="font-medium text-lg">
              {STEPS[currentStep - 1].title}
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            {STEPS[currentStep - 1].description}
          </p>
        </div>

        <button
          onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
          disabled={currentStep === 4}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 
                   disabled:cursor-not-allowed transition-colors duration-300"
          aria-label="Next step"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="flex justify-center gap-2">
        {STEPS.map(step => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 
                     ${currentStep === step.id ? 'bg-blue-500' : 'bg-gray-300'}`}
            aria-label={`Go to step ${step.id}`}
          />
        ))}
      </div>
    </div>
  )
}

export default GaborFunction