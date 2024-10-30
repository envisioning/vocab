"use client"
import { useState, useEffect } from "react"
import { HardDrive, Gauge, Percent, Info, Image as ImageIcon } from "lucide-react"

interface QuantizationState {
  precision: number
  memoryUsage: number
  speed: number
  accuracy: number
  showPrediction: boolean
  userPrediction: number | null
}

const PRECISION_LEVELS = [
  { bits: 32, label: "Full Precision" },
  { bits: 16, label: "Half Precision" },
  { bits: 8, label: "8-bit" },
  { bits: 4, label: "4-bit" }
]

const IMAGE_GRID_SIZE = 12

export default function QuantizationDemo() {
  const [state, setState] = useState<QuantizationState>({
    precision: 32,
    memoryUsage: 100,
    speed: 100,
    accuracy: 100,
    showPrediction: true,
    userPrediction: null
  })

  const generatePixelGrid = (precision: number) => {
    const pixels = []
    const quality = Math.max(2, Math.floor(256 * (precision / 32)))
    
    for (let i = 0; i < IMAGE_GRID_SIZE * IMAGE_GRID_SIZE; i++) {
      const randomValue = Math.floor(Math.random() * quality) * (256 / quality)
      pixels.push(`rgb(${randomValue},${randomValue},${randomValue})`)
    }
    return pixels
  }

  useEffect(() => {
    const calculateMetrics = () => {
      const ratio = state.precision / 32
      setState(prev => ({
        ...prev,
        memoryUsage: Math.round(ratio * 100),
        speed: Math.round((2 - ratio) * 100),
        accuracy: Math.round(90 + (ratio * 10))
      }))
    }

    calculateMetrics()
    
    return () => {
      setState(prev => ({ ...prev, showPrediction: true }))
    }
  }, [state.precision])

  const handlePrecisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      precision: Number(e.target.value)
    }))
  }

  const handlePrediction = (prediction: number) => {
    setState(prev => ({
      ...prev,
      userPrediction: prediction,
      showPrediction: false
    }))
  }

  const pixels = generatePixelGrid(state.precision)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Original Model</h2>
          <div className="grid grid-cols-12 gap-0.5 bg-gray-100 p-2 rounded">
            {pixels.map((color, i) => (
              <div
                key={`pixel-${i}`}
                className="aspect-square"
                style={{ backgroundColor: color }}
                role="img"
                aria-label={`Pixel ${i}`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Quantized Model</h2>
          <div className="grid grid-cols-12 gap-0.5 bg-gray-100 p-2 rounded">
            {pixels.map((color, i) => (
              <div
                key={`pixel-q-${i}`}
                className="aspect-square"
                style={{ backgroundColor: color }}
                role="img"
                aria-label={`Quantized pixel ${i}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="4"
            max="32"
            step="4"
            value={state.precision}
            onChange={handlePrecisionChange}
            className="w-full"
            aria-label="Precision level"
          />
          <span className="font-mono">{state.precision}-bit</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded">
            <HardDrive className="text-blue-500" />
            <span>Memory: {state.memoryUsage}%</span>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 p-4 rounded">
            <Gauge className="text-green-500" />
            <span>Speed: {state.speed}%</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded">
            <Percent className="text-gray-500" />
            <span>Accuracy: {state.accuracy}%</span>
          </div>
        </div>

        {state.showPrediction && (
          <div className="bg-blue-100 p-4 rounded space-y-4">
            <p>Before adjusting the precision, what memory savings do you predict?</p>
            <div className="flex space-x-4">
              {[25, 50, 75].map(value => (
                <button
                  key={value}
                  onClick={() => handlePrediction(value)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}