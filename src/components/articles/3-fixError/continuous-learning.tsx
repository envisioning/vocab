"use client"
import { useState, useEffect } from "react"
import { Brain, Book, Zap, ArrowRight, School, Info, RefreshCw } from "lucide-react"

interface ComponentProps {}

type KnowledgeItem = {
  id: number
  icon: JSX.Element
  label: string
  description: string
  learned: boolean
}

const ContinuousLearningDemo = ({}: ComponentProps) => {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([
    { 
      id: 1, 
      icon: <Book className="w-6 h-6" />, 
      label: "Basic Math", 
      description: "Foundation of numerical operations and logic",
      learned: false 
    },
    { 
      id: 2, 
      icon: <School className="w-6 h-6" />, 
      label: "Statistics", 
      description: "Understanding data patterns and probability",
      learned: false 
    },
    { 
      id: 3, 
      icon: <Zap className="w-6 h-6" />, 
      label: "Machine Learning", 
      description: "Algorithms that improve with experience",
      learned: false 
    },
    { 
      id: 4, 
      icon: <Brain className="w-6 h-6" />, 
      label: "Neural Networks", 
      description: "Complex pattern recognition systems",
      learned: false 
    }
  ])

  const [isLearning, setIsLearning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  useEffect(() => {
    if (isLearning && currentIndex < knowledge.length) {
      const timer = setTimeout(() => {
        setKnowledge(prev => prev.map((item, idx) => 
          idx === currentIndex ? {...item, learned: true} : item
        ))
        setCurrentIndex(prev => prev + 1)
      }, 1500)

      return () => clearTimeout(timer)
    } else if (currentIndex >= knowledge.length) {
      setIsLearning(false)
      setCurrentIndex(0)
    }
  }, [isLearning, currentIndex])

  const handleStartLearning = () => {
    setKnowledge(prev => prev.map(item => ({...item, learned: false})))
    setIsLearning(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Continuous Learning in AI
        </h2>
      </div>

      <div className="relative w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl backdrop-blur-sm bg-opacity-90">
        <div className="flex flex-col space-y-4">
          {knowledge.map((item) => (
            <div 
              key={item.id}
              className={`relative flex items-center p-4 rounded-lg transition-all duration-500 transform hover:scale-102
                ${item.learned 
                  ? 'bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 translate-x-4' 
                  : 'bg-gray-100 dark:bg-gray-700'
                }
              `}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`transition-colors duration-300
                ${item.learned ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}
              `}>
                {item.icon}
              </div>
              <span className="ml-4 font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              {hoveredId === item.id && (
                <div className="absolute left-0 -top-12 w-full p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg z-10">
                  {item.description}
                </div>
              )}
              {item.learned && (
                <ArrowRight className="ml-auto w-5 h-5 text-blue-500 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleStartLearning}
            disabled={isLearning}
            className={`group flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300
              ${isLearning 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
              }
            `}
          >
            <RefreshCw className={`w-5 h-5 ${isLearning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            {isLearning ? 'Learning in Progress...' : 'Start Learning Process'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-6 text-sm text-center text-gray-600 dark:text-gray-400 max-w-md">
        <Info className="w-4 h-4" />
        <p>
          Watch as the AI system builds its knowledge base step by step,
          demonstrating the power of continuous learning.
        </p>
      </div>
    </div>
  )
}

export default ContinuousLearningDemo