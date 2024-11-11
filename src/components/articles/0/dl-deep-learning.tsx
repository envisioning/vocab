"use client"
import { useState, useEffect } from "react"
import {
  Brain,
  CircleDot,
  ArrowRight,
  Activity,
  Info,
  ImageIcon,
  Mic,
  Languages,
  LineChart
} from "lucide-react"

interface LayerNode {
  id: number
  active: boolean
  connections: number[]
}

interface Example {
  name: string
  description: string
  icon: React.ReactNode
  input: string
  output: string
}

const examples: Example[] = [
  {
    name: "Image Recognition",
    description: "Converting pixel data into object classifications",
    icon: <ImageIcon className="w-5 h-5 text-blue-400" />,
    input: "🖼️ Pixel data of a furry animal",
    output: "🐱 Cat (98% confidence)"
  },
  {
    name: "Speech Processing",
    description: "Transforming audio waves into text transcripts",
    icon: <Mic className="w-5 h-5 text-blue-400" />,
    input: "🎵 Audio waveform: 'Hello AI'",
    output: "📝 Text: 'Hello AI'"
  },
  {
    name: "Language Translation",
    description: "Converting text between different languages",
    icon: <Languages className="w-5 h-5 text-blue-400" />,
    input: "🇺🇸 'Hello World'",
    output: "🇫🇷 'Bonjour le monde'"
  },
  {
    name: "Pattern Analysis",
    description: "Finding complex patterns in large datasets",
    icon: <LineChart className="w-5 h-5 text-blue-400" />,
    input: "📊 Stock prices over time",
    output: "📈 Trend prediction: Upward"
  }
]

export default function DeepLearningVisualizer() {
  const [darkMode, setDarkMode] = useState(false)
  const [layers, setLayers] = useState<LayerNode[][]>([
    Array.from({ length: 4 }, (_, i) => ({ id: i, active: false, connections: [] })),
    Array.from({ length: 6 }, (_, i) => ({ id: i + 4, active: false, connections: [] })),
    Array.from({ length: 6 }, (_, i) => ({ id: i + 10, active: false, connections: [] })),
    Array.from({ length: 3 }, (_, i) => ({ id: i + 16, active: false, connections: [] }))
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentExample, setCurrentExample] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => setDarkMode(e.matches)

    updateTheme(darkModeQuery)
    darkModeQuery.addEventListener('change', updateTheme)

    return () => darkModeQuery.removeEventListener('change', updateTheme)
  }, [])

  useEffect(() => {
    let isMounted = true

    const runAnimation = async () => {
      if (!isMounted) return

      setIsProcessing(true)
      const newLayers = [...layers]

      // Input layer activation
      newLayers[0] = newLayers[0].map(node => ({ ...node, active: true }))
      setLayers(newLayers)

      // Hidden layers activation
      for (let i = 1; i < layers.length - 1; i++) {
        if (!isMounted) return
        await new Promise(r => setTimeout(r, 500))
        newLayers[i] = newLayers[i].map(node => ({ ...node, active: true }))
        setLayers([...newLayers])
      }

      // Output layer activation
      if (!isMounted) return
      await new Promise(r => setTimeout(r, 500))
      newLayers[3] = newLayers[3].map(node => ({ ...node, active: true }))
      setLayers([...newLayers])

      await new Promise(r => setTimeout(r, 1000))
      if (!isMounted) return
      setIsProcessing(false)
      setLayers(layers.map(layer =>
        layer.map(node => ({ ...node, active: false }))
      ))
      setCurrentExample((prev) => (prev + 1) % examples.length)

      setTimeout(() => {
        if (isMounted) {
          runAnimation()
        }
      }, 1000)
    }

    runAnimation()

    return () => {
      isMounted = false
      setLayers(layers.map(layer =>
        layer.map(node => ({ ...node, active: false }))
      ))
    }
  }, [])

  return (
    <div className={`w-full sm:aspect-[1.618/1] mx-auto p-3 sm:p-6 flex flex-col bg-gradient-to-br 
      ${darkMode ? 'from-gray-900 to-gray-800 text-gray-100' : 'from-slate-100 to-slate-200 text-slate-900'}`}>
      <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500 flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            Deep Learning Visualizer
          </h1>
        </div>
        <button
          className="ml-2 text-blue-500 hover:text-blue-400"
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <Info className="w-5 h-5" />
        </button>
        {showTooltip && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-slate-200'} p-4 rounded-lg text-sm sm:text-base`}>
            Deep Learning uses multiple layers of artificial neurons to automatically learn and extract features from data.
            Each layer transforms the input in increasingly abstract ways.
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-between gap-4 sm:gap-6">
        <div className={`relative w-full h-[60%] flex items-center justify-center 
          ${darkMode ? 'bg-gray-800/50' : 'bg-slate-300/50'} rounded-xl p-4`}>
          {layers.map((layer, layerIdx) => (
            <div
              key={layerIdx}
              className="relative h-full flex flex-col items-center justify-center gap-3 sm:gap-4"
              style={{ width: `${100 / layers.length}%` }}
            >
              <div className="flex flex-col items-center gap-1">
                <div className={`px-1 py-0.5 rounded-md bg-opacity-20 backdrop-blur-sm text-center
                  ${darkMode ? 'bg-gray-500' : 'bg-slate-400'}
                  border ${darkMode ? 'border-gray-600' : 'border-slate-300'}
                  shadow-sm ${layerIdx === 1 || layerIdx === 2 ? 'max-w-[50px] xs:max-w-[70px] sm:max-w-[80px]' : ''}`}>
                  <div className={`w-full text-center text-[6px] xs:text-[7px] sm:text-[8px] md:text-[10px]
                    font-medium ${darkMode ? 'text-gray-200' : 'text-slate-700'} 
                    ${layerIdx === 1 || layerIdx === 2 ? 'whitespace-normal leading-[1.1]' : 'whitespace-nowrap'}`}>
                    {layerIdx === 0 ? "Input Layer" :
                      layerIdx === layers.length - 1 ? "Output Layer" :
                        layerIdx === 1 ? "Feature\nExtraction" :
                          "Pattern\nRecognition"}
                  </div>
                </div>
                {layerIdx === 0 && (
                  <div className={`px-1 py-0.5 rounded-md bg-opacity-10 backdrop-blur-sm
                    ${darkMode ? 'bg-gray-500' : 'bg-slate-400'}
                    border ${darkMode ? 'border-gray-600/50' : 'border-slate-300/50'}`}>
                    <div className={`w-full text-center text-[5px] xs:text-[6px] sm:text-[7px] md:text-[9px] 
                      ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                      Raw Data
                    </div>
                  </div>
                )}
                {layerIdx === 1 && (
                  <div className={`px-1 py-0.5 rounded-md bg-opacity-10 backdrop-blur-sm max-w-[60px] xs:max-w-[70px] sm:max-w-[80px]
                    ${darkMode ? 'bg-gray-500' : 'bg-slate-400'}
                    border ${darkMode ? 'border-gray-600/50' : 'border-slate-300/50'}`}>
                    <div className={`w-full text-center text-[5px] xs:text-[6px] sm:text-[7px] md:text-[9px]
                      ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                      Basic Features
                    </div>
                  </div>
                )}
                {layerIdx === 2 && (
                  <div className={`px-1 py-0.5 rounded-md bg-opacity-10 backdrop-blur-sm max-w-[60px] xs:max-w-[70px] sm:max-w-[80px]
                    ${darkMode ? 'bg-gray-500' : 'bg-slate-400'}
                    border ${darkMode ? 'border-gray-600/50' : 'border-slate-300/50'}`}>
                    <div className={`w-full text-center text-[5px] xs:text-[6px] sm:text-[7px] md:text-[9px]
                      ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                      Complex Patterns
                    </div>
                  </div>
                )}
                {layerIdx === layers.length - 1 && (
                  <div className={`px-1 py-0.5 rounded-md bg-opacity-10 backdrop-blur-sm
                    ${darkMode ? 'bg-gray-500' : 'bg-slate-400'}
                    border ${darkMode ? 'border-gray-600/50' : 'border-slate-300/50'}`}>
                    <div className={`w-full text-center text-[5px] xs:text-[6px] sm:text-[7px] md:text-[9px]
                      ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                      Final Decision
                    </div>
                  </div>
                )}
              </div>
              {layer.map((node) => (
                <div
                  key={node.id}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${node.active
                      ? layerIdx === layers.length - 1
                        ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50 scale-110'
                        : 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-110'
                      : darkMode ? 'bg-gray-700' : 'bg-slate-400'}`}
                >
                  <CircleDot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              ))}
              {layerIdx < layers.length - 1 && (
                <div className="absolute right-0 top-1/2 transform translate-x-1/2">
                  <ArrowRight className={`${darkMode ? 'text-gray-600' : 'text-slate-500'} w-4 h-4 sm:w-5 sm:h-5`} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col items-center">
          <div className={`w-full p-3 sm:p-4 md:p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 flex items-center justify-center">
                {examples[currentExample].icon}
              </div>
              <div className="text-sm sm:text-base md:text-lg font-semibold text-blue-500 leading-tight flex items-center gap-2">
                {examples[currentExample].name}
                {isProcessing && (
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-blue-400" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col gap-1 sm:gap-2 bg-opacity-50 rounded p-2 sm:p-3">
                <span className="text-xs sm:text-sm md:text-base font-semibold text-blue-400">Input:</span>
                <span className="text-xs sm:text-sm md:text-base leading-relaxed">
                  {examples[currentExample].input}
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2 bg-opacity-50 rounded p-2 sm:p-3">
                <span className="text-xs sm:text-sm md:text-base font-semibold text-emerald-500">Output:</span>
                <span className="text-xs sm:text-sm md:text-base leading-relaxed">
                  {examples[currentExample].output}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}