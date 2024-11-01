"use client"
import { useState, useEffect } from "react"
import { Brain, Code2, Calculator, Binary, Tree, Database, Info } from "lucide-react"

interface ComponentProps {}

interface Symbol {
  id: number
  icon: JSX.Element
  text: string
  description: string
  x: number
  y: number
}

const SYMBOLS: Symbol[] = [
  { 
    id: 1, 
    icon: <Brain size={24} />, 
    text: "IF human_hungry", 
    description: "Condition: Detecting basic human needs",
    x: 0, 
    y: 0 
  },
  { 
    id: 2, 
    icon: <Code2 size={24} />, 
    text: "THEN eat_food", 
    description: "Action: Execute predefined response",
    x: 0, 
    y: 0 
  },
  { 
    id: 3, 
    icon: <Calculator size={24} />, 
    text: "IF energy < 20%", 
    description: "Logical comparison using symbols",
    x: 0, 
    y: 0 
  },
  { 
    id: 4, 
    icon: <Binary size={24} />, 
    text: "THEN rest()", 
    description: "Function call in symbolic system",
    x: 0, 
    y: 0 
  },
  { 
    id: 5, 
    icon: <Tree size={24} />, 
    text: "IF temp < 15°C", 
    description: "Environmental condition check",
    x: 0, 
    y: 0 
  },
  { 
    id: 6, 
    icon: <Database size={24} />, 
    text: "THEN activate_heat", 
    description: "System response based on rules",
    x: 0, 
    y: 0 
  },
]

export default function GOFAI({}: ComponentProps) {
  const [symbols, setSymbols] = useState<Symbol[]>(SYMBOLS)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hoveredSymbol, setHoveredSymbol] = useState<Symbol | null>(null)

  useEffect(() => {
    const calculatePositions = () => {
      const radius = window.innerWidth < 640 ? 100 : 150
      const centerX = window.innerWidth < 640 ? 150 : 200
      const centerY = window.innerWidth < 640 ? 150 : 200

      const positions = symbols.map((symbol, index) => ({
        ...symbol,
        x: Math.cos((index * 2 * Math.PI) / symbols.length) * radius + centerX,
        y: Math.sin((index * 2 * Math.PI) / symbols.length) * radius + centerY,
      }))
      setSymbols(positions)
    }

    calculatePositions()
    window.addEventListener('resize', calculatePositions)

    return () => {
      window.removeEventListener('resize', calculatePositions)
      setSymbols(SYMBOLS)
      setIsProcessing(false)
      setCurrentStep(0)
    }
  }, [])

  useEffect(() => {
    if (isProcessing && currentStep < symbols.length / 2) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isProcessing, currentStep, symbols.length])

  return (
    <div className="relative min-h-[600px] w-full rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-400">
          Good Old-Fashioned AI
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-300">
          Symbolic AI: Processing through rules and logical reasoning
        </p>
      </div>

      <div className="relative h-[300px] sm:h-[400px] w-full overflow-hidden">
        {symbols.map((symbol, index) => (
          <div
            key={symbol.id}
            className={`absolute flex items-center gap-2 rounded-lg bg-gray-700 p-2 sm:p-3 
              shadow-lg transition-all duration-500 hover:bg-gray-600 cursor-help
              ${isProcessing && Math.floor(index / 2) === currentStep
                ? "scale-110 ring-2 ring-blue-500 z-10"
                : ""}`}
            style={{
              transform: `translate(${symbol.x}px, ${symbol.y}px)`,
              opacity: isProcessing && Math.floor(index / 2) < currentStep ? 0.5 : 1,
            }}
            onMouseEnter={() => setHoveredSymbol(symbol)}
            onMouseLeave={() => setHoveredSymbol(null)}
          >
            <span className="text-blue-400">{symbol.icon}</span>
            <span className="hidden sm:inline text-sm font-medium text-gray-100">
              {symbol.text}
            </span>
          </div>
        ))}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Brain
            size={48}
            className={`transition-all duration-500 ${
              isProcessing ? "text-blue-500 animate-pulse" : "text-gray-400"
            }`}
          />
        </div>

        {hoveredSymbol && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 bg-gray-800 p-3 rounded-lg shadow-xl border border-blue-500 z-20">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Info size={16} />
              <span className="font-medium">{hoveredSymbol.text}</span>
            </div>
            <p className="text-sm text-gray-300">{hoveredSymbol.description}</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => {
            setIsProcessing(!isProcessing)
            setCurrentStep(0)
          }}
          className="w-full sm:w-auto rounded-lg bg-blue-500 px-6 py-2 text-white shadow-lg 
            transition-all hover:bg-blue-600 hover:shadow-blue-500/25"
        >
          {isProcessing ? "Reset" : "Process Rules"}
        </button>
        <p className="text-sm text-gray-400 text-center">
          {isProcessing 
            ? `Processing rule pair ${currentStep + 1} of ${symbols.length / 2}` 
            : "Click to start symbolic processing"}
        </p>
      </div>
    </div>
  )
}