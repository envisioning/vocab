"use client"
import { useState, useEffect } from "react"
import { Building2, Brain, AlertTriangle, CheckCircle2, BookOpen, ArrowRight } from "lucide-react"

interface PalaceState {
  parameters: number
  trainingData: number 
  efficiency: number
  complexity: number
  isOverfit: boolean
}

const MAX_PARAMETERS = 100
const OPTIMAL_RATIO = 0.7

export default function ParameterPalace() {
  const [state, setState] = useState<PalaceState>({
    parameters: 10,
    trainingData: 20,
    efficiency: 0,
    complexity: 0,
    isOverfit: false
  })

  const [showTutorial, setShowTutorial] = useState(true)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const efficiency = calculateEfficiency(state.parameters, state.trainingData)
    const complexity = state.parameters / MAX_PARAMETERS
    const isOverfit = state.parameters > state.trainingData * OPTIMAL_RATIO

    setState(prev => ({
      ...prev,
      efficiency,
      complexity,
      isOverfit
    }))

    return () => {
      // Cleanup
    }
  }, [state.parameters, state.trainingData])

  const calculateEfficiency = (params: number, data: number): number => {
    if (params === 0 || data === 0) return 0
    const ratio = params / data
    return Math.max(0, 100 * (1 - Math.abs(ratio - OPTIMAL_RATIO)))
  }

  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setState(prev => ({
      ...prev,
      parameters: value
    }))
  }

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setState(prev => ({
      ...prev,
      trainingData: value  
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {showTutorial ? (
        <div className="bg-gray-50 p-6 rounded-lg" role="dialog" aria-label="Tutorial">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Welcome to Parameter Palace!</h2>
          </div>
          
          <div className="space-y-4">
            <p>Let's learn about model complexity and overparameterization.</p>
            <button
              onClick={() => setShowTutorial(false)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Start Building <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-8 items-center">
            <Building2 
              className={`w-24 h-24 ${state.isOverfit ? 'text-red-500' : 'text-green-500'}`}
              style={{transform: `scale(${0.5 + state.complexity})`}}
            />
            <Brain className="w-16 h-16 text-blue-500" />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-2">Parameters</label>
              <input
                type="range"
                min="0"
                max={MAX_PARAMETERS}
                value={state.parameters}
                onChange={handleParameterChange}
                className="w-full"
                aria-label="Adjust number of parameters"
              />
              <span className="text-sm">{state.parameters}</span>
            </div>

            <div>
              <label className="block mb-2">Training Data</label>
              <input
                type="range" 
                min="0"
                max="100"
                value={state.trainingData}
                onChange={handleDataChange}
                className="w-full"
                aria-label="Adjust amount of training data"
              />
              <span className="text-sm">{state.trainingData}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              {state.isOverfit ? (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              )}
              <div>
                <h3 className="font-bold">
                  {state.isOverfit ? 'Overparameterized!' : 'Good Balance'}
                </h3>
                <p className="text-sm text-gray-600">
                  Efficiency Score: {state.efficiency.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}