"use client"
import { useState, useEffect } from "react"
import { Brain, Zap, Info, Play, Pause, Sparkles, ArrowRight } from "lucide-react"

interface ComponentProps {}

type Point = {
  x: number
  y: number
}

export default function ReLUVisualizer({}: ComponentProps) {
  const [points, setPoints] = useState<Point[]>([])
  const [highlightedPoint, setHighlightedPoint] = useState<number>(-5)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const initialPoints = Array.from({ length: 40 }, (_, i) => ({
      x: i - 20,
      y: Math.max(0, i - 20)
    }))
    setPoints(initialPoints)

    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setHighlightedPoint(prev => prev >= 15 ? -5 : prev + 0.2)
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const getYPosition = (y: number): number => 150 - (y * 10)
  const getXPosition = (x: number): number => (x + 20) * 15

  return (
    <div className="flex flex-col items-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 rounded-xl shadow-lg max-w-full md:max-w-3xl mx-auto">
      <div className="relative flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
        <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          ReLU Activation Function
        </h2>
        <Zap className="w-8 h-8 text-yellow-500 animate-bounce" />
        <button
          className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <Info className="w-5 h-5 text-blue-500" />
        </button>
        {showTooltip && (
          <div className="absolute top-full mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 max-w-xs">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              ReLU (Rectified Linear Unit) is like a filter that lets positive signals through unchanged
              but blocks negative ones by converting them to zero.
            </p>
          </div>
        )}
      </div>

      <div className="relative w-full md:w-[600px] h-[300px] bg-white dark:bg-gray-800 rounded-lg p-4 overflow-hidden shadow-inner">
        <div className="absolute left-1/2 h-full w-[2px] bg-gray-300 dark:bg-gray-600" />
        <div className="absolute top-1/2 w-full h-[2px] bg-gray-300 dark:bg-gray-600" />

        <svg className="w-full h-full">
          <defs>
            <linearGradient id="reluGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <path
            d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getXPosition(p.x)} ${getYPosition(p.y)}`).join(' ')}
            className="stroke-2 fill-none"
            stroke="url(#reluGradient)"
            strokeWidth="3"
          />
        </svg>

        <div 
          className="absolute w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transform -translate-x-3 -translate-y-3 transition-all duration-300 shadow-lg"
          style={{
            left: getXPosition(highlightedPoint),
            top: getYPosition(Math.max(0, highlightedPoint))
          }}
        >
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {highlightedPoint.toFixed(1)} <ArrowRight className="inline w-4 h-4" /> {Math.max(0, highlightedPoint).toFixed(1)}
          </div>
        </div>

        <div className="absolute top-2 left-4 text-gray-600 dark:text-gray-300 font-medium">Output</div>
        <div className="absolute bottom-2 right-4 text-gray-600 dark:text-gray-300 font-medium">Input</div>
      </div>

      <div className="mt-6 space-y-4 text-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-300 flex items-center gap-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause Animation' : 'Play Animation'}
        </button>
        
        <div className="flex items-center gap-2 justify-center text-gray-700 dark:text-gray-300">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <p className="text-sm md:text-base">
            "Like a bouncer at a club: positives get in, negatives get zero!" 🎉
          </p>
        </div>
      </div>
    </div>
  )
}