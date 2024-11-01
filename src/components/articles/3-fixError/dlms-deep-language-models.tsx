"use client"
import { useState, useEffect } from "react"
import { Brain, MessageCircle, Sparkles, Zap, BookOpen, Code, Cpu, Info, ArrowRight, Lightbulb } from "lucide-react"

interface NeuronProps {
  x: number
  y: number
  active: boolean
  layer: number
}

const SAMPLE_PROMPTS = [
  { text: "Translate 'Hello' to French", response: "Bonjour" },
  { text: "Write a haiku about rain", response: "Soft raindrops falling\nNature's gentle lullaby\nWashing earth anew" },
  { text: "Explain quantum physics", response: "Particles behave differently when observed" },
]

const LAYER_DESCRIPTIONS = [
  "Input Layer: Processes raw text",
  "Hidden Layer: Extracts patterns",
  "Output Layer: Generates response"
]

export default function DLMVisualizer() {
  const [activeNeurons, setActiveNeurons] = useState<NeuronProps[]>([])
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [completion, setCompletion] = useState("")
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)

  useEffect(() => {
    const neurons: NeuronProps[] = []
    const layers = 3
    const neuronsPerLayer = 8

    for(let layer = 0; layer < layers; layer++) {
      for(let i = 0; i < neuronsPerLayer; i++) {
        neurons.push({
          x: (layer * 200) + 100,
          y: (i * 40) + 50,
          active: false,
          layer
        })
      }
    }
    setActiveNeurons(neurons)

    return () => {
      setActiveNeurons([])
      setCompletion("")
    }
  }, [])

  const processPrompt = () => {
    if (isProcessing) return
    setIsProcessing(true)
    
    let currentLayer = 0
    const processLayer = () => {
      if (currentLayer >= 3) {
        setCompletion(SAMPLE_PROMPTS[currentPrompt].response)
        setIsProcessing(false)
        setCurrentPrompt((prev) => (prev + 1) % SAMPLE_PROMPTS.length)
        return
      }

      const newNeurons = activeNeurons.map(n => ({
        ...n,
        active: n.layer === currentLayer ? true : n.active
      }))
      setActiveNeurons(newNeurons)
      currentLayer++
      setTimeout(processLayer, 800)
    }

    processLayer()
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Deep Language Model Explorer
          </h1>
        </div>

        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-xl border border-gray-700">
          <div className="relative h-[300px] md:h-[400px] mb-8 overflow-hidden rounded-lg bg-gray-900/80">
            {LAYER_DESCRIPTIONS.map((desc, idx) => (
              <div
                key={idx}
                className="absolute top-2 text-sm text-gray-400 transform"
                style={{ left: `${(idx * 33) + 16}%` }}
                onMouseEnter={() => setActiveTooltip(idx)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <Info className="w-4 h-4 hover:text-blue-400 cursor-pointer" />
                {activeTooltip === idx && (
                  <div className="absolute z-10 w-48 p-2 mt-1 text-xs bg-gray-800 rounded-md shadow-lg">
                    {desc}
                  </div>
                )}
              </div>
            ))}

            {activeNeurons.map((neuron, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 rounded-full transition-all duration-500
                  ${neuron.active ? 'bg-blue-400 shadow-lg shadow-blue-400/50 scale-125' : 'bg-gray-600'}
                `}
                style={{
                  left: `${(neuron.x / 600) * 100}%`,
                  top: neuron.y
                }}
              />
            ))}
            
            <svg className="absolute inset-0 w-full h-full">
              {activeNeurons.map((n1, i) => 
                activeNeurons.filter(n2 => n2.layer === n1.layer + 1).map((n2, j) => (
                  <line
                    key={`${i}-${j}`}
                    x1={`${(n1.x / 600) * 100}%`}
                    y1={n1.y + 8}
                    x2={`${(n2.x / 600) * 100}%`}
                    y2={n2.y + 8}
                    className={`${
                      n1.active && n2.active ? 'stroke-blue-400 stroke-2' : 'stroke-gray-700'
                    } transition-all duration-300`}
                  />
                ))
              )}
            </svg>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-900/80 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              <p className="text-lg">{SAMPLE_PROMPTS[currentPrompt].text}</p>
            </div>

            <button
              onClick={processPrompt}
              disabled={isProcessing}
              className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 
                disabled:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2
                hover:shadow-lg hover:shadow-blue-600/20"
            >
              {isProcessing ? (
                <>
                  <Cpu className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Process Text
                </>
              )}
            </button>

            {completion && (
              <div className="flex items-center gap-4 p-4 bg-gray-900/80 rounded-lg animate-fadeIn">
                <Sparkles className="w-6 h-6 text-green-400" />
                <p className="text-lg whitespace-pre-line">{completion}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="group p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-blue-400 group-hover:animate-bounce" />
              <h3 className="text-xl font-semibold">Understanding DLMs</h3>
            </div>
            <p className="text-gray-300">
              Deep Language Models are neural networks that process and understand human language by analyzing patterns across multiple layers, enabling them to generate meaningful responses.
            </p>
          </div>

          <div className="group p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <ArrowRight className="w-6 h-6 text-blue-400 group-hover:translate-x-2 transition-transform" />
              <h3 className="text-xl font-semibold">Real-World Impact</h3>
            </div>
            <p className="text-gray-300">
              From language translation to content creation, DLMs are revolutionizing how we interact with technology, making complex tasks more accessible and efficient.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}