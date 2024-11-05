"use client"
import { useState, useEffect } from "react"
import { Brain, ChevronRight, Sparkles, Type, Info } from "lucide-react"

interface PredictionProps {}

type Sentence = {
  words: string[]
  predictions: string[]
  context?: string
}

const SAMPLE_SENTENCES: Sentence[] = [
  {
    words: ["The", "cat", "sits", "on", "the"],
    predictions: ["mat", "chair", "windowsill", "table", "bed"],
    context: "Based on common cat behaviors and frequent word associations"
  },
  {
    words: ["I", "love", "eating"],
    predictions: ["pizza", "sushi", "ice cream", "chocolate", "pasta"],
    context: "Predicted from popular food preferences in language data"
  },
  {
    words: ["She", "opened", "the"],
    predictions: ["door", "window", "book", "letter", "box"],
    context: "Common objects that follow the action 'opened' in text"
  }
]

export default function NextWordPredictor({}: PredictionProps) {
  const [currentSentence, setCurrentSentence] = useState<number>(0)
  const [typedWords, setTypedWords] = useState<string[]>([])
  const [selectedPrediction, setSelectedPrediction] = useState<string>("")
  const [isTyping, setIsTyping] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    let typingInterval: NodeJS.Timeout
    
    if (typedWords.length < SAMPLE_SENTENCES[currentSentence].words.length) {
      setIsTyping(true)
      typingInterval = setInterval(() => {
        setTypedWords(prev => [
          ...prev,
          SAMPLE_SENTENCES[currentSentence].words[prev.length]
        ])
      }, 600)
    } else {
      setIsTyping(false)
    }

    return () => clearInterval(typingInterval)
  }, [typedWords, currentSentence])

  useEffect(() => {
    const timer = setTimeout(() => {
      setTypedWords([])
      setSelectedPrediction("")
      setCurrentSentence((prev) => 
        prev === SAMPLE_SENTENCES.length - 1 ? 0 : prev + 1
      )
    }, 6000)

    return () => clearTimeout(timer)
  }, [selectedPrediction])

  return (
    <div className="min-h-[500px] p-6 md:p-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 md:w-8 md:h-8 text-blue-500 animate-pulse" />
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            Next Word Prediction
          </h2>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
        >
          <Info className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {showInfo && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-gray-800 text-sm md:text-base text-gray-600 dark:text-gray-300 border border-blue-100 dark:border-gray-700">
          Watch as AI predicts the next word based on context and patterns learned from vast amounts of text data.
        </div>
      )}

      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 min-h-[80px] p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
            <Type className="w-5 h-5 text-blue-400" />
            <div className="flex flex-wrap gap-2">
              {typedWords.map((word, i) => (
                <span 
                  key={i}
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300"
                >
                  {word}
                </span>
              ))}
              {isTyping && (
                <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse" />
              )}
              {selectedPrediction && (
                <span className="text-base md:text-lg text-blue-500 font-medium animate-fade-in">
                  {selectedPrediction}
                </span>
              )}
            </div>
          </div>

          {SAMPLE_SENTENCES[currentSentence].context && (
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 italic">
              {SAMPLE_SENTENCES[currentSentence].context}
            </p>
          )}
        </div>

        {typedWords.length === SAMPLE_SENTENCES[currentSentence].words.length && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                AI Predictions:
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {SAMPLE_SENTENCES[currentSentence].predictions.map((pred, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPrediction(pred)}
                  className={`
                    px-4 py-2 rounded-full text-sm md:text-base font-medium
                    transition-all duration-300 transform hover:scale-105
                    ${selectedPrediction === pred 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {pred}
                  <ChevronRight className="w-4 h-4 inline-block ml-1" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}