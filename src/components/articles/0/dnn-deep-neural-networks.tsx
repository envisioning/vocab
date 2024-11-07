"use client"
import { useState, useEffect, useRef } from "react"
import { 
  Brain, 
  Circle, 
  Network, 
  Info,
  ChevronDown,
  Layers,
  Sparkles,
  Image,
  MessageSquare,
  Bot,
  Zap,
  Lightbulb
} from "lucide-react"

interface ComponentProps {}

type NeuronType = {
  id: number
  active: boolean
  x: number
  y: number
  layer: number
}

type ExplanationSection = {
  id: number
  title: string
  content: string
  icon: JSX.Element
}

const LAYERS = [4, 6, 6, 3]
const ANIMATION_SPEED = 1500

const SECTIONS: ExplanationSection[] = [
  {
    id: 1,
    title: "Input Processing",
    content: "The blue circles on the left represent input neurons. When you click 'Activate Network', these neurons receive your data (like pixels of an image or words in a sentence) and begin processing.",
    icon: <Layers className="w-5 h-5 text-blue-500" />
  },
  {
    id: 2,
    title: "Hidden Layers",
    content: "The green flashing circles in the middle layers are 'hidden neurons'. They activate when they find important patterns. More lights = stronger pattern detection. Think of them like mini-detectives, each looking for specific clues!",
    icon: <Network className="w-5 h-5 text-blue-500" />
  },
  {
    id: 3,
    title: "Output & Decision",
    content: "The rightmost layer shows output neurons. They combine all the patterns found by previous layers to make final decisions. In real AI, this could be recognizing a cat in a photo or understanding the meaning of a sentence.",
    icon: <Sparkles className="w-5 h-5 text-blue-500" />
  }
]

const APPLICATIONS = [
  {
    id: 1,
    title: "Computer Vision",
    icon: <Image className="w-4 h-4" />
  },
  {
    id: 2,
    title: "Natural Language",
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    id: 3,
    title: "AI Systems",
    icon: <Bot className="w-4 h-4" />
  }
]

const DeepNeuralNetworkDemo = ({}: ComponentProps) => {
  const [neurons, setNeurons] = useState<NeuronType[]>([])
  const [activePathIndex, setActivePathIndex] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateNeuronPositions = () => {
    if (!containerRef.current) return

    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight
    const maxLayerSize = Math.max(...LAYERS)
    const isMobile = containerWidth < 640

    // Calculate horizontal spacing between layers
    const horizontalSpacing = containerWidth / (LAYERS.length + 1)

    let neuronsList: NeuronType[] = []
    let id = 0

    LAYERS.forEach((count, layerIndex) => {
      // Calculate vertical spacing for neurons within each layer
      const verticalPadding = containerHeight * (isMobile ? 0.05 : 0.1) // 5% padding on mobile, 10% on desktop
      const availableHeight = containerHeight - (verticalPadding * 2) - (isMobile ? 140 : 100) // Account for legend
      const spacing = availableHeight / (count + 1)

      for (let i = 0; i < count; i++) {
        neuronsList.push({
          id: id++,
          active: false,
          x: horizontalSpacing + (layerIndex * horizontalSpacing), // x position determines layer (left to right)
          y: verticalPadding + (spacing * (i + 1)), // y position determines position within layer (top to bottom)
          layer: layerIndex
        })
      }
    })

    setNeurons(neuronsList)
  }

  useEffect(() => {
    updateNeuronPositions()
    setIsVisible(true)

    const handleResize = () => {
      updateNeuronPositions()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      setNeurons([])
      setIsAnimating(false)
      setIsVisible(false)
    }
  }, [])

  const animate = () => {
    if (isAnimating) return
    setIsAnimating(true)

    const interval = setInterval(() => {
      setActivePathIndex(prev => {
        if (prev >= LAYERS[0] - 1) {
          setIsAnimating(false)
          clearInterval(interval)
          return 0
        }
        return prev + 1
      })
    }, ANIMATION_SPEED)

    return () => clearInterval(interval)
  }

  const getNeuronColor = (neuron: NeuronType) => {
    if (!isAnimating) return "bg-gray-200 dark:bg-gray-700"
    
    // Input layer (blue) activation
    if (neuron.layer === 0 && neuron.id % LAYERS[0] === activePathIndex) {
      return "bg-blue-500 shadow-blue-500/50"
    }
    
    // Hidden and output layers activation (cascading effect)
    if (neuron.layer > 0) {
      // Calculate time offset based on layer
      const layerDelay = neuron.layer * (ANIMATION_SPEED / 4)
      const timeSinceStart = Date.now() % ANIMATION_SPEED
      
      // Activate neurons in a cascading pattern
      if (timeSinceStart > layerDelay && 
          (neuron.id % 2 === activePathIndex % 2 || neuron.id % 3 === activePathIndex % 3)) {
        return "bg-green-400 shadow-green-400/50"
      }
    }
    
    return "bg-gray-200 dark:bg-gray-700"
  }

  const getNeuronSize = () => {
    if (!containerRef.current) return "w-6 h-6"
    const containerWidth = containerRef.current.clientWidth
    return containerWidth < 400 ? "w-4 h-4" : containerWidth < 640 ? "w-6 h-6" : "w-8 h-8"
  }

  const toggleSection = (sectionId: number) => {
    setActiveSection(activeSection === sectionId ? null : sectionId)
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-2 sm:p-4 md:p-8 rounded-xl">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              Deep Neural Network
            </h1>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-300"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="bg-blue-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg text-xs sm:text-sm md:text-base">
            <p className="text-gray-700 dark:text-gray-300">
              This explainer demonstrates how information flows through multiple layers in a deep neural network.
              Each circle represents a neuron, and the connections show how data is processed and transformed
              as it moves from input to output.
            </p>
          </div>
        )}

        {/* Activation Button */}
        <button
          onClick={animate}
          disabled={isAnimating}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                   flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300
                   text-sm sm:text-base shadow-lg hover:shadow-xl"
        >
          <Network className="w-4 h-4 sm:w-5 sm:h-5" />
          {isAnimating ? "Processing..." : "Activate Network"}
        </button>

        {/* Neural Network Visualization */}
                  <div
          ref={containerRef}
          className="relative h-[450px] sm:h-[450px] md:h-[500px] border-2 border-gray-200 dark:border-gray-700 
                    rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-inner pb-36 sm:pb-32"
        >
          {neurons.map((neuron) => (
            <div
              key={neuron.id}
              className={`absolute ${getNeuronSize()} -ml-2 sm:-ml-3 md:-ml-4 -mt-2 sm:-mt-3 md:-mt-4 rounded-full 
                         transition-all duration-500 shadow-lg transform hover:scale-110
                         ${getNeuronColor(neuron)}`}
              style={{
                left: neuron.x,
                top: neuron.y
              }}
            />
          ))}

          {/* Legend */}
          <div className="absolute inset-x-0 bottom-0 bg-white/80 dark:bg-gray-900/80 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">The three core states that matter for understanding DNNs are:</p>
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-x-6 text-[10px] sm:text-xs md:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 fill-gray-200 dark:fill-gray-700" />
                <span className="text-gray-700 dark:text-gray-300">Inactive neurons waiting for input</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 fill-blue-500" />
                <span className="text-blue-700 dark:text-blue-300">Input neurons receiving data (left side)</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 fill-green-400" />
                <span className="text-green-700 dark:text-green-300">Neurons processing/transforming that data through the layers (middle and right)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Section */}
        <div className={`mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 sm:w-5 sm:h-5 shrink-0 text-yellow-500" />
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Watch how neural networks process information, just like your brain processes what you see and hear!
              </p>
            </div>

            <div className="space-y-2">
              {SECTIONS.map((section) => (
                <div key={section.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 
                        ${activeSection === section.id ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                      ${activeSection === section.id ? 'max-h-32' : 'max-h-0'}`}
                  >
                    <p className="p-3 text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Powering Modern AI Applications
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {APPLICATIONS.map((app) => (
                  <div 
                    key={app.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 
                              text-blue-600 dark:text-blue-300 rounded-full text-xs
                              transform hover:scale-105 transition-transform duration-300"
                  >
                    {app.icon}
                    <span>{app.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeepNeuralNetworkDemo