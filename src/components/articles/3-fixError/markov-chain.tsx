"use client"
import { useState, useEffect } from "react"
import { Sun, Cloud, CloudRain, ArrowRight, HelpCircle, Play, Square } from "lucide-react"

interface WeatherState {
  id: number
  name: string
  icon: JSX.Element
  transitions: {[key: string]: number}
  description: string
}

const WEATHER_STATES: WeatherState[] = [
  {
    id: 1,
    name: "Sunny",
    icon: <Sun className="w-16 h-16 text-yellow-400 animate-pulse" />,
    transitions: {"Cloudy": 0.7, "Rainy": 0.3},
    description: "70% chance of clouds forming, 30% chance of sudden rain"
  },
  {
    id: 2,
    name: "Cloudy", 
    icon: <Cloud className="w-16 h-16 text-gray-400 animate-bounce" />,
    transitions: {"Sunny": 0.4, "Rainy": 0.6},
    description: "40% chance of clearing up, 60% chance of rain"
  },
  {
    id: 3,
    name: "Rainy",
    icon: <CloudRain className="w-16 h-16 text-blue-400 animate-bounce" />,
    transitions: {"Cloudy": 0.8, "Sunny": 0.2},
    description: "80% chance of clouds remaining, 20% chance of sunshine"
  }
]

export default function MarkovChainDemo() {
  const [currentState, setCurrentState] = useState<WeatherState>(WEATHER_STATES[0])
  const [history, setHistory] = useState<WeatherState[]>([WEATHER_STATES[0]])
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoPlay) {
      interval = setInterval(transition, 2000)
    }
    return () => clearInterval(interval)
  }, [autoPlay, currentState])

  const transition = () => {
    setIsAnimating(true)
    const transitions = currentState.transitions
    const random = Math.random()
    let cumulativeProbability = 0
    
    for (const nextStateName in transitions) {
      cumulativeProbability += transitions[nextStateName]
      if (random <= cumulativeProbability) {
        const nextState = WEATHER_STATES.find(s => s.name === nextStateName)!
        setCurrentState(nextState)
        setHistory(prev => [...prev, nextState])
        break
      }
    }
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Weather Markov Chain
          </h1>
          <p className="text-lg text-gray-600">
            Watch how weather patterns evolve based on probabilistic transitions
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl">
          <div className="flex justify-center items-center space-x-12">
            {WEATHER_STATES.map((state) => (
              <div key={state.id} className="relative">
                <div 
                  className={`flex flex-col items-center p-6 rounded-xl transition-all duration-300
                    ${currentState.id === state.id ? 'bg-blue-100 scale-110 ring-2 ring-blue-400' : ''}`}
                >
                  {state.icon}
                  <span className="mt-4 text-xl font-medium">{state.name}</span>
                  <button
                    onMouseEnter={() => setShowTooltip(state.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute top-2 right-2"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                {showTooltip === state.id && (
                  <div className="absolute top-full mt-2 p-3 bg-gray-800 text-white text-sm rounded-lg w-48 z-10">
                    {state.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12 space-x-6">
            <button
              onClick={transition}
              disabled={isAnimating || autoPlay}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl
                hover:from-blue-600 hover:to-blue-700 transition duration-300 disabled:opacity-50
                font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Next State</span>
            </button>
            
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-8 py-3 rounded-xl transition duration-300 font-medium
                shadow-lg hover:shadow-xl flex items-center space-x-2
                ${autoPlay 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                }`}
            >
              {autoPlay ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{autoPlay ? 'Stop' : 'Auto Play'}</span>
            </button>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Weather History</h2>
          <div className="flex items-center flex-wrap gap-6">
            {history.map((state, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  {state.icon}
                </div>
                {index < history.length - 1 && (
                  <ArrowRight className="w-8 h-8 mx-4 text-blue-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}