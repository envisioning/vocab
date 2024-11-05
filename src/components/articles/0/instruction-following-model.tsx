"use client"
import { useState, useEffect } from "react"
import { Bot, ArrowRight, Sparkles, Brain, MessageSquare, Command, Lightbulb, Zap } from "lucide-react"

interface ComponentProps {}

type Instruction = {
  command: string
  icon: JSX.Element
  animation: string
  result: string
  explanation: string
}

const INSTRUCTIONS: Instruction[] = [
  {
    command: "Analyze Image",
    icon: <Lightbulb className="h-4 w-4 sm:w-5 sm:h-5" />,
    animation: "analyze",
    result: "Detected: 2 people, sunny day, beach setting ⛱️",
    explanation: "AI processes visual data by breaking down images into patterns and features"
  },
  {
    command: "Generate Response",
    icon: <MessageSquare className="h-4 w-4 sm:w-5 sm:h-5" />,
    animation: "think",
    result: "Q: What's the capital of France?<br />A: Paris 🗼",
    explanation: "AI accesses its knowledge base to provide accurate information"
  },
  {
    command: "Execute Task",
    icon: <Command className="h-4 w-4 sm:w-5 sm:h-5" />,
    animation: "process",
    result: "Task completed: Scheduled meeting for 3 PM 📅",
    explanation: "AI follows specific steps to complete requested actions"
  },
  {
    command: "Learn Pattern",
    icon: <Zap className="h-4 w-4 sm:w-5 sm:h-5" />,
    animation: "learn",
    result: "Pattern identified: Weekly activity spike on Mondays 📊",
    explanation: "AI adapts by recognizing and learning from data patterns"
  }
]

/**
 * An interactive component demonstrating AI instruction following capabilities
 * with responsive design for various screen sizes
 */
export default function InstructionFollower({}: ComponentProps) {
  const [currentInstruction, setCurrentInstruction] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showResult, setShowResult] = useState<boolean>(false)

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setShowResult(true)
        setIsAnimating(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  const handleInstructionClick = (index: number) => {
    setCurrentInstruction(index)
    setIsAnimating(true)
    setShowResult(false)
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        <header className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 md:mb-4 flex items-center justify-center gap-2 sm:gap-3">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-500" />
            Instruction Following AI
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore how AI systems process and execute different types of instructions
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Select an instruction:
            </h3>
            
            {INSTRUCTIONS.map((instruction, index) => (
              <button
                key={instruction.command}
                onClick={() => handleInstructionClick(index)}
                className={`w-full p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center gap-3 sm:gap-4
                  ${currentInstruction === index 
                    ? 'bg-blue-500 text-white shadow-lg scale-102 transform' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700'
                  }`}
              >
                {instruction.icon}
                <div className="flex-1 text-left">
                  <span className="text-sm sm:text-base md:text-lg font-medium">{instruction.command}</span>
                </div>
                <ArrowRight className="h-4 w-4 sm:w-5 sm:h-5" />
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden border-2 border-blue-100 dark:border-blue-900">
            <Bot 
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-blue-500 transition-all duration-500 ${
                isAnimating ? 'animate-bounce scale-110' : 'transform hover:scale-105'
              }`}
            />

            {showResult && (
              <div className="mt-4 sm:mt-6 md:mt-8 text-center animate-fade-in space-y-2 sm:space-y-3 md:space-y-4">
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl font-medium text-gray-700 dark:text-gray-200">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  <span dangerouslySetInnerHTML={{ __html: INSTRUCTIONS[currentInstruction].result }} />
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md px-2">
                  {INSTRUCTIONS[currentInstruction].explanation}
                </p>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500 absolute top-4 sm:top-5 md:top-6 right-4 sm:right-5 md:right-6 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        <footer className="mt-6 sm:mt-8 md:mt-10 text-center">
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 italic">
            Understanding how AI processes instructions helps us better interact with and utilize these systems.
          </p>
        </footer>
      </div>
    </div>
  )
}