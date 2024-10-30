'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Brain, Cpu, ArrowLeftRight, Network } from 'lucide-react'

interface DataChunk {
  id: string
  color: string
  type: 'param' | 'optimizer'
}

const STEP_INFO = [
  {
    title: 'Complete Model',
    description: 'Large AI model with all parameters in one place'
  },
  {
    title: 'Sharding Phase',
    description: 'Model split across devices to save memory'
  },
  {
    title: 'Local Computation',
    description: 'Each device processes its portion of data'
  },
  {
    title: 'Global Sync',
    description: 'Devices exchange updates to maintain consistency'
  }
]

const FSDPVisualization: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [step, setStep] = useState(0)
  const [modelChunks, setModelChunks] = useState<DataChunk[]>([])

  const colors = {
    params: ['#93C5FD', '#7DD3FC', '#67E8F9', '#A5F3FC'],
    optimizer: ['#86EFAC', '#6EE7B7', '#5EEAD4', '#67E8F9']
  }
  
  useEffect(() => {
    initializeModel()
    return () => setIsAnimating(false)
  }, [])

  const initializeModel = () => {
    const chunks = [
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `param-${i}`,
        color: colors.params[Math.floor(i / 2)],
        type: 'param' as const
      })),
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `opt-${i}`,
        color: colors.optimizer[Math.floor(i / 2)],
        type: 'optimizer' as const
      }))
    ]
    setModelChunks(chunks)
    setStep(0)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isAnimating) {
      interval = setInterval(() => {
        setStep((prev) => (prev + 1) % 4)
      }, 3000)
    }
    
    return () => clearInterval(interval)
  }, [isAnimating])

  const getTransformStyle = (index: number) => {
    const deviceIndex = Math.floor(index / 4)
    const isParam = index < 8
    
    // Calculate position within device container
    const baseX = (deviceIndex % 2) * 280 - 140
    const baseY = Math.floor(deviceIndex / 2) * 180 - 90
    
    // Adjust for parameter vs optimizer positioning within device
    const localIndex = index % 4
    const localX = ((localIndex % 2) * 40) - 20
    const localY = isParam ? -20 : 20

    if (step === 0) {
      // Initial centered position
      const gridX = ((index % 4) * 40) - 60
      const gridY = (Math.floor(index / 4) * 40) - 60
      return { transform: `translate(${gridX}px, ${gridY}px) scale(1)` }
    } else if (step === 1) {
      // Move to respective devices
      return {
        transform: `translate(${baseX + localX}px, ${baseY + localY}px) scale(0.9)`
      }
    } else if (step === 2) {
      // Processing animation - gentle pulse instead of spin
      const scale = 0.9 + Math.sin(Date.now() / 500) * 0.1
      return {
        transform: `translate(${baseX + localX}px, ${baseY + localY}px) scale(${scale})`
      }
    } else {
      // Sync animation - horizontal movement
      const syncX = Math.sin((Date.now() + index * 200) / 800) * 10
      return {
        transform: `translate(${baseX + localX + syncX}px, ${baseY + localY}px) scale(0.9)`
      }
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">
            {STEP_INFO[step].title}
          </h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
            aria-label={isAnimating ? 'Pause Animation' : 'Start Animation'}
          >
            {isAnimating ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={initializeModel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-300"
            aria-label="Reset Animation"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative h-[32rem] mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Model Chunks */}
          <div className="relative">
            {modelChunks.map((chunk, index) => (
              <div
                key={chunk.id}
                className="absolute w-12 h-12 rounded-lg transition-all duration-500 ease-in-out flex items-center justify-center text-white text-xs font-medium"
                style={{
                  ...getTransformStyle(index),
                  backgroundColor: chunk.color,
                  opacity: 0.9,
                  zIndex: step === 0 ? 16 - index : index
                }}
              >
                {chunk.type === 'param' ? 'P' : 'O'}{Math.floor(index % 8) + 1}
              </div>
            ))}
          </div>

          {/* Device Containers */}
          {step > 0 && (
            <>
              {[0, 1, 2, 3].map((deviceId) => (
                <div
                  key={deviceId}
                  className={`absolute w-48 h-48 rounded-xl border-2 
                    ${step === deviceId + 1 ? 'border-blue-500' : 'border-gray-300'}
                    transition-all duration-300`}
                  style={{
                    left: `${deviceId % 2 ? 75 : 25}%`,
                    top: `${Math.floor(deviceId / 2) ? 70 : 30}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
                    <Cpu className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Device {deviceId + 1}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Sync Indicators */}
          {step === 3 && (
            <div className="absolute inset-0 pointer-events-none">
              {[0, 1, 2, 3].map((deviceId) => (
                <ArrowLeftRight
                  key={deviceId}
                  className={`absolute w-6 h-6 text-blue-500 transition-opacity duration-300
                    ${step === 3 ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    left: `${deviceId % 2 ? 65 : 35}%`,
                    top: `${Math.floor(deviceId / 2) ? 70 : 30}%`,
                    animation: 'pulse 1.5s infinite'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center">
        <p className="text-gray-600 mb-4">{STEP_INFO[step].description}</p>
        <div className="flex justify-center gap-4">
          {STEP_INFO.map((info, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                step === i ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FSDPVisualization