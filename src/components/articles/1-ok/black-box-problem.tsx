"use client"
import { useState, useEffect } from "react"
import {
  Box,
  Brain,
  CircleDot,
  HelpCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Lightbulb
} from "lucide-react"

interface TooltipType {
  show: boolean
  content: string
  x: number
  y: number
}

interface PixelType {
  brightness: number
  key: string
}

const TOOLTIPS = {
  input: "Input data fed into the AI system",
  hidden: "Complex internal processing layers that are hard to interpret",
  output: "The AI's decision or prediction",
  blackbox: "The 'Black Box Problem': We can see what goes in and what comes out, but the internal decision-making process remains opaque",
  observe: "Toggle visualization to see how complex the internal process can be"
}

const GRID_SIZE = 16 // Number of pixels in each row/column

const animations = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
  }

  @keyframes inputFlow {
    0% {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
    50% {
      transform: translateX(10px) scale(0.9);
      opacity: 0.7;
    }
    100% {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }

  @keyframes outputPulse {
    0% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.2);
    }
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
  }
`;

export default function BlackBoxVisualization() {
  const [tooltip, setTooltip] = useState<TooltipType>({
    show: false,
    content: "",
    x: 0,
    y: 0
  })
  const [showInternals, setShowInternals] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  useEffect(() => {
    // Check initial system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(mediaQuery.matches)

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  const [pixels, setPixels] = useState<PixelType[]>([])

  useEffect(() => {
    // Initialize the pixel grid
    const initialPixels = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
      brightness: 0,
      key: `pixel-${i}`
    }))
    setPixels(initialPixels)
  }, [])

  useEffect(() => {
    if (isProcessing) {
      const updatePixels = () => {
        setPixels(prevPixels => 
          prevPixels.map(pixel => ({
            ...pixel,
            brightness: Math.random()
          }))
        )
      }

      const interval = setInterval(updatePixels, 100)
      return () => clearInterval(interval)
    } else {
      // Reset pixels when not processing
      setPixels(prev => prev.map(pixel => ({ ...pixel, brightness: 0 })))
    }
  }, [isProcessing])

  const handleMouseEnter = (content: string, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setTooltip({
      show: true,
      content,
      x: rect.left,
      y: rect.top - 10
    })
  }

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-gray-50"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-900"
  const subTextColor = isDarkMode ? "text-gray-300" : "text-gray-600"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${bgColor} rounded-xl shadow-2xl transition-colors duration-300`}>
      <style>{animations}</style>
      <div className="flex justify-between items-center mb-6">
        <div className="text-center flex-1">
          <h2 className={`text-3xl font-bold ${textColor} mb-2 flex items-center justify-center gap-2`}>
            <Brain className="text-blue-500" />
            The Black Box Problem
          </h2>
          <p className={`${subTextColor} max-w-xl mx-auto`}>
            Understanding AI's decision-making opacity
          </p>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} 
            transition-colors duration-300 group relative`}
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? (
            <Sun className="text-yellow-400 transition-transform duration-300 group-hover:rotate-12" size={24} />
          ) : (
            <Moon className="text-blue-600 transition-transform duration-300 group-hover:-rotate-12" size={24} />
          )}
          <span className="sr-only">
            Switch to {isDarkMode ? 'light' : 'dark'} mode
          </span>
        </button>
      </div>

      <div className={`relative ${cardBg} rounded-lg p-6 mb-6 border ${borderColor}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Box className="text-blue-500" />
            <span className={`${textColor} font-semibold`}>AI System Visualization</span>
          </div>
          <button
            onClick={() => setShowInternals(!showInternals)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white transition-colors duration-300"
          >
            {showInternals ? <EyeOff size={18} /> : <Eye size={18} />}
            {showInternals ? "Hide Internals" : "Show Internals"}
          </button>
        </div>

        <div className={`relative h-64 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} 
          rounded-lg overflow-hidden border ${borderColor}`}>
          {/* Input Section */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2"
            onMouseEnter={(e) => handleMouseEnter(TOOLTIPS.input, e)}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <CircleDot
                  key={`input-${i}`}
                  className={`
                    text-green-500
                    ${isProcessing ? 'animate-[inputFlow_1.5s_ease-in-out_infinite]' : ''}
                  `}
                  style={{
                    animationDelay: `${i * 0.2}s`
                  }}
                  size={24}
                />
              ))}
            </div>
          </div>

          {/* Processing Visualization */}
          <div className="absolute left-1/4 right-1/4 top-1/2 -translate-y-1/2 aspect-square">
            {!showInternals ? (
              <div className={`absolute inset-0 flex items-center justify-center 
                ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${borderColor}`}
                onMouseEnter={(e) => handleMouseEnter(TOOLTIPS.blackbox, e)}
                onMouseLeave={() => setTooltip({ ...tooltip, show: false })}>
                <HelpCircle 
                  className={`
                    ${isDarkMode ? 'text-gray-600' : 'text-gray-400'} 
                    w-12 h-12 
                    ${isProcessing ? 'animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}
                  `}
                  style={{
                    transformOrigin: 'center',
                    animation: isProcessing ? 'pulse 2s ease-in-out infinite' : 'none',
                  }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 grid gap-0.5"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
                }}>
                {pixels.map((pixel, index) => (
                  <div
                    key={pixel.key}
                    className={`${isDarkMode ? 'bg-white' : 'bg-gray-900'} transition-all duration-150`}
                    style={{
                      opacity: isProcessing ? pixel.brightness * 0.7 : 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2"
            onMouseEnter={(e) => handleMouseEnter(TOOLTIPS.output, e)}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}>
            <div className="flex flex-col gap-4">
              {[1, 2].map(i => (
                <CircleDot
                  key={`output-${i}`}
                  className={`
                    text-red-500
                    ${isProcessing ? 'animate-[outputPulse_2s_ease-in-out_infinite]' : ''}
                  `}
                  style={{
                    animationDelay: `${i * 0.5}s`
                  }}
                  size={24}
                />
              ))}
            </div>
          </div>

          {/* Tooltip */}
          {tooltip.show && (
            <div className={`absolute z-10 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} 
              ${textColor} p-3 rounded-lg shadow-xl max-w-xs text-sm border ${borderColor}`}
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
                transform: "translateY(-100%)"
              }}>
              {tooltip.content}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsProcessing(!isProcessing)}
            className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 text-white transition-colors duration-300 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <AlertCircle size={18} />
                Stop Processing
              </>
            ) : (
              <>
                <Lightbulb size={18} />
                Start Processing
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${cardBg} p-4 rounded-lg border ${borderColor}`}>
          <h3 className={`font-semibold mb-2 flex items-center gap-2 ${textColor}`}>
            <Brain size={18} className="text-blue-500" />
            What is the Black Box Problem?
          </h3>
          <p className={`text-sm ${subTextColor}`}>
            AI systems can make complex decisions, but their internal reasoning process
            is often unclear and difficult to interpret, even for their creators.
          </p>
        </div>
        <div className={`${cardBg} p-4 rounded-lg border ${borderColor}`}>
          <h3 className={`font-semibold mb-2 flex items-center gap-2 ${textColor}`}>
            <AlertCircle size={18} className="text-blue-500" />
            Why Does It Matter?
          </h3>
          <p className={`text-sm ${subTextColor}`}>
            Understanding how AI makes decisions is crucial for trust, accountability,
            and ensuring fair and ethical use of AI systems.
          </p>
        </div>
      </div>
    </div>
  )
}