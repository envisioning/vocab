"use client"
import { useState, useEffect } from "react"
import { Globe, Server, Database, Wifi, HardDrive, Cloud, Network, Info } from "lucide-react"

interface ComponentProps {}

type DataPoint = {
  id: number
  x: number
  y: number
  size: number
  type: "social" | "search" | "commerce" | "streaming"
}

const INITIAL_DATA_POINTS: DataPoint[] = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 20 + 15,
  type: ["social", "search", "commerce", "streaming"][Math.floor(Math.random() * 4)] as DataPoint["type"]
}))

const DATA_TYPE_INFO = {
  social: "Social media posts, messages, and interactions",
  search: "Global search queries and results",
  commerce: "E-commerce transactions and product data",
  streaming: "Streaming media and content delivery"
}

export default function InternetScaleVisualizer({}: ComponentProps) {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(INITIAL_DATA_POINTS)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [processedCount, setProcessedCount] = useState<number>(0)
  const [hoveredType, setHoveredType] = useState<keyof typeof DATA_TYPE_INFO | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(points => 
        points.map(p => ({
          ...p,
          x: ((p.x + (Math.random() - 0.5)) + 100) % 100,
          y: ((p.y + (Math.random() - 0.5)) + 100) % 100
        }))
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const handleProcess = () => {
    setIsProcessing(true)
    setProcessedCount(0)
    
    const processInterval = setInterval(() => {
      setProcessedCount(prev => {
        const next = prev + 2
        if (next >= dataPoints.length) {
          setIsProcessing(false)
          clearInterval(processInterval)
        }
        return next
      })
    }, 100)

    return () => clearInterval(processInterval)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-4 md:p-8 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-300 mb-4 md:mb-8 text-center">Internet Scale Processing</h1>
      
      <div className="relative w-full max-w-4xl h-[400px] md:h-[600px] bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden mb-4 md:mb-8">
        <div className="absolute inset-0">
          {dataPoints.map((point, i) => (
            <div
              key={point.id}
              className={`absolute transform transition-all duration-500 hover:scale-150 cursor-pointer
                ${i < processedCount ? 'scale-110 opacity-90' : 'opacity-70'}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: `translate(-50%, -50%)`
              }}
              onMouseEnter={() => setHoveredType(point.type)}
              onMouseLeave={() => setHoveredType(null)}
            >
              {point.type === "social" && <Wifi className="text-pink-400 drop-shadow-lg" size={point.size} />}
              {point.type === "search" && <Globe className="text-green-400 drop-shadow-lg" size={point.size} />}
              {point.type === "commerce" && <Database className="text-yellow-400 drop-shadow-lg" size={point.size} />}
              {point.type === "streaming" && <HardDrive className="text-purple-400 drop-shadow-lg" size={point.size} />}
            </div>
          ))}
        </div>

        {hoveredType && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm border border-gray-700">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-blue-400" />
              {DATA_TYPE_INFO[hoveredType]}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
            style={{ width: `${(processedCount / dataPoints.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className={`
            px-6 py-3 rounded-lg font-semibold text-white
            transition duration-300 flex items-center gap-2 shadow-lg
            ${isProcessing 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
            }
          `}
        >
          <Server className="w-5 h-5" />
          {isProcessing ? 'Processing...' : 'Process Internet Data'}
        </button>

        <div className="flex items-center gap-4 bg-gray-800/30 px-6 py-3 rounded-lg backdrop-blur-sm">
          <Cloud className="w-8 h-8 text-blue-400 animate-pulse" />
          <Network className="w-8 h-8 text-green-400 animate-pulse" />
          <Database className="w-8 h-8 text-yellow-400 animate-pulse" />
        </div>
      </div>

      <p className="mt-6 md:mt-8 text-gray-300 text-center max-w-2xl text-sm md:text-base px-4">
        Explore how AI systems process vast amounts of internet data in real-time.
        Hover over the icons to learn about different types of data being processed
        across the global internet infrastructure.
      </p>
    </div>
  )
}