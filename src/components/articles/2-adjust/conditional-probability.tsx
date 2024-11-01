"use client"
import { useState, useEffect } from "react"
import { 
  CloudRain, 
  Cloud, 
  Sun, 
  TreeDeciduous, 
  Umbrella,
  Info,
  RefreshCw
} from "lucide-react"

interface ScenarioState {
  stage: number
  showCloud: boolean
  isRaining: boolean
  showTooltip: string
}

export default function ConditionalProbabilityExplorer() {
  const [scenario, setScenario] = useState<ScenarioState>({
    stage: 0,
    showCloud: false,
    isRaining: false,
    showTooltip: ""
  })

  useEffect(() => {
    const tooltips = [
      "Hover over elements to learn more!",
      "P(Rain|Cloud) means probability of rain GIVEN there are clouds",
      "Each scenario helps understand dependent events"
    ]
    
    let currentIndex = 0
    const interval = setInterval(() => {
      setScenario(prev => ({
        ...prev,
        showTooltip: tooltips[currentIndex]
      }))
      currentIndex = (currentIndex + 1) % tooltips.length
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleScenarioClick = () => {
    setScenario(prev => ({
      ...prev,
      showCloud: true,
      isRaining: Math.random() < 0.7,
      stage: prev.stage + 1
    }))
  }

  const resetScenario = () => {
    setScenario({
      stage: 0,
      showCloud: false,
      isRaining: false,
      showTooltip: ""
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="relative mb-8 text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-4xl font-bold text-transparent">
            Conditional Probability Explorer
          </h1>
          <div className="mt-2 animate-fade-in text-sm text-blue-500">
            {scenario.showTooltip}
          </div>
        </div>

        <div className="relative mx-auto h-96 w-96">
          <div className="absolute inset-x-0 bottom-0">
            <TreeDeciduous className="h-16 w-16 text-green-600" />
            <TreeDeciduous className="ml-auto h-16 w-16 text-green-500" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            {!scenario.showCloud ? (
              <button
                onClick={handleScenarioClick}
                className="group relative transform transition-all duration-300 hover:scale-110"
              >
                <Sun className="h-32 w-32 animate-pulse text-yellow-400" />
                <span className="absolute -top-8 hidden rounded-lg bg-blue-600 px-2 py-1 text-sm text-white group-hover:block">
                  Click to start the scenario!
                </span>
              </button>
            ) : (
              <div className="relative">
                <Cloud 
                  className={`h-32 w-32 transform text-gray-400 transition-all duration-500 ${
                    scenario.isRaining ? 'translate-y-[-20px]' : ''
                  }`}
                />
                {scenario.isRaining && (
                  <div className="absolute top-full">
                    {[...Array(3)].map((_, i) => (
                      <CloudRain
                        key={i}
                        className="animate-bounce text-blue-500"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Umbrella 
            className={`h-6 w-6 transition-colors duration-300 ${
              scenario.isRaining ? 'text-blue-500' : 'text-gray-300'
            }`}
          />
          <div className="flex items-center rounded-full bg-blue-50 px-4 py-2">
            <Info className="mr-2 h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-700">
              {scenario.showCloud
                ? scenario.isRaining
                  ? "Given clouds, it's raining! P(Rain|Cloud) = 0.7"
                  : "Clouds don't guarantee rain! P(No Rain|Cloud) = 0.3"
                : "Let's explore weather probability!"}
            </span>
          </div>
          {scenario.showCloud && (
            <button
              onClick={resetScenario}
              className="flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}