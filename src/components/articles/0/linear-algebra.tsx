"use client"
import { useState, useEffect } from "react"
import { Play, Pause, RefreshCw, HelpCircle, Brain, Network, Sparkles, ChevronDown } from "lucide-react"
import React from "react"

interface VectorState {
  x: number
  y: number
  color: string
  label: string
}

interface ComponentProps {}

interface AccordionItem {
  id: number
  title: string
  content: string
  icon: JSX.Element
  color: string
}

const TOOLTIPS = {
  linear: "Linear transformations maintain proportional relationships between vectors"
}

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: 1,
    title: "Neural Networks",
    content: "Neural networks are like digital brains that process information using layers of mathematical transformations. Just as we rotate vectors in this visualization, neural networks transform input data through multiple layers to recognize patterns and make predictions. Each neuron performs vector operations to process and pass information forward!",
    icon: <Network className="w-6 h-6" />,
    color: "text-blue-500"
  },
  {
    id: 2,
    title: "Data Processing",
    content: "In AI, data isn't just numbers - it's vectors in high-dimensional space! When you interact with AI systems like recommendation engines or search tools, they're constantly performing vector transformations to understand and process your data. These mathematical operations help AI systems find similarities and patterns in ways humans can understand.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "text-green-500"
  },
  {
    id: 3,
    title: "Machine Learning",
    content: "The rotating vectors you see here represent the heart of machine learning! When AI systems learn, they're really just adjusting vectors and matrices to better represent patterns in data. This process, called optimization, uses linear algebra to gradually improve the AI's understanding and performance over time.",
    icon: <Brain className="w-6 h-6" />,
    color: "text-purple-500"
  }
];

const LinearAlgebraVisualizer: React.FC<ComponentProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<string>("")
  const [vectors, setVectors] = useState<VectorState[]>([
    { x: 1, y: 0.5, color: "#3B82F6", label: "v₁" },
    { x: 0.5, y: 1, color: "#22C55E", label: "v₂" }
  ]);
  const [frame, setFrame] = useState<number>(0)
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)

  useEffect(() => {
    let animationFrame: number

    const animate = () => {
      if (isPlaying) {
        setFrame((prev) => (prev + 1) % 360)
        animationFrame = requestAnimationFrame(animate)
      }
    }

    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isPlaying])

  const transformVectors = (frame: number) => {
    const angle = (frame * Math.PI) / 180
    return vectors.map((vector) => ({
      ...vector,
      x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
      y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
    }))
  }

  const scale = 45
  const transformedVectors = transformVectors(frame)

  const handleAccordionClick = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl space-y-4 sm:space-y-6 shadow-xl">
      {/* Previous content remains the same until the helper section */}
      <div className="flex items-center space-x-3">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-400">
          Vector Transformation Studio
        </h2>
        <HelpCircle 
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 cursor-help transition-colors duration-300"
          onMouseEnter={() => setShowTooltip("linear")}
          onMouseLeave={() => setShowTooltip("")}
        />
      </div>

      <div className="relative w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/30 dark:from-blue-900/20 dark:to-green-900/20" />
        
        {/* Grid lines */}
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={`grid-${i}`} className="grid-lines">
            <div className="absolute border-gray-100 dark:border-gray-700 h-full" style={{left: `${i * scale}px`, width: '1px'}} />
            <div className="absolute border-gray-100 dark:border-gray-700 w-full" style={{top: `${i * scale}px`, height: '1px'}} />
          </div>
        ))}

        {/* Axes */}
        <div className="absolute top-0 left-1/2 h-full w-[2px] bg-gray-300 dark:bg-gray-600" />
        <div className="absolute left-0 top-1/2 w-full h-[2px] bg-gray-300 dark:bg-gray-600" />

        {/* Vectors with Labels */}
        {transformedVectors.map((vector, index) => (
          <div key={index} className="absolute" style={{
            left: `calc(50% + ${vector.x * scale}px)`,
            top: `calc(50% - ${vector.y * scale}px)`
          }}>
            <div className="absolute h-[3px] origin-left transform shadow-sm"
              style={{
                width: `${window.innerWidth < 600 ? Math.min(Math.sqrt(Math.pow(vector.x * scale, 2) + Math.pow(vector.y * scale, 2)), 80) : Math.sqrt(Math.pow(vector.x * scale, 2) + Math.pow(vector.y * scale, 2))}px`,
                background: vector.color,
                transform: `rotate(${Math.atan2(-vector.y, vector.x)}rad)`
              }}
            />
            <span className="absolute -translate-y-6 text-xs sm:text-sm font-semibold" style={{color: vector.color}}>
              {vector.label}
            </span>
          </div>
        ))}

        {showTooltip && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 sm:p-3 rounded-lg shadow-lg text-xs sm:text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {TOOLTIPS[showTooltip as keyof typeof TOOLTIPS]}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4 sm:space-x-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition duration-300 shadow-md"
        >
          {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="ml-2 text-sm sm:text-base font-medium">{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base font-medium">{frame}°</span>
        </div>
      </div>

      <div className="flex space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 mr-2" />
          <span>First Vector</span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-2" />
          <span>Second Vector</span>
        </div>
      </div>

      {/* AI Connection Helper Section with Accordions */}
      <div className="mt-4 sm:mt-6 w-full max-w-2xl px-2 sm:px-4">
        
        <div className="mt-4 space-y-2 sm:space-y-3">
          {ACCORDION_ITEMS.map((item) => (
            <div 
              key={item.id}
              className="rounded-lg overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => handleAccordionClick(item.id)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300"
              >
                <div className="flex items-center">
                  <span className={`mr-2 sm:mr-3 ${item.color} transition-transform duration-300 ${
                    openAccordion === item.id ? 'transform scale-110' : ''
                  }`}>
                    {React.cloneElement(item.icon, {
                      className: 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'
                    })}
                  </span>
                  <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                    {item.title}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-300 ${
                    openAccordion === item.id ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openAccordion === item.id ? 'max-h-64 sm:max-h-40' : 'max-h-0'
                }`}
              >
                <p className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed sm:leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LinearAlgebraVisualizer