"use client"
import { useState, useEffect } from "react"
import { Box, Cube, Circle, Square, Triangle, HelpCircle, Info, ArrowRight } from "lucide-react"

interface DimensionProps {}

type DimensionFeature = {
  name: string
  icon: JSX.Element
  description: string
  tooltip: string
  color: string
}

const DIMENSION_FEATURES: DimensionFeature[] = [
  {
    name: "2D Space",
    icon: <Circle size={32} />,
    description: "Position on a flat surface (x, y)",
    tooltip: "Think of this like marking a spot on a map!",
    color: "text-blue-500"
  },
  {
    name: "3D Space",
    icon: <Cube size={32} />,
    description: "Position in real space (x, y, z)",
    tooltip: "Like locating a flying drone in the sky!",
    color: "text-green-500"
  },
  {
    name: "Color Space",
    icon: <Box size={32} />,
    description: "Adding color information",
    tooltip: "Just like describing the color of your favorite shirt!",
    color: "text-purple-500"
  },
  {
    name: "Size Space",
    icon: <Square size={32} />,
    description: "Including size attributes",
    tooltip: "Think of different sizes of pizza - small to extra large!",
    color: "text-orange-500"
  },
  {
    name: "Shape Space",
    icon: <Triangle size={32} />,
    description: "Adding shape variations",
    tooltip: "Like different pasta shapes - each unique and special!",
    color: "text-pink-500"
  }
]

export default function DimensionExplainer({}: DimensionProps) {
  const [currentDim, setCurrentDim] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  useEffect(() => {
    const tooltipTimer = setTimeout(() => setShowTooltip(false), 3000)
    return () => clearTimeout(tooltipTimer)
  }, [showTooltip])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discovering Dimensions
          </h2>
          <HelpCircle 
            className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors duration-300"
            onClick={() => setShowTooltip(true)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {DIMENSION_FEATURES.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer
                  ${currentDim === index ? 'bg-blue-50 shadow-md' : 'bg-gray-50'}
                `}
                onClick={() => setCurrentDim(index)}
              >
                <div className="flex items-center gap-4">
                  <div className={`${feature.color} transition-transform duration-300 
                    ${currentDim === index ? 'scale-110' : ''}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{feature.name}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 flex flex-col items-center justify-center">
            <div className="absolute top-4 right-4">
              {showTooltip && (
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs animate-fade-in">
                  <p className="text-sm text-gray-600">
                    {DIMENSION_FEATURES[currentDim].tooltip}
                  </p>
                </div>
              )}
            </div>
            <div className="h-64 w-64 flex items-center justify-center">
              <div className={`transform transition-all duration-500 ${DIMENSION_FEATURES[currentDim].color}`}>
                {DIMENSION_FEATURES[currentDim].icon}
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 font-medium">
                {`Dimension ${currentDim + 2}: ${DIMENSION_FEATURES[currentDim].name}`}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Click the info icon above for a fun example!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}