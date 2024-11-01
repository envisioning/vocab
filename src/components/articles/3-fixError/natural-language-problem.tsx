"use client"
import { useState, useEffect } from "react"
import { MessageCircle, Bot, Brain, AlertCircle, HelpCircle, Lightbulb, ArrowRight, Sparkles } from "lucide-react"

interface ComponentProps {}

type Message = {
  id: number
  text: string
  literal: string
  explanation: string
  confusion: number
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: 1,
    text: "I'm feeling under the weather",
    literal: "I'm feeling sick or unwell",
    explanation: "This idiom originated from sailors who would go below deck during storms to avoid sickness",
    confusion: 0.8
  },
  {
    id: 2,
    text: "It's raining cats and dogs",
    literal: "It's raining very heavily",
    explanation: "This phrase possibly originated from Norse mythology or when dead animals would wash up during storms",
    confusion: 0.9
  },
  {
    id: 3,
    text: "Break a leg!",
    literal: "Good luck!",
    explanation: "Theatrical superstition: saying 'good luck' was considered bad luck, so they said the opposite",
    confusion: 0.95
  }
]

export default function NaturalLanguageProblems({}: ComponentProps) {
  const [activeMessage, setActiveMessage] = useState<Message | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        setShowExplanation(true)
        setIsProcessing(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isProcessing])

  const handleMessageClick = (message: Message) => {
    setActiveMessage(message)
    setShowExplanation(false)
    setIsProcessing(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 rounded-2xl shadow-xl">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Natural Language Mysteries
        </h2>
        <div className="flex items-center justify-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">
            Explore how AI interprets human expressions differently
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_MESSAGES.map((message) => (
          <div key={message.id} className="relative">
            <button
              onMouseEnter={() => setShowTooltip(message.id)}
              onMouseLeave={() => setShowTooltip(null)}
              onClick={() => handleMessageClick(message)}
              className={`w-full p-6 rounded-xl transition-all duration-300 transform hover:scale-105
                ${
                  activeMessage?.id === message.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 hover:shadow-md"
                }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">{message.text}</span>
              </div>
            </button>
            {showTooltip === message.id && (
              <div className="absolute top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 text-sm w-64">
                <Lightbulb className="w-4 h-4 text-yellow-500 inline mr-2" />
                Click to see how AI processes this phrase
              </div>
            )}
          </div>
        ))}
      </div>

      {activeMessage && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <Bot className={`w-16 h-16 ${isProcessing ? "animate-bounce" : ""} text-blue-500`} />
              {isProcessing && (
                <Brain className="w-8 h-8 absolute -top-2 -right-2 text-purple-500 animate-spin" />
              )}
            </div>
          </div>

          {showExplanation && (
            <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300">Human Says:</h3>
                  <p className="mt-2">{activeMessage.text}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="flex-1 p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-purple-700 dark:text-purple-300">AI Understands:</h3>
                  <p className="mt-2">{activeMessage.literal}</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold">Historical Context:</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{activeMessage.explanation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}