"use client"
import { useState, useEffect } from "react"
import { MessageSquare, Brain, Cpu, ArrowRight, Sparkles, InfoIcon, BookOpen, Zap, Heart } from "lucide-react"

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
  { text: "The AI breakthrough is revolutionary", type: "human" }
]

const SENTIMENTS = {
  positive: "bg-gradient-to-br from-green-50 to-emerald-100 border-green-400 shadow-lg shadow-green-100/50",
  negative: "bg-gradient-to-br from-red-50 to-rose-100 border-red-400 shadow-lg shadow-red-100/50",
  neutral: "bg-gradient-to-br from-blue-50 to-sky-100 border-blue-400 shadow-lg shadow-blue-100/50"
}

export default function NLPVisualizer({}: ComponentProps) {
  const [activeMessage, setActiveMessage] = useState<Message | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analyzedMessages, setAnalyzedMessages] = useState<Message[]>([])
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  useEffect(() => {
    return () => {
      setShowTooltip(null)
      setActiveMessage(null)
    }
  }, [])

  const analyzeText = (message: Message) => {
    setIsProcessing(true)
    setActiveMessage(message)

    const timer = setTimeout(() => {
      const analysis = {
        sentiment: message.text.includes("fascinated") || message.text.includes("revolutionary")
          ? "positive"
          : message.text.includes("complex") || message.text.includes("too")
          ? "negative"
          : "neutral",
        keywords: message.text
          .toLowerCase()
          .split(" ")
          .filter(word => word.length > 4),
        confidence: Math.random() * 30 + 70
      }

      setAnalyzedMessages(prev => [...prev, { ...message, analyzed: analysis }])
      setIsProcessing(false)
    }, 2000)

    return () => clearTimeout(timer)
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl shadow-xl">
        <div className="flex items-center justify-center gap-3">
          <Brain className="w-10 h-10 text-blue-600 animate-pulse" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Natural Language Processing
          </h2>
        </div>
        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
          <BookOpen className="w-5 h-5" />
          Discover how AI understands and analyzes human language patterns
        </p>
      </div>

      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="font-semibold flex items-center gap-2 text-xl">
            <MessageSquare className="text-blue-500" />
            Input Messages
            <InfoIcon 
              className="w-4 h-4 text-gray-400 cursor-help"
              onMouseEnter={() => setShowTooltip(1)}
              onMouseLeave={() => setShowTooltip(null)}
            />
            {showTooltip === 1 && (
              <div className="absolute bg-white p-3 rounded-lg shadow-xl border border-gray-200 text-sm max-w-xs">
                Click on any message to see how AI analyzes its meaning and emotion
              </div>
            )}
          </h3>
          {SAMPLE_MESSAGES.map((message, idx) => (
            <button
              key={idx}
              onClick={() => analyzeText(message)}
              disabled={isProcessing}
              className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-500 transform hover:scale-102 hover:shadow-lg
                ${activeMessage === message
                  ? "border-blue-500 bg-blue-50/50 shadow-blue-100"
                  : "border-gray-200 hover:border-blue-300"}`}
            >
              {message.text}
              <Zap className={`inline ml-2 w-4 h-4 ${activeMessage === message ? "text-blue-500" : "text-gray-400"}`} />
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="font-semibold flex items-center gap-2 text-xl">
            <Cpu className="text-blue-500" />
            AI Analysis Results
          </h3>
          {isProcessing ? (
            <div className="animate-pulse flex items-center justify-center h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
              <div className="flex flex-col items-center gap-3">
                <Brain className="animate-spin text-blue-500 w-8 h-8" />
                <span className="text-blue-600 font-medium">Processing natural language...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {analyzedMessages.map((message, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-xl border-2 transition-all duration-500 
                    ${message.analyzed?.sentiment === "positive"
                      ? SENTIMENTS.positive
                      : message.analyzed?.sentiment === "negative"
                      ? SENTIMENTS.negative
                      : SENTIMENTS.neutral}`}
                >
                  <p className="font-medium text-lg">{message.text}</p>
                  <div className="mt-4 space-y-2">
                    <p className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Emotional Tone: 
                      <span className="font-semibold capitalize">
                        {message.analyzed?.sentiment}
                      </span>
                      <Sparkles className="w-4 h-4 text-blue-500" />
                    </p>
                    <p className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Key Concepts: 
                      <span className="font-medium">
                        {message.analyzed?.keywords.join(", ")}
                      </span>
                    </p>
                    <div className="mt-2 h-2 rounded-full bg-gray-200">
                      <div 
                        className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                        style={{ width: `${message.analyzed?.confidence}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 text-right">
                      Analysis Confidence: {message.analyzed?.confidence.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}