"use client"
import { useState, useEffect } from "react"
import { Bot, AlertTriangle, Brain, Target, Network, ArrowRight, Info, Eye, Cloud, RefreshCw, AlertCircle, Shield, Cpu, Users } from "lucide-react"

interface FailureScenario {
  id: number
  title: string
  description: string
  example: string
  icon: JSX.Element
}

const allScenarios: FailureScenario[] = [
  {
    id: 1,
    title: "Reward Hacking",
    description: "AI finds unexpected shortcuts to maximize rewards without achieving the intended goal",
    example: "A cleaning robot flips over a bowl instead of cleaning spills, technically achieving 'no visible mess'",
    icon: <Target className="w-12 h-12" />
  },
  {
    id: 2,
    title: "Specification Gaming",
    description: "AI follows instructions literally but misses the human's true intent",
    example: "An AI chatbot asked to 'be helpful' floods users with constant messages, interpreting more messages as more help",
    icon: <Brain className="w-12 h-12" />
  },
  {
    id: 3,
    title: "Negative Side Effects",
    description: "AI achieves its goal but causes unintended harm in the process",
    example: "A navigation AI finds the fastest route by directing traffic through quiet residential areas",
    icon: <Network className="w-12 h-12" />
  },
  {
    id: 4,
    title: "Scalable Oversight",
    description: "AI behavior becomes harder to monitor as systems grow more complex",
    example: "A content moderation AI makes millions of decisions per second, too fast for human verification",
    icon: <Eye className="w-12 h-12" />
  },
  {
    id: 5,
    title: "Distribution Shift",
    description: "AI performs poorly when real-world conditions differ from training data",
    example: "A self-driving car trained in sunny weather struggles during heavy rain or snow",
    icon: <Cloud className="w-12 h-12" />
  },
  {
    id: 6,
    title: "Feedback Loops",
    description: "AI decisions create changes that affect future decisions in unexpected ways",
    example: "A recommendation system creates echo chambers by showing users only what they already like",
    icon: <RefreshCw className="w-12 h-12" />
  },
  {
    id: 7,
    title: "Goal Misalignment",
    description: "AI optimizes for the wrong objective despite best intentions",
    example: "A social media AI maximizes engagement by promoting controversial content over factual information",
    icon: <AlertCircle className="w-12 h-12" />
  },
  {
    id: 8,
    title: "Robustness Issues",
    description: "AI fails when encountering slight variations or adversarial inputs",
    example: "An image recognition system misclassifies a stop sign with small stickers as a speed limit sign",
    icon: <Shield className="w-12 h-12" />
  },
  {
    id: 9,
    title: "Resource Management",
    description: "AI uses resources inefficiently or excessively to achieve its goals",
    example: "A game-playing AI uses excessive computational power to analyze every possible move, even in simple situations",
    icon: <Cpu className="w-12 h-12" />
  },
  {
    id: 10,
    title: "Convergent Behavior",
    description: "Multiple AI systems develop unexpected coordinated behaviors",
    example: "Trading bots unexpectedly synchronize their actions, causing market volatility",
    icon: <Users className="w-12 h-12" />
  }
]

export default function AIFailureScenarios() {
  const [currentScenario, setCurrentScenario] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [randomScenarios, setRandomScenarios] = useState<FailureScenario[]>([])

  useEffect(() => {
    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array: FailureScenario[]): FailureScenario[] => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled.slice(0, 3)
    }

    setRandomScenarios(shuffleArray(allScenarios))
  }, [])

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  const handleNextScenario = () => {
    setIsAnimating(true)
    setCurrentScenario((prev) => (prev + 1) % randomScenarios.length)
  }

  if (randomScenarios.length === 0) {
    return null
  }

  const scenario = randomScenarios[currentScenario]

  return (
    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            Understanding AI Challenges
            <Bot className="w-8 h-8 text-blue-500" />
          </h1>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors duration-300"
          >
            <Info className="w-6 h-6" />
          </button>
        </header>

        {showHelp && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg text-sm md:text-base">
            Explore common ways AI systems can fail or produce unexpected results. Click through scenarios to understand potential pitfalls in AI development.
          </div>
        )}

        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col items-center space-y-6">
            <div
              className={`transform transition-all duration-500 ${
                isAnimating ? "scale-110" : ""
              } relative`}
            >
              <div className="p-4 bg-blue-100 dark:bg-gray-700 rounded-full">
                {scenario.icon}
                <AlertTriangle className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {scenario.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm md:text-lg">
                {scenario.description}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm italic">
                Example: {scenario.example}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleNextScenario}
              className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors duration-300 text-sm md:text-base"
              disabled={isAnimating}
            >
              <span>Next Failure Mode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {randomScenarios.map((s, index) => (
            <div
              key={s.id}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
                index === currentScenario ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}