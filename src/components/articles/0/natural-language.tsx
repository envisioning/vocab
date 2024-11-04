"use client"
"use client"
import { useState, useEffect } from "react"
import { MessageSquare, Brain, Sparkles, ArrowRight, Bot } from "lucide-react"

interface ComponentProps {}

type ConversationType = {
  formal: string
  natural: string
  context: string
  isVisible: boolean
}

const CONVERSATIONS: ConversationType[] = [
  {
    formal: "Request sustenance delivery to current location",
    natural: "I'm hungry, can you order some pizza?",
    context: "Natural language uses everyday words and informal expressions we're comfortable with",
    isVisible: false
  },
  {
    formal: "Initiate bilateral social engagement protocol via digital medium",
    natural: "Hey, wanna FaceTime?",
    context: "Notice how natural language is shorter and more emotionally connected",
    isVisible: false
  },
  {
    formal: "Commence recreational activity in external environment",
    natural: "Let's go play outside!",
    context: "Natural language captures enthusiasm and spontaneity in communication",
    isVisible: false
  }
]

export default function NaturalLanguageExplainer({}: ComponentProps) {
  const [conversations, setConversations] = useState<ConversationType[]>(CONVERSATIONS)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < conversations.length) {
        setConversations(prev => 
          prev.map((conv, idx) => 
            idx === currentIndex ? { ...conv, isVisible: true } : conv
          )
        )
        setCurrentIndex(prev => prev + 1)
      }
    }, 1800)

    return () => clearInterval(timer)
  }, [currentIndex])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="relative max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent 
              flex items-center justify-center">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400" />
                <span className="mx-2">AI in Plain Words</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
            From Robot-Speak to Human-Talk
          </p>
          <p className="font-light sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
            Natural language is how humans naturally communicate in everyday life, unlike formal or computer language.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {conversations.map((conv, idx) => (
            <div
              key={idx}
              className={`transform transition-all duration-300 ${
                conv.isVisible
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-[-100px] opacity-0'
              }`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 space-y-4 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center space-x-3 sm:space-x-4 text-gray-800 dark:text-gray-200 border-l-4 border-red-400 pl-3 sm:pl-4">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                  <p className="font-mono text-xs sm:text-sm">{conv.formal}</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 dark:text-blue-300 animate-pulse" />
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 dark:text-yellow-300 animate-bounce" />
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 text-blue-600 dark:text-blue-400 border-l-4 border-blue-400 pl-3 sm:pl-4">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                  <p className="text-base sm:text-lg font-medium">{conv.natural}</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic mt-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                  {conv.context}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}