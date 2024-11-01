"use client"
import { useState, useEffect } from "react"
import { Box, Brain, Eye, HelpCircle, Lock, Zap, ArrowRight, Info, AlertCircle } from "lucide-react"

interface BlackBoxProps {}

type InputData = {
  id: number
  value: string
  color: string
  tooltip: string
}

const BlackBoxAI = ({}: BlackBoxProps) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [currentInput, setCurrentInput] = useState<InputData | null>(null)
  const [outputVisible, setOutputVisible] = useState<boolean>(false)
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)
  const [showInsights, setShowInsights] = useState<boolean>(false)

  const inputs: InputData[] = [
    { id: 1, value: "📷", color: "bg-purple-400", tooltip: "Try feeding an image" },
    { id: 2, value: "📝", color: "bg-emerald-400", tooltip: "Test with text" },
    { id: 3, value: "🎵", color: "bg-indigo-400", tooltip: "Experiment with audio" }
  ]

  const processInput = (input: InputData) => {
    setIsProcessing(true)
    setCurrentInput(input)
    setOutputVisible(false)

    const timer = setTimeout(() => {
      setIsProcessing(false)
      setOutputVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }

  useEffect(() => {
    return () => {
      setIsProcessing(false)
      setOutputVisible(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            The AI Black Box Mystery
          </h1>
          <p className="text-gray-300 text-lg">Explore how AI processes information in ways we can't always understand</p>
        </div>

        <div className="flex justify-center gap-8">
          {inputs.map((input) => (
            <div key={input.id} className="relative group">
              <button
                onClick={() => processInput(input)}
                onMouseEnter={() => setActiveTooltip(input.id)}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`${input.color} p-6 rounded-2xl text-3xl transform hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-${input.color}/20`}
              >
                {input.value}
              </button>
              {activeTooltip === input.id && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                  {input.tooltip}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-8">
          {currentInput && (
            <div className="flex items-center gap-4">
              <div className={`${currentInput.color} p-4 rounded-xl text-2xl shadow-lg`}>
                {currentInput.value}
              </div>
              <ArrowRight className="text-blue-400 animate-pulse" />
            </div>
          )}

          <div className="relative w-72 h-72 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="absolute inset-0 flex items-center justify-center">
              {isProcessing ? (
                <div className="animate-spin">
                  <Brain className="w-20 h-20 text-blue-400" />
                </div>
              ) : (
                <div className="relative">
                  <Lock className="w-20 h-20 text-gray-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-purple-500/0 animate-pulse" />
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              {[Box, Eye, Brain].map((Icon, index) => (
                <Icon key={index} className="w-6 h-6 text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer" />
              ))}
            </div>
          </div>

          {outputVisible && (
            <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm animate-fade-in">
              <Zap className="w-8 h-8 text-yellow-400" />
              <span className="text-xl text-white">
                Processing complete, but how did we get here? 🤔
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
          >
            <Info className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Understand the Black Box
          </button>
        </div>

        {showInsights && (
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl animate-fade-in border border-gray-700">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300 leading-relaxed">
                Imagine having a super-smart friend who's amazing at solving puzzles, but can't explain their thought process.
                That's the AI Black Box - we can see the input and output, but the complex neural networks and decision-making
                happening inside remain mysterious, raising important questions about AI transparency and interpretability.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlackBoxAI