"use client"
import { useState, useEffect } from 'react'
import { 
  Brain, 
  Eye, 
  Focus, 
  Lock,
  LockOpen,
  ScanLine,
  ArrowLeftRight,
  Clock,
  MousePointer,
  Shield,
  ShieldAlert,
  MessageCircle
} from 'lucide-react'

interface AttentionProps {}

type AttentionType = 'self' | 'causal' | 'sparse'
type WordState = 'active' | 'masked' | 'attending' | 'default'

const SENTENCES = {
  self: "Let all words share thoughts freely",
  causal: "Read words step by step carefully",
  sparse: "Connect key points strategically"
}

const AttentionMaskingVisualizer: React.FC<AttentionProps> = () => {
  const [activeType, setActiveType] = useState<AttentionType>('self')
  const [selectedWord, setSelectedWord] = useState<number | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [wordStates, setWordStates] = useState<WordState[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const words = SENTENCES[activeType].split(' ')
  
  const resetDemo = () => {
    setSelectedWord(null)
    setCurrentStep(0)
    setIsPlaying(false)
    setWordStates(words.map(() => 'default'))
  }

  useEffect(() => {
    resetDemo()
  }, [activeType])

  const getWordClassName = (index: number, state: WordState) => {
    const baseClass = "px-4 py-2 rounded-xl transition-all duration-300 relative "
    const stateClasses = {
      default: "bg-white text-gray-800 hover:bg-blue-50",
      active: "bg-blue-500 text-white scale-110 shadow-lg",
      masked: "bg-gray-200 text-gray-400 opacity-50",
      attending: "bg-green-500 text-white scale-105 shadow-md"
    }
    return baseClass + stateClasses[state]
  }

  const handleDemoStep = () => {
    if (currentStep >= words.length) {
      resetDemo()
      return
    }

    const newStates = [...words.map(() => 'default' as WordState)]
    
    switch (activeType) {
      case 'self':
        // Show how all words can attend to each other
        newStates[currentStep] = 'active'
        words.forEach((_, idx) => {
          if (idx !== currentStep) {
            newStates[idx] = 'attending'
          }
        })
        break
        
      case 'causal':
        // Show how words can only attend to previous words
        newStates[currentStep] = 'active'
        for (let i = 0; i <= currentStep; i++) {
          if (i !== currentStep) {
            newStates[i] = 'attending'
          }
        }
        for (let i = currentStep + 1; i < words.length; i++) {
          newStates[i] = 'masked'
        }
        break
        
      case 'sparse':
        // Show selective attention to specific words
        newStates[currentStep] = 'active'
        const keyIndices = [
          currentStep,
          (currentStep + 2) % words.length,
          currentStep > 0 ? currentStep - 1 : words.length - 1
        ]
        words.forEach((_, idx) => {
          if (keyIndices.includes(idx) && idx !== currentStep) {
            newStates[idx] = 'attending'
          } else if (idx !== currentStep) {
            newStates[idx] = 'masked'
          }
        })
        break
    }
    
    setWordStates(newStates)
    setCurrentStep(prev => prev + 1)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(handleDemoStep, 1500)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, activeType])

  const getTypeDescription = () => {
    switch (activeType) {
      case 'self':
        return {
          title: "Self Attention",
          desc: "Every word can see and connect with all other words simultaneously, like a group discussion where everyone can freely exchange information.",
          icon: <ArrowLeftRight className="w-full h-full text-blue-500" />
        }
      case 'causal':
        return {
          title: "Causal Attention",
          desc: "Words can only see and connect with previous words (left-to-right), like reading a book where you can't peek at future words.",
          icon: <Shield className="w-full h-full text-blue-500" />
        }
      case 'sparse':
        return {
          title: "Sparse Attention",
          desc: "Words connect only to specific strategic positions, like having a focused conversation where you reference key points.",
          icon: <Focus className="w-full h-full text-blue-500" />
        }
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-blue-500" />
          Understanding Attention Types
        </h2>
      </div>

      {/* Type Selection */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {(['self', 'causal', 'sparse'] as AttentionType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-5 py-3 rounded-xl flex items-center gap-2 transition-all duration-300
              ${activeType === type 
                ? 'bg-blue-500 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 hover:bg-blue-100'}
            `}
          >
            {type === 'self' && <ArrowLeftRight className="w-5 h-5" />}
            {type === 'causal' && <Shield className="w-5 h-5" />}
            {type === 'sparse' && <Focus className="w-5 h-5" />}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Current Type Info */}
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl mb-8">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 min-w-[24px] min-h-[24px] flex-shrink-0">
            {getTypeDescription().icon}
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-800">
              {getTypeDescription().title}
            </h3>
            <p className="text-sm text-gray-600">
              {getTypeDescription().desc}
            </p>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="relative min-h-[200px] bg-white/40 backdrop-blur-sm rounded-xl p-8 mb-6">
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {words.map((word, idx) => (
            <div key={idx} className="relative">
              <div className={getWordClassName(idx, wordStates[idx])}>
                {word}
                {wordStates[idx] === 'masked' && (
                  <Lock className="w-4 h-4 absolute -top-2 -right-2 text-gray-400" />
                )}
                {wordStates[idx] === 'attending' && (
                  <LockOpen className="w-4 h-4 absolute -top-2 -right-2 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2
              ${isPlaying ? 'bg-red-500' : 'bg-green-500'} text-white`}
          >
            {isPlaying ? 'Stop' : 'Start'} Demo
          </button>
          <button
            onClick={resetDemo}
            className="px-4 py-2 rounded-lg bg-gray-500 text-white flex items-center gap-2"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
        <h4 className="font-bold text-gray-700 mb-2">Color Guide:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Current Word</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Connected Words</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <span className="text-sm text-gray-600">Masked/Hidden Words</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded-full"></div>
            <span className="text-sm text-gray-600">Neutral Words</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttentionMaskingVisualizer