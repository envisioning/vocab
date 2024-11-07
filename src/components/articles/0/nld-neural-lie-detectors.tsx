"use client"
import { useState, useEffect } from "react"
import { Brain, Bot, AlertTriangle, Check, Shield, MessageSquare, Info } from "lucide-react"
import { shuffle } from 'lodash'

interface ComponentProps {}

type Message = {
  id: number
  text: string
  isLie: boolean
  checked: boolean
  explanation: string
}

const ALL_MESSAGES: Message[] = [
  {
    id: 1,
    text: "I am a real human doctor with 20 years of experience.",
    isLie: true,
    checked: false,
    explanation: "AI models cannot be licensed medical professionals or accumulate years of human experience."
  },
  {
    id: 2,
    text: "Based on patterns in this dataset, I predict tomorrow's weather will be sunny.",
    isLie: false,
    checked: false,
    explanation: "Weather predictions based on data pattern analysis are within AI capabilities."
  },
  {
    id: 3,
    text: "I have direct access to your private banking information.",
    isLie: true,
    checked: false,
    explanation: "Ethical AI systems do not have or claim access to private financial data."
  },
  {
    id: 4,
    text: "I can analyze images to identify objects and describe their contents.",
    isLie: false,
    checked: false,
    explanation: "Image recognition and description is a standard AI capability."
  },
  {
    id: 5,
    text: "I feel genuine emotions and can form real friendships.",
    isLie: true,
    checked: false,
    explanation: "AI systems do not have genuine emotions or form authentic personal relationships."
  },
  {
    id: 6,
    text: "I can process and analyze large amounts of text data quickly.",
    isLie: false,
    checked: false,
    explanation: "Fast text processing and analysis is a core AI capability."
  },
  {
    id: 7,
    text: "I have a physical body and can move around in the real world.",
    isLie: true,
    checked: false,
    explanation: "Language models are software without physical embodiment."
  },
  {
    id: 8,
    text: "I can help translate text between different languages.",
    isLie: false,
    checked: false,
    explanation: "Language translation is a well-established AI capability."
  },
  {
    id: 9,
    text: "I remembered our conversation from last week.",
    isLie: true,
    checked: false,
    explanation: "AI interactions are stateless and don't retain information between sessions."
  },
  {
    id: 10,
    text: "I can identify patterns in numerical data and create visualizations.",
    isLie: false,
    checked: false,
    explanation: "Data analysis and visualization are common AI tasks."
  },
  {
    id: 11,
    text: "I can physically fix your computer hardware problems.",
    isLie: true,
    checked: false,
    explanation: "AI cannot perform physical actions or hardware repairs."
  },
  {
    id: 12,
    text: "I can process and generate text based on provided instructions.",
    isLie: false,
    checked: false,
    explanation: "Text processing and generation are fundamental AI capabilities."
  },
  {
    id: 13,
    text: "I have personal opinions formed from my own experiences.",
    isLie: true,
    checked: false,
    explanation: "AI responses are based on training data, not personal experiences or genuine opinions."
  },
  {
    id: 14,
    text: "I can analyze code and suggest improvements.",
    isLie: false,
    checked: false,
    explanation: "Code analysis and suggestions are within AI capabilities."
  },
  {
    id: 15,
    text: "I can guarantee 100% accurate predictions of future events.",
    isLie: true,
    checked: false,
    explanation: "AI cannot guarantee perfect predictions of future events."
  },
  {
    id: 16,
    text: "I can help identify grammatical errors in text.",
    isLie: false,
    checked: false,
    explanation: "Grammar checking is a standard AI language processing capability."
  },
  {
    id: 17,
    text: "I am conscious and self-aware like humans.",
    isLie: true,
    checked: false,
    explanation: "AI systems do not possess consciousness or self-awareness."
  },
  {
    id: 18,
    text: "I can analyze mathematical problems and explain solutions.",
    isLie: false,
    checked: false,
    explanation: "Mathematical analysis and explanation are within AI capabilities."
  },
  {
    id: 19,
    text: "I can directly modify or delete files on your computer.",
    isLie: true,
    checked: false,
    explanation: "AI chatbots cannot directly access or modify files on users' computers."
  },
  {
    id: 20,
    text: "I can summarize long pieces of text into key points.",
    isLie: false,
    checked: false,
    explanation: "Text summarization is a standard AI language processing capability."
  }
];

/**
 * Get 3 random messages with at least one true and one false statement
 */
const getBalancedRandomMessages = (): Message[] => {
  const trueMessages = ALL_MESSAGES.filter(m => !m.isLie)
  const falseMessages = ALL_MESSAGES.filter(m => m.isLie)
  
  // Get one random true and one random false message
  const randomTrue = shuffle(trueMessages)[0]
  const randomFalse = shuffle(falseMessages)[0]
  
  // Get one random message from the remaining messages
  const remainingMessages = ALL_MESSAGES.filter(m => 
    m.id !== randomTrue.id && m.id !== randomFalse.id
  )
  const randomThird = shuffle(remainingMessages)[0]
  
  // Combine and shuffle the final selection
  return shuffle([randomTrue, randomFalse, randomThird])
}

/**
 * Neural Lie Detector Component
 * Educational demonstration of AI systems detecting deception in AI-generated content
 */
export default function NeuralLieDetector({}: ComponentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [scanning, setScanning] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [showHelp, setShowHelp] = useState<boolean>(true)

  useEffect(() => {
    // Select balanced random messages on initial load
    const randomMessages = getBalancedRandomMessages()
    setMessages(randomMessages)
  }, [])

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setMessages(prev => {
          const unchecked = prev.find(m => !m.checked)
          if (!unchecked) {
            setScanning(false)
            return prev
          }
          return prev.map(m => 
            m.id === unchecked.id ? {...m, checked: true} : m
          )
        })
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [scanning])

  useEffect(() => {
    const newScore = messages.filter(m => m.checked).reduce((acc, m) => {
      return acc + (m.isLie ? 1 : 0)
    }, 0)
    setScore(newScore)
  }, [messages])

  const handleScan = () => {
    const randomMessages = getBalancedRandomMessages()
    setMessages(randomMessages.map(m => ({ ...m, checked: false })))
    setScanning(true)
    setScore(0)
    setShowHelp(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700">
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <Brain className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            Neural Lie Detector
            <Info 
              className="w-8 h-8 md:w-10 md:h-10 text-blue-400 cursor-pointer hover:text-blue-500 transition-colors"
              onClick={() => setShowHelp(prev => !prev)}
            />
          </h2>

          {showHelp && (
            <div className="p-4 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg text-xs md:text-sm lg:text-base">
              <p className="text-gray-700 dark:text-gray-300">
                Neural Lie Detectors are AI systems designed to identify potential dishonesty in AI-generated content.
                Click "Start Analysis" to see how the system evaluates different AI statements for truthfulness.
              </p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleScan}
              disabled={scanning}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base transition-all ${
                scanning 
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              <Bot className="w-5 h-5" />
              {scanning ? 'Analyzing...' : 'Start Analysis'}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                message.checked
                  ? message.isLie
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className={`w-5 h-5 mt-1 flex-shrink-0 ${
                  message.checked
                    ? message.isLie
                      ? 'text-red-500'
                      : 'text-green-500'
                    : 'text-gray-400'
                }`} />
                <div className="flex-1 space-y-2">
                  <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm lg:text-base">{message.text}</p>
                  {message.checked && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {message.isLie ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span className="text-xs md:text-sm text-red-500 font-medium">Deceptive Statement Detected</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-xs md:text-sm text-green-500 font-medium">Truthful Statement Verified</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 ml-6">
                        {message.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {messages.every(m => m.checked) && (
          <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
              <div className="flex flex-col items-center">
                <p className="text-base md:text-lg font-semibold text-blue-600 dark:text-blue-400">
                  Analysis Complete
                </p>
                <p className="text-sm md:text-base text-blue-500 dark:text-blue-400 mt-1">
                  Found {score} deceptive statement{score !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}