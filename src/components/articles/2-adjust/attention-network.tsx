"use client"
import { useState, useEffect } from "react"
import { Brain, Eye, MessageSquare, ArrowRight, HelpCircle, Info } from "lucide-react"

interface AttentionProps {}

type WordType = {
  id: number
  text: string
  importance: number
  explanation: string
}

const SAMPLE_SENTENCE: WordType[] = [
  { id: 1, text: "The", importance: 0.2, explanation: "Articles receive less attention" },
  { id: 2, text: "curious", importance: 0.8, explanation: "Descriptive adjectives provide important context" },
  { id: 3, text: "cat", importance: 0.9, explanation: "Main subject of the sentence" },
  { id: 4, text: "watched", importance: 0.7, explanation: "Key action verb connecting subjects" },
  { id: 5, text: "the", importance: 0.2, explanation: "Articles receive less attention" },
  { id: 6, text: "playful", importance: 0.8, explanation: "Descriptive adjectives provide important context" },
  { id: 7, text: "mouse", importance: 0.9, explanation: "Object of the sentence" }
]

export default function AttentionNetwork({}: AttentionProps) {
  const [activeWord, setActiveWord] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        setShowOutput(true)
        setIsProcessing(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isProcessing])

  const handleProcess = () => {
    setIsProcessing(true)
    setShowOutput(false)
    setActiveWord(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Attention Network Visualizer
          </h2>
          <div className="relative group">
            <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
            <div className="hidden group-hover:block absolute z-10 w-64 p-3 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl -left-28 top-8 border border-gray-200 dark:border-gray-700">
              Attention networks help AI focus on what's important, just like how humans pay attention to key details!
            </div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
          Explore how AI learns to focus on important words in a sentence
        </p>
      </div>

      <div className="relative bg-white dark:bg-gray-800 rounded-xl p-4 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-6 md:mb-8">
          <div className="flex flex-col items-center">
            <Eye className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
            <span className="text-xs mt-1">Input</span>
          </div>
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
          <div className="flex flex-col items-center">
            <Brain className="w-6 h-6 md:w-8 md:h-8 text-purple-500 animate-pulse" />
            <span className="text-xs mt-1">Process</span>
          </div>
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
          <div className="flex flex-col items-center">
            <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <span className="text-xs mt-1">Output</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
          {SAMPLE_SENTENCE.map((word) => (
            <div
              key={word.id}
              className="relative"
              onMouseEnter={() => setShowTooltip(word.id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div
                className={`
                  relative p-2 md:p-3 rounded-lg cursor-pointer
                  transition-all duration-300 transform
                  ${activeWord === word.id ? "bg-blue-100 dark:bg-blue-900 scale-110" : 
                    "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"}
                `}
                style={{
                  opacity: isProcessing ? word.importance : 1,
                }}
                onClick={() => setActiveWord(word.id)}
              >
                <span className="text-base md:text-lg font-medium">{word.text}</span>
                {isProcessing && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500 animate-pulse"
                       style={{ opacity: word.importance }} />
                )}
              </div>
              {showTooltip === word.id && (
                <div className="absolute z-10 w-48 p-2 text-xs bg-black text-white rounded shadow-lg -bottom-12 left-1/2 transform -translate-x-1/2">
                  {word.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className={`
            w-full py-2 md:py-3 rounded-lg font-medium text-sm md:text-base
            transition-all duration-300 transform hover:scale-105
            ${isProcessing ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed" : 
              "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"}
          `}
        >
          {isProcessing ? "Processing..." : "Analyze Sentence"}
        </button>

        {showOutput && (
          <div className="mt-4 md:mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg animate-fade-in">
            <p className="text-center text-gray-800 dark:text-gray-200 text-sm md:text-base">
              Key Information Extracted: {" "}
              <span className="font-bold">
                curious cat → watched → playful mouse
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}