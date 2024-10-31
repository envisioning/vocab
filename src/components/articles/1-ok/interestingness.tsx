"use client"
import { useState, useEffect, useCallback } from 'react'
import {
  Sparkles,
  Brain,
  Star,
  AlertCircle,
  ThumbsUp,
  Info
} from 'lucide-react'
import _ from 'lodash'

interface DataPoint {
  id: number
  content: string
  novelty: number
  relevance: number
  isHighlighted: boolean
}

const INITIAL_DATA: DataPoint[] = [
  { id: 1, content: "Cat videos", novelty: 0.2, relevance: 0.8, isHighlighted: false },
  { id: 2, content: "Breaking news", novelty: 0.9, relevance: 0.9, isHighlighted: false },
  { id: 3, content: "Weather report", novelty: 0.1, relevance: 0.7, isHighlighted: false },
  { id: 4, content: "Viral meme", novelty: 0.8, relevance: 0.5, isHighlighted: false },
  { id: 5, content: "Scientific discovery", novelty: 0.9, relevance: 0.7, isHighlighted: false },
  { id: 6, content: "Daily horoscope", novelty: 0.3, relevance: 0.2, isHighlighted: false },
  { id: 7, content: "Traffic update", novelty: 0.2, relevance: 0.9, isHighlighted: false },
  { id: 8, content: "New movie release", novelty: 0.7, relevance: 0.6, isHighlighted: false },
  { id: 9, content: "Tech gadget review", novelty: 0.6, relevance: 0.8, isHighlighted: false },
  { id: 10, content: "Celebrity gossip", novelty: 0.4, relevance: 0.3, isHighlighted: false },
  { id: 11, content: "Sports highlights", novelty: 0.5, relevance: 0.7, isHighlighted: false },
  { id: 12, content: "Recipe tutorial", novelty: 0.3, relevance: 0.8, isHighlighted: false },
  { id: 13, content: "AI breakthrough", novelty: 0.95, relevance: 0.85, isHighlighted: false },
  { id: 14, content: "Space exploration", novelty: 0.85, relevance: 0.75, isHighlighted: false },
  { id: 15, content: "Local event", novelty: 0.4, relevance: 0.6, isHighlighted: false },
  { id: 16, content: "Historical fact", novelty: 0.2, relevance: 0.5, isHighlighted: false },
  { id: 17, content: "Life hack", novelty: 0.5, relevance: 0.8, isHighlighted: false },
  { id: 18, content: "Workout routine", novelty: 0.3, relevance: 0.7, isHighlighted: false },
  { id: 19, content: "Market analysis", novelty: 0.6, relevance: 0.9, isHighlighted: false },
  { id: 20, content: "Fashion trend", novelty: 0.7, relevance: 0.4, isHighlighted: false },
  { id: 21, content: "Medical research", novelty: 0.8, relevance: 0.9, isHighlighted: false },
  { id: 22, content: "Book review", novelty: 0.5, relevance: 0.6, isHighlighted: false },
  { id: 23, content: "Travel blog", novelty: 0.6, relevance: 0.5, isHighlighted: false },
  { id: 24, content: "Gaming news", novelty: 0.7, relevance: 0.7, isHighlighted: false },
  { id: 25, content: "DIY project", novelty: 0.4, relevance: 0.7, isHighlighted: false }
]

export default function InterestingnessVisualizer() {
  const [data, setData] = useState<DataPoint[]>(INITIAL_DATA)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

  // Debounced tooltip hide function
  const debouncedHideTooltip = useCallback(
    _.debounce(() => {
      setIsTooltipVisible(false)
    }, 100),
    []
  )

  // Clear debounced functions on unmount
  useEffect(() => {
    return () => {
      debouncedHideTooltip.cancel()
    }
  }, [debouncedHideTooltip])

  const handlePointHover = useCallback((
    event: React.MouseEvent<HTMLDivElement>,
    point: DataPoint
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const chartRect = event.currentTarget.parentElement?.getBoundingClientRect()

    if (chartRect) {
      setTooltipPosition({
        x: rect.left - chartRect.left + rect.width / 2,
        y: rect.top - chartRect.top - 10
      })
    }

    setHoveredPoint(point)
    setIsTooltipVisible(true)
    debouncedHideTooltip.cancel()
  }, [debouncedHideTooltip])

  const handlePointLeave = useCallback(() => {
    debouncedHideTooltip()
  }, [debouncedHideTooltip])

  const findInteresting = useCallback(() => {
    setIsAnimating(true)
    const threshold = 0.7

    setData(prev => prev.map(point => ({
      ...point,
      isHighlighted: (point.novelty + point.relevance) / 2 > threshold
    })))

    setTimeout(() => setIsAnimating(false), 1500)
  }, [])

  const resetView = useCallback(() => {
    setData(INITIAL_DATA)
    setHoveredPoint(null)
    setIsTooltipVisible(false)
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header section remains the same */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="w-8 h-8 text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            AI Interestingness Detector
          </h2>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-500 hover:text-blue-500 transition-colors duration-300"
        >
          <Info className="w-6 h-6" />
        </button>
      </div>

      {showInfo && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg text-gray-600 text-sm">
          <p>This visualization shows how AI evaluates content based on two key metrics:</p>
          <ul className="list-disc ml-5 mt-2">
            <li><span className="font-semibold">Novelty:</span> How new or unexpected the content is</li>
            <li><span className="font-semibold">Relevance:</span> How useful or applicable the content is</li>
          </ul>
          <p className="mt-2">Hover over any point to see details. Content with high scores in both areas (top-right) is considered more interesting!</p>
        </div>
      )}

      <div className="relative h-96 bg-gray-50 rounded-lg p-4 mb-6">
        {/* Axis labels */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-gray-500">
          Relevance →
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-gray-500">
          Novelty →
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-0">
          {[...Array(11)].map((_, i) => (
            <div key={`v-${i}`} className="absolute left-0 right-0 border-t border-gray-200"
              style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(11)].map((_, i) => (
            <div key={`h-${i}`} className="absolute top-0 bottom-0 border-l border-gray-200"
              style={{ left: `${i * 10}%` }} />
          ))}
        </div>

        {/* Data points */}
        {data.map((point) => (
          <div
            key={point.id}
            className="absolute cursor-pointer"
            style={{
              left: `${point.novelty * 100}%`,
              bottom: `${point.relevance * 100}%`,
              transform: 'translate(-50%, 50%)',
              zIndex: hoveredPoint?.id === point.id ? 20 : 10
            }}
            onMouseEnter={(e) => handlePointHover(e, point)}
            onMouseLeave={handlePointLeave}
          >
            <div
              className={`
                rounded-full transition-transform duration-300 
                ${point.isHighlighted
                  ? 'w-6 h-6 bg-blue-500 shadow-lg shadow-blue-200'
                  : 'w-4 h-4 bg-blue-400 hover:scale-125'}
                ${isAnimating ? 'scale-125' : ''}
              `}
            />
            {point.isHighlighted && (
              <Sparkles
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 text-yellow-400"
              />
            )}
          </div>
        ))}

        {/* Tooltip */}
        {hoveredPoint && isTooltipVisible && (
          <div
            className="absolute z-30 bg-white p-3 rounded-lg shadow-lg text-sm pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              opacity: isTooltipVisible ? 1 : 0,
              transition: 'opacity 150ms ease-in-out'
            }}
          >
            <div className="font-bold text-gray-800 mb-1">
              {hoveredPoint.content}
            </div>
            <div className="text-gray-600">
              Novelty: {hoveredPoint.novelty.toFixed(1)}
            </div>
            <div className="text-gray-600">
              Relevance: {hoveredPoint.relevance.toFixed(1)}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={findInteresting}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                   transition duration-300 flex items-center space-x-2"
          disabled={isAnimating}
        >
          <Star className="w-5 h-5" />
          <span>Find Interesting Items</span>
        </button>
        <button
          onClick={resetView}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                   transition duration-300"
        >
          Reset
        </button>
      </div>
    </div>
  )
}