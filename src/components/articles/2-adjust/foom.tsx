'use client'
import { useState, useEffect } from 'react'
import { Flower2, Calendar, Timer, RefreshCw, Bot, Brain } from 'lucide-react'

interface PondState {
  month: number
  lilyPads: number
  percentCovered: number
}

const LilyPondFOOM: React.FC = () => {
  const [currentState, setCurrentState] = useState<PondState>({
    month: 0,
    lilyPads: 1,
    percentCovered: (1 / Math.pow(2, 36)) * 100
  })
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [showAIComparison, setShowAIComparison] = useState<boolean>(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isSimulating && currentState.month < 36) {
      interval = setInterval(() => {
        setCurrentState(prev => ({
          month: prev.month + 1,
          lilyPads: prev.lilyPads * 2,
          percentCovered: Math.min((prev.lilyPads * 2 / Math.pow(2, 36)) * 100, 100)
        }))
      }, 500)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isSimulating, currentState.month])

  const handleReset = () => {
    setCurrentState({
      month: 0,
      lilyPads: 1,
      percentCovered: (1 / Math.pow(2, 36)) * 100
    })
    setIsSimulating(false)
  }

  const renderPond = () => {
    const lilies = []
    const totalSpots = 1000
    const spotsToFill = Math.floor(currentState.percentCovered * 10)

    for (let i = 0; i < totalSpots; i++) {
      lilies.push(
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300
            ${i < spotsToFill ? 'bg-green-500' : 'bg-blue-200'}`}
          role="presentation"
        />
      )
    }

    return lilies
  }

  const getAIAnalogy = () => {
    if (currentState.month <= 12) {
      return { icon: <Bot className="w-6 h-6" />, text: "AI starting with basic tasks" }
    } else if (currentState.month <= 24) {
      return { icon: <Brain className="w-6 h-6" />, text: "AI developing self-improvement capabilities" }
    } else {
      return { icon: <Brain className="w-6 h-6 text-red-500" />, text: "AI reaching superintelligent capabilities" }
    }
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">The Lily Pad Effect</h2>
          <p className="text-gray-600 mt-2">
            Visualizing exponential growth and AI capability jumps
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg
              hover:bg-blue-600 transition duration-300"
            aria-label={isSimulating ? "Pause simulation" : "Start simulation"}
          >
            <Timer className="w-5 h-5" />
            {isSimulating ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg
              hover:bg-gray-600 transition duration-300"
            aria-label="Reset simulation"
          >
            <RefreshCw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-blue-50 rounded-xl p-4 relative overflow-hidden">
          <div 
            className="grid grid-cols-40 gap-[1px]" 
            style={{ gridTemplateColumns: 'repeat(40, minmax(0, 1fr))' }}
            role="img" 
            aria-label="Pond visualization"
          >
            {renderPond()}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-4 mb-3">
              <Calendar className="w-6 h-6 text-blue-500" />
              <div className="flex items-center">
                <div className="text-xl font-bold text-gray-800">{currentState.month}</div>
                <div className="text-sm text-gray-600 ml-2">Months</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-200"
                style={{ width: `${(currentState.month / 36) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="w-full max-w-md">
            <div className="flex items-center gap-4 mb-3">
              <Flower2 className="w-6 h-6 text-green-500" />
              <div className="flex items-center">
                <div className="text-xl font-bold text-gray-800">{currentState.lilyPads.toLocaleString()}</div>
                <div className="text-sm text-gray-600 ml-2">Lily Pads</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-200"
                style={{ width: `${currentState.percentCovered}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {currentState.percentCovered.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Pond Covered</div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-700 text-sm leading-relaxed">
            Just as one lily pad grows to cover an entire pond through doubling, an AI system might rapidly expand its capabilities. 
            When half the pond is covered, it may seem manageable - but just one more doubling will fill it completely. 
            Similarly, once AI reaches a certain threshold, its final leap to superintelligence could happen before we realize it.
          </p>
          {currentState.month >= 35 && (
            <p className="text-red-500 text-sm mt-2 font-medium">
              Notice how quickly the final doubling occurred - this is why AI safety researchers emphasize the importance of preparation.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default LilyPondFOOM