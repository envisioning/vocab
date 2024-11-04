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
            ${i < spotsToFill ? 'bg-green-500 dark:bg-green-400' : 'bg-blue-200 dark:bg-blue-800'}`}
          role="presentation"
        />
      )
    }

    return lilies
  }

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl mx-auto transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
            The Lily Pad Effect
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-2">
            Visualizing exponential growth and AI capability jumps
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="flex items-center justify-center gap-2 w-28 px-4 py-2 bg-blue-500 
              text-white rounded-lg hover:bg-blue-600 transition duration-300"
            aria-label={isSimulating ? "Pause simulation" : "Start simulation"}
          >
            <Timer className="w-5 h-5" />
            <span className="text-sm md:text-base">{isSimulating ? "Pause" : "Start"}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 w-28 px-4 py-2 
              bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
            aria-label="Reset simulation"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm md:text-base">Reset</span>
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-4 relative overflow-hidden">
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
              <Calendar className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
              <div className="flex items-center">
                <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">
                  {currentState.month}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 ml-2">
                  Months
                </div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-200"
                style={{ width: `${(currentState.month / 36) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="w-full max-w-md">
            <div className="flex items-center gap-4 mb-3">
              <Flower2 className="w-5 md:w-6 h-5 md:h-6 text-green-500" />
              <div className="flex items-center">
                <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">
                  {currentState.lilyPads.toLocaleString()}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 ml-2">
                  Lily Pads
                </div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-200"
                style={{ width: `${currentState.percentCovered}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              {currentState.percentCovered.toFixed(2)}%
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
              Pond Covered
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Just as one lily pad grows to cover an entire pond through doubling, an AI system might rapidly expand its capabilities. 
            When half the pond is covered, it may seem manageable - but just one more doubling will fill it completely. 
            Similarly, once AI reaches a certain threshold, its final leap to superintelligence could happen before we realize it.
          </p>
          {currentState.month >= 35 && (
            <p className="text-xs md:text-sm text-red-500 dark:text-red-400 mt-2 font-medium">
              Notice how quickly the final doubling occurred - this is why AI safety researchers emphasize the importance of preparation.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default LilyPondFOOM