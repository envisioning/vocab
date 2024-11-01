"use client"
import { useState, useEffect } from "react"
import { Brain, ArrowDown, Target, Repeat, HelpCircle, Circle } from "lucide-react"

interface LossOptimizationProps {}

type DataPoint = {
  actual: number
  predicted: number
  loss: number
}

const LossOptimizationVisualizer: React.FC<LossOptimizationProps> = () => {
  const [iteration, setIteration] = useState<number>(0)
  const [loss, setLoss] = useState<number>(100)
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { actual: 80, predicted: 30, loss: 50 },
    { actual: 60, predicted: 90, loss: 30 },
    { actual: 70, predicted: 40, loss: 30 },
  ])

  useEffect(() => {
    let animationFrame: number
    let cleanup = false

    const animate = () => {
      if (cleanup) return

      if (isOptimizing && iteration < 100) {
        setIteration((prev) => prev + 1)
        setLoss((prev) => prev * 0.95)
        
        setDataPoints((prev) =>
          prev.map((point) => ({
            ...point,
            predicted: point.predicted + (point.actual - point.predicted) * 0.1,
            loss: Math.abs(point.actual - point.predicted) * 0.9,
          }))
        )

        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cleanup = true
      cancelAnimationFrame(animationFrame)
    }
  }, [isOptimizing, iteration])

  const handleReset = () => {
    setIteration(0)
    setLoss(100)
    setIsOptimizing(false)
    setDataPoints([
      { actual: 80, predicted: 30, loss: 50 },
      { actual: 60, predicted: 90, loss: 30 },
      { actual: 70, predicted: 40, loss: 30 },
    ])
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8 space-y-8">
      <div className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <Brain className="text-blue-500" size={32} />
        Loss Optimization Journey
        <div className="relative">
          <HelpCircle
            className="text-gray-400 hover:text-blue-500 cursor-help transition-colors duration-300"
            size={24}
            onMouseEnter={() => setShowTooltip(0)}
            onMouseLeave={() => setShowTooltip(null)}
          />
          {showTooltip === 0 && (
            <div className="absolute z-10 w-64 p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-sm text-gray-300 -right-2 top-8">
              Watch how the model learns by minimizing the difference between predicted (blue) and actual (green) values
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full max-w-2xl h-64 bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="absolute top-0 left-0 w-full h-full">
          {dataPoints.map((point, index) => (
            <div
              key={index}
              className="absolute flex items-center justify-center group"
              style={{
                left: `${(index + 1) * 25}%`,
                top: `${100 - point.actual}%`,
              }}
            >
              <div className="w-4 h-4 bg-green-500 rounded-full ring-4 ring-green-500/20" />
              <div
                className="absolute w-4 h-4 bg-blue-500 rounded-full transition-all duration-500 ring-4 ring-blue-500/20"
                style={{
                  top: `${point.predicted - point.actual}px`,
                }}
              />
              <div
                className="absolute w-1 bg-gradient-to-b from-red-500/80 to-red-500/20 transition-all duration-500 backdrop-blur-sm"
                style={{
                  height: `${Math.abs(point.predicted - point.actual)}px`,
                  top: Math.min(point.predicted, point.actual),
                }}
              />
              <div className="absolute -right-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 p-2 rounded text-xs text-white">
                Loss: {point.loss.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOptimizing((prev) => !prev)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              isOptimizing
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white flex items-center gap-2 shadow-lg hover:shadow-xl`}
          >
            {isOptimizing ? (
              <>
                <Target size={20} /> Stop
              </>
            ) : (
              <>
                <ArrowDown size={20} /> Optimize
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Repeat size={20} /> Reset
          </button>
        </div>

        <div className="flex gap-8 text-white text-center mt-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <div className="text-2xl font-bold">{iteration}</div>
            <div className="text-gray-400">Iterations</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <div className="text-2xl font-bold text-red-500">
              {loss.toFixed(2)}
            </div>
            <div className="text-gray-400">Total Loss</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
        <Circle className="fill-green-500 text-green-500" size={12} />
        <span>Actual Values</span>
        <Circle className="fill-blue-500 text-blue-500 ml-4" size={12} />
        <span>Predicted Values</span>
        <div className="w-3 h-3 bg-red-500/50 ml-4" />
        <span>Loss</span>
      </div>
    </div>
  )
}

export default LossOptimizationVisualizer