"use client"
import { useState, useEffect } from "react"
import { MessageSquare, Brain, Cpu, ArrowRight, Sparkles, BookOpen, Zap, Heart, Shuffle } from "lucide-react"

interface Message {
  text: string
  type: "human" | "ai"
  analyzed?: {
    sentiment: string
    keywords: string[]
    confidence: number
  }
}

interface ComponentProps {}

const SAMPLE_MESSAGES: Message[] = [
  { text: "I'm fascinated by quantum computing!", type: "human" },
  { text: "This neural network is too complex to understand...", type: "human" },
  { text: "Machine learning algorithms amaze me with their accuracy", type: "human" },
  { text: "I'm struggling with these deep learning concepts today", type: "human" },
  { text: "The future of AI ethics concerns me deeply", type: "human" },
  { text: "The AI breakthrough is revolutionary", type: "human" },
  { text: "Natural language processing is transforming communication", type: "human" },
  { text: "I'm worried about AI taking over jobs in the future", type: "human" },
  { text: "The pattern recognition capabilities are incredible", type: "human" },
  { text: "Data privacy in AI systems frustrates me", type: "human" },
  { text: "Computer vision technology is evolving beautifully", type: "human" },
  { text: "AI-assisted healthcare gives me hope", type: "human" },
  { text: "These algorithms are learning too unpredictably", type: "human" },
  { text: "Robotics integration excites me tremendously", type: "human" },
  { text: "The computational requirements overwhelm me", type: "human" }
]

const SENTIMENTS = {
  positive: "dark:from-green-900 dark:to-emerald-800 dark:border-green-600 from-green-50 to-emerald-100 border-green-400 shadow-lg shadow-green-100/50 dark:shadow-green-900/50",
  negative: "dark:from-red-900 dark:to-rose-800 dark:border-red-600 from-red-50 to-rose-100 border-red-400 shadow-lg shadow-red-100/50 dark:shadow-red-900/50",
  neutral: "dark:from-blue-900 dark:to-sky-800 dark:border-blue-600 from-blue-50 to-sky-100 border-blue-400 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/50"
}

export default function NLPVisualizer({}: ComponentProps) {
  const [activeMessage, setActiveMessage] = useState<Message | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analyzedMessage, setAnalyzedMessage] = useState<Message | null>(null)
  
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])

  useEffect(() => {
    // Get 3 random messages on component mount
    const getRandomMessages = () => {
      const shuffled = [...SAMPLE_MESSAGES].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, 3)
    }
    
    setDisplayedMessages(getRandomMessages())

    return () => {
      
      setActiveMessage(null)
      setAnalyzedMessage(null)
    }
  }, [])

  const handleNewMessages = () => {
    setDisplayedMessages(prev => {
      let newMessages = [...SAMPLE_MESSAGES].sort(() => Math.random() - 0.5).slice(0, 3)
      // Ensure we don't get the same set of messages
      while (JSON.stringify(newMessages) === JSON.stringify(prev)) {
        newMessages = [...SAMPLE_MESSAGES].sort(() => Math.random() - 0.5).slice(0, 3)
      }
      return newMessages
    })
    setActiveMessage(null)
    setAnalyzedMessage(null)
  }

  const analyzeText = (message: Message) => {
    setIsProcessing(true)
    setActiveMessage(message)

    const timer = setTimeout(() => {
      const analysis = {
        sentiment: message.text.includes("fascinated") || message.text.includes("revolutionary") || message.text.includes("amaze")
          ? "positive"
          : message.text.includes("complex") || message.text.includes("struggling") || message.text.includes("concerns")
          ? "negative"
          : "neutral",
        keywords: message.text
          .toLowerCase()
          .split(" ")
          .filter(word => word.length > 4),
        confidence: Math.random() * 30 + 70
      }

      setAnalyzedMessage({ ...message, analyzed: analysis })
      setIsProcessing(false)
    }, 1500)

    return () => clearTimeout(timer)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8 dark:bg-gray-900 dark:text-gray-100">
      <div className="text-center space-y-4 md:space-y-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-4 md:p-8 rounded-2xl shadow-xl">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <Brain className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Language Decoder
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg flex items-center justify-center gap-2">
          Discover how AI understands and analyzes human language patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2 text-lg md:text-xl">
              <MessageSquare className="text-blue-500 dark:text-blue-400" />
              Input Messages
            </h3>
            <button
              onClick={handleNewMessages}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-300"
              aria-label="Get new random messages"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">New Messages</span>
            </button>
          </div>
          {displayedMessages.map((message, idx) => (
            <button
              key={idx}
              onClick={() => analyzeText(message)}
              disabled={isProcessing}
              className={`w-full p-4 md:p-5 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                ${activeMessage === message
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/50 dark:border-blue-400 shadow-blue-100 dark:shadow-blue-900"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"}`}
            >
              <span className="text-sm md:text-base">{message.text}</span>
              <Zap className={`inline ml-2 w-4 h-4 ${activeMessage === message ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} />
            </button>
          ))}
        </div>

        <div className="space-y-4 md:space-y-6">
          <h3 className="font-semibold flex items-center gap-2 text-lg md:text-xl">
            <Cpu className="text-blue-500 dark:text-blue-400" />
            AI Analysis Results
          </h3>
          {isProcessing ? (
            <div className="animate-pulse flex items-center justify-center h-40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="flex flex-col items-center gap-3">
                <Brain className="animate-spin text-blue-500 dark:text-blue-400 w-8 h-8" />
                <span className="text-blue-600 dark:text-blue-400 font-medium">Processing natural language...</span>
              </div>
            </div>
          ) : analyzedMessage ? (
            <div
              className={`p-4 md:p-6 rounded-xl border-2 transition-all duration-300 
                ${analyzedMessage.analyzed?.sentiment === "positive"
                  ? SENTIMENTS.positive
                  : analyzedMessage.analyzed?.sentiment === "negative"
                  ? SENTIMENTS.negative
                  : SENTIMENTS.neutral}`}
            >
              <p className="font-medium text-base md:text-lg">{analyzedMessage.text}</p>
              <div className="mt-4 space-y-2">
                <p className="flex items-center gap-2 text-sm md:text-base">
                  <Heart className="w-4 h-4" />
                  Emotional Tone: 
                  <span className="font-semibold capitalize">
                    {analyzedMessage.analyzed?.sentiment}
                  </span>
                  <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                </p>
                <p className="flex items-center gap-2 text-sm md:text-base">
                  <Zap className="w-4 h-4" />
                  Key Concepts: 
                  <span className="font-medium">
                    {analyzedMessage.analyzed?.keywords.join(", ")}
                  </span>
                </p>
                <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-full rounded-full bg-blue-500 dark:bg-blue-400 transition-all duration-1000"
                    style={{ width: `${analyzedMessage.analyzed?.confidence}%` }}
                  />
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 text-right">
                  Analysis Confidence: {analyzedMessage.analyzed?.confidence.toFixed(1)}%
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">Select a message to analyze</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}