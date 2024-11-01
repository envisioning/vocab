"use client"
import { useState, useEffect } from "react"
import { 
  Brain,
  Lightbulb,
  ArrowRight,
  SplitSquareHorizontal,
  Eye,
  Network,
  HelpCircle
} from "lucide-react"

interface TransformerProps {}

type Token = {
  id: number
  text: string
  attention: number
  isProcessed: boolean
  connections: number[]
}

const INITIAL_SENTENCE = [
  { id: 1, text: "The", attention: 0, isProcessed: false, connections: [2] },
  { id: 2, text: "curious", attention: 0, isProcessed: false, connections: [3] },
  { id: 3, text: "cat", attention: 0, isProcessed: false, connections: [4, 5] },
  { id: 4, text: "chased", attention: 0, isProcessed: false, connections: [3, 5] },
  { id: 5, text: "butterflies", attention: 0, isProcessed: false, connections: [3, 4] }
]

export default function TransformerVisualizer({}: TransformerProps) {
  const [tokens, setTokens] = useState<Token[]>(INITIAL_SENTENCE)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeToken, setActiveToken] = useState<number | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setTokens(prev => {
          const newTokens = [...prev]
          const currentIdx = prev.findIndex(t => !t.isProcessed)
          
          if (currentIdx === -1) {
            setIsProcessing(false)
            return prev
          }

          const currentToken = newTokens[currentIdx]
          currentToken.isProcessed = true
          currentToken.attention = 1
          
          currentToken.connections.forEach(connectedId => {
            const connectedToken = newTokens.find(t => t.id === connectedId)
            if (connectedToken) {
              connectedToken.attention = 0.6
            }
          })

          return newTokens
        })
      }, 1500)

      return () => clearInterval(interval)
    }
  }, [isProcessing])

  const handleStart = () => {
    if (isProcessing) {
      setTokens(INITIAL_SENTENCE)
      setActiveToken(null)
    }
    setIsProcessing(!isProcessing)
  }

  return (
    <div className="min-h-[500px] p-8 bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900 rounded-xl shadow-xl">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-3">
          <Brain className="w-10 h-10 text-blue-500 animate-pulse" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Transformer Neural Network
          </h2>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-300"
          >
            <HelpCircle className="w-6 h-6 text-blue-500" />
          </button>
        </div>

        {showHelp && (
          <div className="bg-white/90 dark:bg-slate-800/90 p-4 rounded-lg shadow-lg max-w-xl">
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Transformers process text by paying attention to relationships between words.
              Watch as each word activates and forms connections with related words in the sentence.
              The brighter connections show stronger relationships!
            </p>
          </div>
        )}

        <div className="relative w-full max-w-3xl p-8 bg-white/90 dark:bg-slate-800/90 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-purple-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Self-Attention
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="w-6 h-6 text-green-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Neural Connections
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-6 mb-12">
            {tokens.map((token) => (
              <div
                key={token.id}
                className={`
                  relative p-4 rounded-xl transition-all duration-500
                  ${token.isProcessed 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg transform -translate-y-2' 
                    : 'bg-slate-100 dark:bg-slate-700'
                  }
                  ${token.attention > 0 ? 'ring-2 ring-purple-400 shadow-lg' : ''}
                `}
                style={{
                  transform: `scale(${1 + token.attention * 0.3})`
                }}
                onMouseEnter={() => setActiveToken(token.id)}
                onMouseLeave={() => setActiveToken(null)}
              >
                <span className="font-medium text-lg">{token.text}</span>
                {token.attention > 0 && (
                  <Lightbulb className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-5 h-5 text-yellow-400 animate-bounce" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleStart}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-full font-medium text-lg
                transition-all duration-300 transform hover:scale-105
                ${isProcessing
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                }
              `}
            >
              {isProcessing ? 'Reset' : 'Process'} 
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}