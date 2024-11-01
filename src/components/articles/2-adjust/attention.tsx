"use client"
import { useState, useEffect } from "react"
import { Brain, Eye, ArrowRight, Lightbulb, Info, Sparkles, Zap } from "lucide-react"

interface ComponentProps {}

type Word = {
  text: string
  attention: number
  importance: string
}

const SAMPLE_TEXT = [
  { text: "The", importance: "low" },
  { text: "hungry", importance: "high" },
  { text: "cat", importance: "high" },
  { text: "quickly", importance: "medium" },
  { text: "chased", importance: "high" },
  { text: "the", importance: "low" },
  { text: "mouse", importance: "high" }
]

export default function AttentionVisualizer({}: ComponentProps) {
  const [words, setWords] = useState<Word[]>([])
  const [focusedWord, setFocusedWord] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const initialWords = SAMPLE_TEXT.map(({ text, importance }) => ({
      text,
      attention: 0,
      importance
    }))
    setWords(initialWords)

    return () => {
      setWords([])
      setIsAnimating(false)
    }
  }, [])

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setFocusedWord(prev => (prev + 1) % words.length)
        setWords(prev => 
          prev.map((word, i) => ({
            ...word,
            attention: i === (focusedWord + 1) % words.length ? 1 : 0.2
          }))
        )
      }, 1500)

      return () => clearInterval(interval)
    }
  }, [isAnimating, focusedWord, words.length])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex flex-col items-center mb-12">
          <div className="flex items-center gap-3">
            <Brain className="w-16 h-16 text-blue-400 animate-pulse" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              AI Attention Mechanism
            </h1>
          </div>
          
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="mt-4 text-slate-300 hover:text-blue-400 transition-colors duration-300"
          >
            <Info size={20} />
          </button>
          
          {showTooltip && (
            <div className="absolute top-24 bg-slate-800 p-4 rounded-lg shadow-xl text-slate-200 max-w-sm text-center z-10">
              Attention helps AI understand importance by focusing on specific words, similar to how humans emphasize key information while reading.
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {words.map((word, i) => (
            <div key={i} className="relative group">
              <div
                className={`
                  p-4 rounded-lg backdrop-blur-sm transition-all duration-500
                  ${word.attention === 1 ? 'bg-blue-500/20 scale-110' : 'bg-slate-800/50 scale-100'}
                  ${word.importance === 'high' ? 'border-2 border-yellow-400/50' : ''}
                `}
              >
                <div className={`
                  text-2xl font-bold transition-all duration-500
                  ${word.attention === 1 ? 'text-white' : 'text-slate-400'}
                `}>
                  {word.text}
                </div>
                
                {word.attention === 1 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2">
                    <Eye className="text-yellow-400 animate-bounce" size={24} />
                    <Sparkles className="text-purple-400 animate-pulse" size={24} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => setIsAnimating(prev => !prev)}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
          >
            {isAnimating ? 'Pause Visualization' : 'Start Visualization'}
            <Zap className={`${isAnimating ? 'animate-pulse' : ''}`} />
          </button>

          <div className="flex items-center gap-2 text-slate-300">
            <Lightbulb className="text-yellow-400" size={20} />
            <span>Watch how AI processes and prioritizes information</span>
          </div>
        </div>
      </div>
    </div>
  )
}