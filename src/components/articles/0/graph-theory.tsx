'use client'
import { useState, useEffect } from 'react'
import { MapPin, RotateCcw, Play, Pause, TrendingUp, Route, Map, Brain, Network, ArrowRight, ChevronRight } from 'lucide-react'

interface City {
  id: number
  x: number
  y: number
  name: string
  distance?: number
}

interface Route {
  path: number[]
  distance: number
}

interface Concept {
  title: string
  icon: JSX.Element
  description: string
}

const CITIES: City[] = [
  { id: 1, x: 175, y: 50, name: 'Start: New York' },  // Centered start point
  { id: 2, x: 300, y: 100, name: 'London' },
  { id: 3, x: 250, y: 175, name: 'Paris' },
  { id: 4, x: 50, y: 175, name: 'Tokyo' },
  { id: 5, x: 300, y: 250, name: 'Sydney' },
  { id: 6, x: 100, y: 250, name: 'Dubai' },
  { id: 7, x: 175, y: 300, name: 'Singapore' },
  { id: 8, x: 50, y: 100, name: 'Toronto' },
  { id: 9, x: 225, y: 125, name: 'Berlin' },
  { id: 10, x: 100, y: 150, name: 'Madrid' }
]

const CONCEPTS: Concept[] = [
  {
    title: 'Graph Theory Foundation',
    icon: <Network className="w-6 h-6 text-blue-500" />,
    description: 'Cities are nodes (vertices) and possible routes are edges. The distance between any two cities represents the edge weight.'
  },
  {
    title: 'Computational Challenge',
    icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
    description: 'With 10 cities, finding the absolute best route would require checking 362,880 possibilities (9! routes). AI helps us find good solutions faster.'
  },
  {
    title: 'AI Search Strategy',
    icon: <Brain className="w-6 h-6 text-green-500" />,
    description: 'Instead of checking all routes, AI samples promising paths. Here we try 100 random routes as a simple demonstration.'
  }
]

const TSPVisualization = () => {
  const [currentPath, setCurrentPath] = useState<number[]>([])
  const [bestPath, setBestPath] = useState<Route>({ path: [], distance: Infinity })
  const [isAnimating, setIsAnimating] = useState(false)
  const [iterations, setIterations] = useState(0)
  const [currentDistance, setCurrentDistance] = useState(0)
  const [selectedConcept, setSelectedConcept] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedConcept((prev) => (prev + 1) % CONCEPTS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const calculateDistance = (city1: City, city2: City): number => {
    const dx = city1.x - city2.x
    const dy = city1.y - city2.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTotalDistance = (path: number[]): number => {
    let distance = 0
    for (let i = 0; i < path.length - 1; i++) {
      const city1 = CITIES.find(c => c.id === path[i])
      const city2 = CITIES.find(c => c.id === path[i + 1])
      if (city1 && city2) {
        distance += calculateDistance(city1, city2)
      }
    }
    return Math.round(distance)
  }

  const generateRandomPath = (): number[] => {
    // Always start with city 1 (New York)
    const remainingCities = CITIES.slice(1).map(city => city.id)
    for (let i = remainingCities.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingCities[i], remainingCities[j]] = [remainingCities[j], remainingCities[i]]
    }
    // Start and end with city 1
    return [1, ...remainingCities, 1]
  }

  const startAnimation = () => {
    setIsAnimating(true)
    setIterations(0)
    setBestPath({ path: [], distance: Infinity })
  }

  useEffect(() => {
    let animationFrame: number

    const animate = () => {
      if (isAnimating && iterations < 100) {
        const newPath = generateRandomPath()
        const distance = getTotalDistance(newPath)

        setCurrentPath(newPath)
        setCurrentDistance(distance)
        setIterations(prev => prev + 1)

        if (distance < bestPath.distance) {
          setBestPath({ path: newPath, distance })
        }

        animationFrame = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    if (isAnimating) {
      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isAnimating, iterations, bestPath.distance])

  const drawPath = (path: number[], color: string, isCurrentPath: boolean = false) => (
    <>
      {path.map((cityId, index) => {
        if (index < path.length - 1) {
          const city1 = CITIES.find(c => c.id === path[index])
          const city2 = CITIES.find(c => c.id === path[index + 1])
          if (city1 && city2) {
            const dashArray = isCurrentPath ? "4,4" : "none"
            const opacity = isCurrentPath ? 
              (index / (path.length - 1)).toString() : 
              "1"
            
            return (
              <g key={`${city1.id}-${city2.id}`}>
                <line
                  x1={city1.x}
                  y1={city1.y}
                  x2={city2.x}
                  y2={city2.y}
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray={dashArray}
                  strokeOpacity={opacity}
                  className="transition-all duration-500"
                />
                {/* Removed eternally generating blue circle */}
                {isCurrentPath && (
                  <circle
                    cx={city2.x}
                    cy={city2.y}
                    r={3}
                    fill={color}
                    className="animate-pulse"
                  />
                )}
              </g>
            )
          }
        }
        return null
      })}
    </>
  )

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Map className="w-6 h-6" />
          The Traveling Salesman Problem
        </h2>
        
        <div className="mt-4 bg-gray-50 rounded-lg p-4 transition-all duration-500">
          <div className="flex items-start gap-4">
            {CONCEPTS[selectedConcept].icon}
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {CONCEPTS[selectedConcept].title}
              </h3>
              <p className="text-gray-600 text-sm">
                {CONCEPTS[selectedConcept].description}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-3">
            {CONCEPTS.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedConcept(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedConcept ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => isAnimating ? setIsAnimating(false) : startAnimation()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          aria-label={isAnimating ? 'Pause Algorithm' : 'Start Algorithm'}
        >
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isAnimating ? 'Pause' : 'Start'} Algorithm
        </button>
        
        <button
          onClick={() => {
            setIsAnimating(false)
            setCurrentPath([])
            setBestPath({ path: [], distance: Infinity })
            setIterations(0)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
          aria-label="Reset Visualization"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="relative bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>Routes Sampled: </span>
            <span className="font-medium">{iterations}</span>
            <span className="text-xs text-gray-500 ml-1">of 100</span>
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <Route className="w-4 h-4" />
            <span>Best Route Length: </span>
            <span className="font-medium">{bestPath.distance === Infinity ? '-' : Math.round(bestPath.distance)}</span>
            <span className="text-xs text-gray-500 ml-1">pixels</span>
          </div>
        </div>

        <svg width="350" height="350" className="mx-auto" role="img" aria-label="TSP Route Visualization">
          {bestPath.path.length > 0 && drawPath(bestPath.path, '#22C55E')}
          {currentPath.length > 0 && drawPath(currentPath, '#6B7280', true)}

          {CITIES.map(city => (
            <g key={city.id}>
              <circle
                cx={city.x}
                cy={city.y}
                r={city.id === 1 ? 8 : 6}
                fill={city.id === 1 ? '#3B82F6' : '#6B7280'}
                className="transition-all duration-300"
              />
              {city.id === 1 && (
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={12}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
              )}
              <text
                x={city.x}
                y={city.y - 12}
                textAnchor="middle"
                className={`text-xs ${city.id === 1 ? 'font-semibold fill-blue-600' : 'fill-gray-600'}`}
              >
                {city.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">How to Read This Visualization:</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-600">Dotted gray line shows the current path being tested</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Solid green line shows the shortest route found so far</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Blue marker indicates New York, our starting and ending point</span>
          </div>
          <div className="space-y-3 mt-4 text-gray-600">
            <div>
              <p className="font-medium mb-1">Why 100 routes?</p>
              <p className="text-sm">With 10 cities, there are 362,880 possible routes (9! different paths). 
              Checking them all would take too long, so this demo samples 100 random routes to demonstrate how AI can find good solutions without exhaustive search.</p>
            </div>
            <div>
              <p className="font-medium mb-1">How is distance measured?</p>
              <p className="text-sm">Distances are measured in screen pixels between cities on the map. 
              While not representing real-world distances, this helps us compare different routes - shorter pixel lengths mean more efficient paths.</p>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Note: Real TSP solutions use actual geographic distances and more sophisticated AI algorithms that can handle thousands of locations efficiently.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <p className="flex items-start gap-2">
          <ChevronRight className="w-4 h-4 mt-1 text-blue-500" />
          Graph theory helps us model the TSP as a network where cities are nodes and possible routes are edges. 
          AI algorithms then search this graph for the shortest possible route, demonstrating how theoretical concepts 
          power practical solutions.
        </p>
      </div>
    </div>
  )
}

export default TSPVisualization