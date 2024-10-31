"use client"
import { useState, useEffect } from "react"
import { MessageSquare, Globe2, Brain, Sparkles, ArrowRight, Info, Book, Bot } from "lucide-react"

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
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

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
    }, 2500)

    return () => clearInterval(timer)
  }, [currentIndex])

  const handleReset = () => {
    setIsAnimating(true)
    setConversations(CONVERSATIONS)
    setCurrentIndex(0)
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent 
              flex items-center justify-center gap-3">
              <Globe2 className="w-10 h-10 text-blue-600" />
              Natural Language
              <Brain className="w-10 h-10 text-purple-600" />
            </h1>
            <Info 
              className="w-6 h-6 text-blue-400 absolute -right-8 top-0 cursor-pointer hover:text-blue-600 transition-colors duration-300"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute -right-4 top-10 bg-white p-4 rounded-lg shadow-xl w-64 text-sm text-gray-600 z-10">
                Natural language is how humans naturally communicate in everyday life, unlike formal or computer language
              </div>
            )}
          </div>
          <p className="text-gray-600 text-xl flex items-center justify-center gap-2">
            <Book className="w-5 h-5" />
            From Robot-Speak to Human-Talk
            <Bot className="w-5 h-5" />
          </p>
        </div>

        <div className={`space-y-8 transition-all duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {conversations.map((conv, idx) => (
            <div
              key={idx}
              className={`transform transition-all duration-500 ${
                conv.isVisible
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-[-100px] opacity-0'
              }`}
            >
              <div className="bg-white rounded-xl shadow-xl p-6 space-y-4 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center space-x-4 text-gray-800 border-l-4 border-red-400 pl-4">
                  <Bot className="w-6 h-6 text-red-400" />
                  <p className="font-mono text-sm">{conv.formal}</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <ArrowRight className="w-5 h-5 text-blue-400 animate-pulse" />
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-bounce" />
                </div>
                <div className="flex items-center space-x-4 text-blue-600 border-l-4 border-blue-400 pl-4">
                  <MessageSquare className="w-6 h-6" />
                  <p className="text-lg font-medium">{conv.natural}</p>
                </div>
                <p className="text-sm text-gray-500 italic mt-4 bg-blue-50 p-3 rounded-lg">
                  {conv.context}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="mx-auto block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full
            hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300
            flex items-center gap-3 shadow-lg font-medium text-lg"
        >
          <Globe2 className="w-6 h-6" />
          Watch Again
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}