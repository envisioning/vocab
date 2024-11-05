"use client"
import { useState, useEffect } from "react"
import { Moon, Sun, Brain, ChevronDown, ChevronUp, HelpCircle } from "lucide-react"

interface ComponentProps {}

type NeuronState = {
  id: number
  active: boolean
  position: { x: number; y: number }
  layer: number
}

const WakeSleepDemo: React.FC<ComponentProps> = () => {
  const [isWakePhase, setIsWakePhase] = useState<boolean>(true)
  const [neurons, setNeurons] = useState<NeuronState[]>([])
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [gridSize, setGridSize] = useState<number>(0)
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false)

  // Previous useEffects remain the same...
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const ROWS = 3
    const COLS = 4
    const NEURON_SIZE = 24
    
    const calculateGrid = () => {
      const isMobile = window.innerWidth <= 768
      const containerWidth = isMobile ? 
        Math.min(window.innerWidth - 48, 280) : 
        Math.min(window.innerWidth * 0.8, 400)  

      const newGridSize = Math.min(
        isMobile ? containerWidth : containerWidth * 0.6,
        240
      )
      
      setGridSize(newGridSize)

      const horizontalSpacing = newGridSize / COLS
      const verticalSpacing = newGridSize / ROWS
      
      const offsetX = (horizontalSpacing - NEURON_SIZE) / 2
      const offsetY = (verticalSpacing - NEURON_SIZE) / 2

      const neurons = []
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          neurons.push({
            id: row * COLS + col,
            active: false,
            layer: row,
            position: {
              x: (col * horizontalSpacing) + offsetX,
              y: (row * verticalSpacing) + offsetY
            }
          })
        }
      }

      return neurons
    }

    const updateLayout = () => {
      setNeurons(calculateGrid())
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => {
      window.removeEventListener('resize', updateLayout)
      setNeurons([])
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWakePhase(prev => !prev)
      setNeurons(prev => prev.map(neuron => ({
        ...neuron,
        active: Math.random() > (isWakePhase ? 0.7 - neuron.layer * 0.2 : 0.3 + neuron.layer * 0.2)
      })))
    }, 1500)

    return () => clearInterval(interval)
  }, [isWakePhase])

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-6 transition-colors duration-300">
        <div className="max-w-sm mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-blue-500" />
              <h1 className="text-lg font-bold">Wake-Sleep Algorithm</h1>
            </div>

            <div className="w-full flex justify-center mb-4">
              <div className="bg-slate-100 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  {isWakePhase ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                      <span className="text-xs font-medium">Wake Phase</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                      <span className="text-xs font-medium">Sleep Phase</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center w-full mb-6">
              <div 
                className="relative bg-slate-50 dark:bg-slate-900/90 rounded-xl shadow-xl overflow-hidden transition-colors duration-300"
                style={{
                  width: `${gridSize}px`,
                  height: `${gridSize}px`
                }}
              >
                {neurons.map((neuron) => (
                  <div
                    key={neuron.id}
                    className={`absolute w-6 h-6 rounded-full transition-all duration-500 flex items-center justify-center
                      ${neuron.active 
                        ? isWakePhase
                          ? 'bg-amber-500 shadow-lg scale-110 ring-2 ring-amber-300/50'
                          : 'bg-blue-500 shadow-lg scale-110 ring-2 ring-blue-300/50'
                        : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    style={{
                      transform: `translate(${neuron.position.x}px, ${neuron.position.y}px)`
                    }}
                  >
                    {isWakePhase ? (
                      <ChevronUp 
                        className={`w-4 h-4 ${
                          neuron.active ? 'text-white animate-bounce' : 'text-slate-500'
                        }`} 
                      />
                    ) : (
                      <ChevronDown 
                        className={`w-4 h-4 ${
                          neuron.active ? 'text-white animate-bounce' : 'text-slate-500'
                        }`} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-2 text-xs w-full max-w-[280px]">
              <p className="text-slate-600 dark:text-slate-300">
                <span className="text-amber-500 font-medium">↑ Wake Phase:</span> Information flows bottom-up (sensory input)
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                <span className="text-blue-500 font-medium">↓ Sleep Phase:</span> Information flows top-down (pattern consolidation)
              </p>
            </div>

            {/* New Info Accordion Section */}
            <div className="w-full max-w-[280px] mt-4">
              <button
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800/90 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700/90 transition-colors duration-300"
                aria-expanded={isInfoOpen}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span>How does Wake-Sleep work?</span>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                    isInfoOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                  isInfoOpen ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-xs space-y-3">
                  <p className="leading-relaxed">
                    Think of Wake-Sleep like how your brain learns from daily experiences! 🧠
                  </p>
                  <div className="space-y-2">
                    <p className="text-amber-500 font-medium">During Wake Phase:</p>
                    <p className="pl-3 text-slate-600 dark:text-slate-300">
                      Just like how you process information when you're awake, the network learns from input data (like seeing images or hearing sounds) and updates its understanding from bottom to top layers. 👀
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-500 font-medium">During Sleep Phase:</p>
                    <p className="pl-3 text-slate-600 dark:text-slate-300">
                      Similar to how your brain consolidates memories while you sleep, the network strengthens important patterns and connections from top to bottom layers. 😴
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WakeSleepDemo