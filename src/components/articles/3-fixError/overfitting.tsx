"use client"
import { useState, useEffect } from "react"
import { Brain, AlertCircle, Info, Target, ChevronRight, Sparkles } from "lucide-react"

interface DataPoint {
  x: number
  y: number
  isTraining?: boolean
}

const TRAINING_DATA: DataPoint[] = [
  { x: 10, y: 45, isTraining: true },
  { x: 20, y: 52, isTraining: true },
  { x: 30, y: 48, isTraining: true }, 
  { x: 40, y: 55, isTraining: true },
  { x: 50, y: 51, isTraining: true },
  { x: 60, y: 53, isTraining: true },
  { x: 70, y: 49, isTraining: true }
]

const TEST_DATA: DataPoint[] = [
  { x: 25, y: 65 },
  { x: 45, y: 35 },
  { x: 55, y: 45 }
]

export default function OverfittingVisualizer() {
  const [complexity, setComplexity] = useState<number>(1)
  const [showTestData, setShowTestData] = useState<boolean>(false)
  const [curvePoints, setCurvePoints] = useState<{x: number, y: number}[]>([])
  const [showTooltip, setShowTooltip] = useState<string>("")

  useEffect(() => {
    const points = []
    for(let x = 0; x <= 80; x++) {
      let y = 50
      for(let i = 1; i <= complexity; i++) {
        y += Math.sin(x * i/10) * (i * 3)
      }
      points.push({x, y})
    }
    setCurvePoints(points)
    return () => setCurvePoints([])
  }, [complexity])

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500 rounded-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Machine Learning Overfitting</h2>
          <p className="text-gray-300">Watch how increasing model complexity affects learning patterns</p>
        </div>
      </div>

      <div className="relative h-96 mb-8 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div className="absolute inset-0 p-4">
          {TRAINING_DATA.map((point, i) => (
            <div
              key={`train-${i}`}
              className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-2 -translate-y-2 transition-all duration-300 hover:scale-150 hover:ring-2 ring-blue-300"
              style={{left: `${point.x}%`, top: `${point.y}%`}}
              onMouseEnter={() => setShowTooltip("Training Data Point")}
              onMouseLeave={() => setShowTooltip("")}
            />
          ))}

          {showTestData && TEST_DATA.map((point, i) => (
            <div
              key={`test-${i}`}
              className="absolute w-4 h-4 bg-green-500 rounded-full transform -translate-x-2 -translate-y-2 transition-all duration-300 hover:scale-150 hover:ring-2 ring-green-300"
              style={{left: `${point.x}%`, top: `${point.y}%`}}
              onMouseEnter={() => setShowTooltip("Test Data Point")}
              onMouseLeave={() => setShowTooltip("")}
            />
          ))}

          <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d={`M ${curvePoints.map(p => `${p.x} ${p.y}`).join(' L ')}`}
              fill="none"
              stroke={complexity > 3 ? '#EF4444' : '#3B82F6'}
              strokeWidth="3"
              className="transition-all duration-500"
            />
          </svg>

          {showTooltip && (
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              {showTooltip}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-blue-400" />
              <label className="text-white font-medium">Model Complexity</label>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-gray-400 text-sm mt-1">
              <span>Simple</span>
              <span>Complex</span>
            </div>
          </div>

          <button
            onClick={() => setShowTestData(!showTestData)}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-5 h-5" />
            {showTestData ? 'Hide Test Data' : 'Show Test Data'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-medium">Current State</h3>
          </div>
          
          {complexity > 3 ? (
            <div className="flex items-center gap-3 text-red-400 animate-pulse">
              <AlertCircle className="w-6 h-6" />
              <div>
                <p className="font-medium">Overfitting Detected!</p>
                <p className="text-sm opacity-90">The model is learning noise instead of patterns</p>
              </div>
            </div>
          ) : complexity === 3 ? (
            <div className="text-green-400">
              <p className="font-medium">Perfect Balance</p>
              <p className="text-sm opacity-90">Model captures patterns without overfitting</p>
            </div>
          ) : (
            <div className="text-yellow-400">
              <p className="font-medium">Underfitting</p>
              <p className="text-sm opacity-90">Model is too simple to capture meaningful patterns</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}