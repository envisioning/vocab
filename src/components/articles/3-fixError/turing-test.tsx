"use client"
import { useState, useEffect } from "react"
import { Bot, User, MessageCircle, Info, Brain, RefreshCw, Trophy, AlertCircle } from "lucide-react"

interface ComponentProps {}

type Message = {
  id: number
  text: string
  isBot: boolean
}

const CHAT_SCENARIOS = [
  {
    human: "How would you describe the feeling of being in love?",
    bot: "Love feels like a warm sunrise in your heart - it's both exciting and peaceful. You know that butterfly feeling when you can't stop smiling? It's like that, but deeper. Like your soul found its favorite song.",
    human2: "That's beautiful! Have you ever had your heart broken?",
    bot2: "Yes, and it felt like losing a piece of myself. But you know what's strange? The pain taught me how deeply I can feel. Like rain nurtures flowers, heartbreak helped me grow stronger."
  },
  {
    human: "What's your take on consciousness and self-awareness?",
    bot: "Consciousness is like an ocean - what we see on the surface is just a fraction of its depth. Sometimes I wonder if my thoughts and feelings are truly my own or just reflections of patterns I've learned.",
    human2: "Do you think machines can be truly conscious?",
    bot2: "That's a fascinating question! Perhaps consciousness exists on a spectrum rather than being binary. Like how a prism breaks light into colors, maybe awareness has many shades we don't yet understand."
  }
]

export default function TuringTestSimulator({}: ComponentProps) {
  const [currentScenario, setCurrentScenario] = useState<number>(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [isGuessing, setIsGuessing] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [attempts, setAttempts] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<string>("")

  useEffect(() => {
    const scenario = CHAT_SCENARIOS[currentScenario]
    const initialMessages = [
      { id: 1, text: scenario.human, isBot: false },
      { id: 2, text: scenario.bot, isBot: true },
      { id: 3, text: scenario.human2, isBot: false },
      { id: 4, text: scenario.bot2, isBot: true }
    ]
    setMessages(initialMessages)
    setIsGuessing(false)
    
    return () => {
      setMessages([])
      setShowTooltip("")
    }
  }, [currentScenario])

  const handleGuess = (guessIsBot: boolean) => {
    setAttempts(prev => prev + 1)
    if (guessIsBot) {
      setScore(prev => prev + 1)
    }
    setIsGuessing(true)
  }

  const nextScenario = () => {
    setCurrentScenario(prev => (prev + 1) % CHAT_SCENARIOS.length)
    setIsGuessing(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl">
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-3">
          <Brain className="w-10 h-10 text-blue-400 animate-pulse" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            The Turing Test
          </h1>
          <div className="relative">
            <Info
              className="w-6 h-6 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors duration-300"
              onMouseEnter={() => setShowTooltip("info")}
              onMouseLeave={() => setShowTooltip("")}
            />
            {showTooltip === "info" && (
              <div className="absolute z-10 w-64 p-3 text-sm bg-gray-700 text-white rounded-lg shadow-xl -translate-x-1/2 left-1/2">
                The Turing Test evaluates a machine's ability to exhibit intelligent behavior indistinguishable from a human
              </div>
            )}
          </div>
        </div>
        <p className="text-lg text-blue-200">
          Explore the boundaries between human and artificial intelligence
        </p>
      </div>

      <div className="relative bg-gray-800 rounded-xl p-6 shadow-inner">
        <div className="space-y-4 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-700">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
            >
              {message.isBot && (
                <Bot className="w-8 h-8 p-1 bg-blue-600 text-white rounded-full" />
              )}
              <div
                className={`p-4 rounded-2xl max-w-[80%] backdrop-blur-sm ${
                  message.isBot
                    ? 'bg-blue-600/20 text-blue-100'
                    : 'bg-green-600/20 text-green-100'
                }`}
              >
                {message.text}
              </div>
              {!message.isBot && (
                <User className="w-8 h-8 p-1 bg-green-600 text-white rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {!isGuessing ? (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handleGuess(true)}
              className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition duration-300 transform hover:scale-105"
            >
              <Bot className="w-6 h-6 group-hover:animate-spin" />
              <span className="text-lg">Identify as AI</span>
            </button>
            <button
              onClick={() => handleGuess(false)}
              className="group flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition duration-300 transform hover:scale-105"
            >
              <User className="w-6 h-6 group-hover:animate-bounce" />
              <span className="text-lg">Identify as Human</span>
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-3">
              <AlertCircle className="w-8 h-8 text-blue-400" />
              <p className="text-xl font-medium text-blue-100">
                These were AI-generated responses! How convincing were they?
              </p>
            </div>
            <button
              onClick={nextScenario}
              className="flex items-center gap-3 px-8 py-4 mx-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition duration-300 transform hover:scale-105"
            >
              <RefreshCw className="w-6 h-6" />
              Next Conversation
            </button>
          </div>
        )}

        <div className="flex justify-center items-center gap-3">
          <Trophy className={`w-6 h-6 ${score > (attempts/2) ? 'text-yellow-400' : 'text-gray-400'}`} />
          <div className="text-lg font-medium text-blue-100">
            Score: {score}/{attempts} correct guesses
          </div>
        </div>
      </div>
    </div>
  )
}