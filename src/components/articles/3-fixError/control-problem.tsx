"use client"
import { useState, useEffect } from "react"
import { Bot, Target, Heart, Zap, AlertTriangle, Check, HelpCircle, Brain, Shield, Sparkles } from "lucide-react"

interface AIValue {
  id: number
  name: string
  isAligned: boolean
  icon: JSX.Element
  description: string
}

const AIControlDemo = () => {
  const [aiPosition, setAiPosition] = useState<number>(0)
  const [isLearning, setIsLearning] = useState<boolean>(false)
  const [alignedValues, setAlignedValues] = useState<number>(0)
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  const values: AIValue[] = [
    { 
      id: 1, 
      name: "Ethical Reasoning", 
      isAligned: false, 
      icon: <Brain className="w-6 h-6" />,
      description: "Ensure AI makes morally sound decisions aligned with human values"
    },
    { 
      id: 2, 
      name: "Safety Protocols", 
      isAligned: false, 
      icon: <Shield className="w-6 h-6" />,
      description: "Implement robust safeguards to prevent harmful actions"
    },
    { 
      id: 3, 
      name: "Value Alignment", 
      isAligned: false, 
      icon: <Sparkles className="w-6 h-6" />,
      description: "Maintain consistency between AI goals and human intentions"
    }
  ]

  useEffect(() => {
    if (isLearning) {
      const interval = setInterval(() => {
        setAiPosition(prev => {
          if (prev >= 100) {
            setIsLearning(false)
            return 100
          }
          return prev + 1
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isLearning])

  useEffect(() => {
    if (aiPosition > 75 && alignedValues < values.length) {
      setShowWarning(true)
    }
  }, [aiPosition, alignedValues, values.length])

  const handleValueClick = (id: number) => {
    if (!isLearning) return
    setAlignedValues(prev => prev + 1)
    values.forEach(v => {
      if (v.id === id) v.isAligned = true
    })
    if (alignedValues + 1 === values.length) {
      setShowWarning(false)
      setIsLearning(false)
    }
  }

  const startSimulation = () => {
    setIsLearning(true)
    setAiPosition(0)
    setAlignedValues(0)
    setShowWarning(false)
    values.forEach(v => v.isAligned = false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 flex flex-col items-center justify-center text-white">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            The AI Control Problem
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Guide the AI system by aligning it with human values before it reaches full power.
            Click on each value to establish proper alignment.
          </p>
        </div>

        <div className="relative bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <Bot className="w-8 h-8 text-blue-400" />
            <div className="text-sm font-medium text-gray-300">
              Progress Towards Full Capability
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>

          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${aiPosition}%` }}
            />
          </div>

          <div className="mt-2 text-center text-sm text-gray-400">
            AI Power Level: {aiPosition}%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {values.map(value => (
            <div key={value.id} className="relative">
              <button
                onClick={() => handleValueClick(value.id)}
                onMouseEnter={() => setShowTooltip(value.id)}
                onMouseLeave={() => setShowTooltip(null)}
                disabled={!isLearning || value.isAligned}
                className={`
                  w-full flex flex-col items-center justify-center p-6 rounded-xl
                  transition-all duration-300 transform hover:scale-102
                  ${value.isAligned 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20' 
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'}
                `}
              >
                <div className="relative">
                  {value.icon}
                  {value.isAligned && <Check className="absolute -top-2 -right-2 w-4 h-4 text-white" />}
                </div>
                <span className="mt-3 font-medium">{value.name}</span>
              </button>
              
              {showTooltip === value.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-xs rounded-lg shadow-xl z-10">
                  {value.description}
                </div>
              )}
            </div>
          ))}
        </div>

        {showWarning && (
          <div className="flex items-center justify-center bg-red-500/20 p-4 rounded-xl animate-pulse">
            <AlertTriangle className="w-6 h-6 text-red-400 mr-2" />
            <p className="text-red-200">Critical: AI approaching full power! Align remaining values immediately!</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={startSimulation}
            disabled={isLearning}
            className={`
              px-8 py-4 rounded-xl font-bold text-lg
              transition-all duration-300 transform hover:scale-105
              ${isLearning 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/20'}
            `}
          >
            {isLearning ? 'Training in Progress...' : 'Begin Alignment Training'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIControlDemo