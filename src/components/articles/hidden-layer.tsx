"use client"
import { useState, useEffect } from "react"
import { Brain, Circle, ArrowRight, Zap, Info, Sparkles, Binary } from "lucide-react"

interface ComponentProps {}

type Neuron = {
  id: number
  x: number
  y: number
  active: boolean
  value: number
}

const HiddenLayerDemo = ({}: ComponentProps) => {
  const [inputNeurons, setInputNeurons] = useState<Neuron[]>([
    { id: 1, x: 50, y: 100, active: false, value: 0.3 },
    { id: 2, x: 50, y: 200, active: false, value: 0.7 },
    { id: 3, x: 50, y: 300, active: false, value: 0.5 }
  ])

  const [hiddenNeurons, setHiddenNeurons] = useState<Neuron[]>([
    { id: 4, x: 250, y: 150, active: false, value: 0 },
    { id: 5, x: 250, y: 250, active: false, value: 0 }
  ])

  const [outputNeurons, setOutputNeurons] = useState<Neuron[]>([
    { id: 7, x: 450, y: 200, active: false, value: 0 }
  ])

  const [isProcessing, setIsProcessing] = useState(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  useEffect(() => {
    const cleanup = () => setShowTooltip(null)
    return cleanup
  }, [])

  const processSignal = () => {
    if (isProcessing) return
    setIsProcessing(true)

    const timer1 = setTimeout(() => {
      setInputNeurons(prev => prev.map(n => ({ ...n, active: true })))
    }, 300)

    const timer2 = setTimeout(() => {
      setHiddenNeurons(prev => prev.map(n => ({ 
        ...n, 
        active: true,
        value: Math.random().toFixed(2)
      })))
    }, 1200)

    const timer3 = setTimeout(() => {
      setOutputNeurons(prev => prev.map(n => ({ 
        ...n, 
        active: true,
        value: Math.random().toFixed(2)
      })))
    }, 2100)

    const timer4 = setTimeout(() => {
      setInputNeurons(prev => prev.map(n => ({ ...n, active: false })))
      setHiddenNeurons(prev => prev.map(n => ({ ...n, active: false })))
      setOutputNeurons(prev => prev.map(n => ({ ...n, active: false })))
      setIsProcessing(false)
    }, 3000)

    return () => {
      [timer1, timer2, timer3, timer4].forEach(clearTimeout)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
            Neural Network Explorer
          </h2>
        </div>
        <Binary className="w-6 h-6 text-blue-400" />
      </div>

      <div className="relative h-[450px] bg-white dark:bg-gray-800 rounded-2xl shadow-inner p-4 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {inputNeurons.map(input =>
            hiddenNeurons.map(hidden => (
              <line
                key={`${input.id}-${hidden.id}`}
                x1={input.x}
                y1={input.y}
                x2={hidden.x}
                y2={hidden.y}
                className={`stroke-2 ${
                  input.active && hidden.active
                    ? "stroke-blue-500"
                    : "stroke-gray-200 dark:stroke-gray-700"
                } transition-all duration-500`}
              />
            ))
          )}
          {hiddenNeurons.map(hidden =>
            outputNeurons.map(output => (
              <line
                key={`${hidden.id}-${output.id}`}
                x1={hidden.x}
                y1={hidden.y}
                x2={output.x}
                y2={output.y}
                className={`stroke-2 ${
                  hidden.active && output.active
                    ? "stroke-blue-500"
                    : "stroke-gray-200 dark:stroke-gray-700"
                } transition-all duration-500`}
              />
            ))
          )}
        </svg>

        {[
          { title: "Input Layer", neurons: inputNeurons, icon: Circle, left: "left-12" },
          { title: "Hidden Layer", neurons: hiddenNeurons, icon: Sparkles, left: "left-1/2 -translate-x-1/2" },
          { title: "Output Layer", neurons: outputNeurons, icon: ArrowRight, left: "right-12" }
        ].map(({ title, neurons, icon: Icon, left }) => (
          <div key={title} className={`absolute ${left}`}>
            <div className="text-sm font-medium mb-4 text-gray-600 dark:text-gray-300 flex items-center gap-2">
              {title}
              <Info
                className="w-4 h-4 cursor-help text-blue-400"
                onMouseEnter={() => setShowTooltip(neurons[0].id)}
                onMouseLeave={() => setShowTooltip(null)}
              />
            </div>
            {neurons.map(neuron => (
              <div
                key={neuron.id}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  neuron.active
                    ? "bg-blue-500 shadow-lg shadow-blue-500/50"
                    : "bg-white dark:bg-gray-700 shadow-md"
                }`}
                style={{
                  position: "absolute",
                  left: neuron.x - 24,
                  top: neuron.y - 24,
                  transform: `scale(${neuron.active ? 1.1 : 1})`
                }}
              >
                <Icon className={`w-6 h-6 ${neuron.active ? "text-white" : "text-gray-500"}`} />
                {showTooltip === neuron.id && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                    Value: {neuron.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={processSignal}
        disabled={isProcessing}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 flex items-center gap-3 font-medium shadow-lg shadow-blue-500/20"
      >
        <Zap className="w-5 h-5" />
        Process Signal
      </button>

      <p className="mt-6 text-gray-600 dark:text-gray-300 text-center leading-relaxed">
        Watch as data transforms through the hidden layer - like a master chef turning raw ingredients into a gourmet dish! 
        Each neuron processes and combines information in unique ways. 🧠✨
      </p>
    </div>
  )
}

export default HiddenLayerDemo