"use client"
import { useState, useEffect } from "react"
import { RefreshCw, Brain, ChevronRight, Sparkles, Type, Info } from "lucide-react"

interface PredictionProps {}

type Prediction = {
  word: string
  probability: number
}

type Sentence = {
  words: string[]
  predictions: Prediction[]
  context?: string
}

const SAMPLE_SENTENCES: Sentence[] = [
  {
    words: ["The", "cat", "sits", "on", "the"],
    predictions: [
      { word: "mat", probability: 35 },
      { word: "chair", probability: 25 },
      { word: "windowsill", probability: 20 },
      { word: "table", probability: 15 },
      { word: "bed", probability: 5 }
    ],
    context: "Based on common cat behaviors and frequent word associations"
  },
  {
    words: ["I", "love", "eating"],
    predictions: [
      { word: "pizza", probability: 30 },
      { word: "sushi", probability: 28 },
      { word: "ice cream", probability: 22 },
      { word: "chocolate", probability: 12 },
      { word: "pasta", probability: 8 }
    ],
    context: "Predicted from popular food preferences in language data"
  },
  {
    words: ["The", "weather", "is"],
    predictions: [
      { word: "beautiful", probability: 32 },
      { word: "sunny", probability: 28 },
      { word: "cold", probability: 22 },
      { word: "perfect", probability: 10 },
      { word: "changing", probability: 8 }
    ],
    context: "Common weather descriptions in conversation"
  },
  {
    words: ["Please", "remember", "to"],
    predictions: [
      { word: "bring", probability: 35 },
      { word: "call", probability: 25 },
      { word: "check", probability: 20 },
      { word: "send", probability: 15 },
      { word: "update", probability: 5 }
    ],
    context: "Frequent action requests in emails and messages"
  },
  {
    words: ["The", "movie", "was"],
    predictions: [
      { word: "amazing", probability: 30 },
      { word: "interesting", probability: 25 },
      { word: "disappointing", probability: 20 },
      { word: "boring", probability: 15 },
      { word: "fantastic", probability: 10 }
    ],
    context: "Common movie review expressions"
  },
  {
    words: ["I", "need", "to", "buy"],
    predictions: [
      { word: "groceries", probability: 35 },
      { word: "tickets", probability: 25 },
      { word: "clothes", probability: 20 },
      { word: "supplies", probability: 12 },
      { word: "food", probability: 8 }
    ],
    context: "Frequent shopping-related phrases"
  },
  {
    words: ["The", "students", "are"],
    predictions: [
      { word: "studying", probability: 38 },
      { word: "learning", probability: 25 },
      { word: "working", probability: 20 },
      { word: "preparing", probability: 12 },
      { word: "practicing", probability: 5 }
    ],
    context: "Common educational activities"
  },
  {
    words: ["She", "plays", "the"],
    predictions: [
      { word: "piano", probability: 35 },
      { word: "guitar", probability: 30 },
      { word: "violin", probability: 20 },
      { word: "drums", probability: 10 },
      { word: "flute", probability: 5 }
    ],
    context: "Common musical instruments"
  },
  {
    words: ["The", "train", "arrives"],
    predictions: [
      { word: "soon", probability: 40 },
      { word: "late", probability: 25 },
      { word: "early", probability: 20 },
      { word: "tomorrow", probability: 10 },
      { word: "tonight", probability: 5 }
    ],
    context: "Transportation time expressions"
  },
  {
    words: ["Let's", "meet", "at"],
    predictions: [
      { word: "lunch", probability: 32 },
      { word: "home", probability: 28 },
      { word: "noon", probability: 20 },
      { word: "six", probability: 12 },
      { word: "dinner", probability: 8 }
    ],
    context: "Common meeting arrangements"
  },
  {
    words: ["The", "garden", "looks"],
    predictions: [
      { word: "beautiful", probability: 35 },
      { word: "green", probability: 25 },
      { word: "amazing", probability: 20 },
      { word: "different", probability: 12 },
      { word: "overgrown", probability: 8 }
    ],
    context: "Garden descriptions in conversation"
  },
  {
    words: ["This", "recipe", "requires"],
    predictions: [
      { word: "patience", probability: 30 },
      { word: "ingredients", probability: 28 },
      { word: "time", probability: 22 },
      { word: "practice", probability: 12 },
      { word: "attention", probability: 8 }
    ],
    context: "Cooking and recipe instructions"
  },
  {
    words: ["The", "computer", "is"],
    predictions: [
      { word: "slow", probability: 35 },
      { word: "broken", probability: 25 },
      { word: "running", probability: 20 },
      { word: "updating", probability: 15 },
      { word: "working", probability: 5 }
    ],
    context: "Technology status descriptions"
  },
  {
    words: ["They", "went", "to"],
    predictions: [
      { word: "school", probability: 30 },
      { word: "work", probability: 25 },
      { word: "sleep", probability: 20 },
      { word: "lunch", probability: 15 },
      { word: "class", probability: 10 }
    ],
    context: "Common destination phrases"
  },
  {
    words: ["The", "party", "starts"],
    predictions: [
      { word: "tonight", probability: 35 },
      { word: "soon", probability: 25 },
      { word: "tomorrow", probability: 20 },
      { word: "late", probability: 12 },
      { word: "early", probability: 8 }
    ],
    context: "Event timing expressions"
  },
  {
    words: ["I", "want", "to"],
    predictions: [
      { word: "sleep", probability: 32 },
      { word: "learn", probability: 28 },
      { word: "travel", probability: 20 },
      { word: "help", probability: 12 },
      { word: "dance", probability: 8 }
    ],
    context: "Common desire expressions"
  },
  {
    words: ["The", "music", "sounds"],
    predictions: [
      { word: "great", probability: 35 },
      { word: "beautiful", probability: 25 },
      { word: "loud", probability: 20 },
      { word: "different", probability: 12 },
      { word: "familiar", probability: 8 }
    ],
    context: "Music appreciation phrases"
  },
  {
    words: ["We", "should", "go"],
    predictions: [
      { word: "home", probability: 35 },
      { word: "now", probability: 25 },
      { word: "together", probability: 20 },
      { word: "outside", probability: 12 },
      { word: "somewhere", probability: 8 }
    ],
    context: "Suggestion phrases in conversation"
  },
  {
    words: ["The", "book", "seems"],
    predictions: [
      { word: "interesting", probability: 35 },
      { word: "boring", probability: 25 },
      { word: "long", probability: 20 },
      { word: "difficult", probability: 12 },
      { word: "familiar", probability: 8 }
    ],
    context: "Book review expressions"
  },
  {
    words: ["She", "always", "makes"],
    predictions: [
      { word: "time", probability: 32 },
      { word: "dinner", probability: 28 },
      { word: "plans", probability: 20 },
      { word: "mistakes", probability: 12 },
      { word: "excuses", probability: 8 }
    ],
    context: "Common behavioral patterns"
  }
];

export default function NextWordPredictor({}: PredictionProps) {
  const getRandomSentence = (): number => 
    Math.floor(Math.random() * SAMPLE_SENTENCES.length)

  const [currentSentence, setCurrentSentence] = useState<number>(getRandomSentence())
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

  const handleRefresh = () => {
    setTypedWords([])
    setSelectedPrediction("")
    setCurrentSentence(getRandomSentence())
  }

  const getHighestProbability = (): number => {
    return Math.max(
      ...SAMPLE_SENTENCES[currentSentence].predictions.map(p => p.probability)
    )
  }

  return (
    <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 md:w-8 md:h-8 text-blue-500 animate-pulse" />
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            Next Word Prediction
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5 text-blue-500" />
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <Info className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-gray-800 text-sm md:text-base text-gray-600 dark:text-gray-300 border border-blue-100 dark:border-gray-700">
          Watch as AI predicts the next word based on context and patterns learned from vast amounts of text data. Click the refresh button to see a new example.
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
              {SAMPLE_SENTENCES[currentSentence].predictions.map((pred, i) => {
                const isHighest = pred.probability === getHighestProbability()
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedPrediction(pred.word)}
                    className={`
                      px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-base font-medium
                      transition-all duration-300 transform hover:scale-105
                      ${selectedPrediction === pred.word 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                        : isHighest
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {pred.word}
                    <span className="ml-1 md:ml-2 text-[10px] md:text-xs opacity-75">
                      {pred.probability}%
                    </span>
                    <ChevronRight className="w-4 h-4 inline-block ml-1" />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}