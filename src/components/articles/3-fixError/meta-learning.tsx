"use client"
import { useState, useEffect } from "react"
import { Brain, Book, Target, Zap, School, Info, ArrowRight, Sparkles } from "lucide-react"

interface ComponentProps {}

type LearningTask = {
  id: number
  name: string
  icon: JSX.Element
  mastered: boolean
  description: string
}

const MetaLearningVisualizer: React.FC<ComponentProps> = () => {
  const [activeTask, setActiveTask] = useState<number>(0)
  const [learningSpeed, setLearningSpeed] = useState<number>(1000)
  const [isLearning, setIsLearning] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  const tasks: LearningTask[] = [
    { 
      id: 1, 
      name: "Pattern Recognition",
      icon: <Book className="w-8 h-8" />,
      mastered: false,
      description: "AI learns to identify recurring patterns in data"
    },
    { 
      id: 2, 
      name: "Adaptation",
      icon: <Target className="w-8 h-8" />,
      mastered: false,
      description: "Quickly adjusts strategies for new challenges"
    },
    { 
      id: 3, 
      name: "Optimization",
      icon: <Zap className="w-8 h-8" />,
      mastered: false,
      description: "Improves learning efficiency over time"
    },
    { 
      id: 4, 
      name: "Transfer Learning",
      icon: <School className="w-8 h-8" />,
      mastered: false,
      description: "Applies previous knowledge to new tasks"
    }
  ]

  const [taskList, setTaskList] = useState<LearningTask[]>(tasks)

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isLearning) {
      interval = setInterval(() => {
        setTaskList(prev => {
          const updated = [...prev]
          updated[activeTask] = {...updated[activeTask], mastered: true}
          return updated
        })
        setActiveTask(prev => (prev + 1) % tasks.length)
        setLearningSpeed(prev => Math.max(prev * 0.7, 200))
      }, learningSpeed)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLearning, learningSpeed, activeTask])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <div className="mb-12 text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8" />
          Meta-Learning Journey
          <Sparkles className="w-8 h-8" />
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Witness AI's fascinating journey of learning to learn. As it masters each skill,
          watch how it accelerates its learning process, just like a human building expertise!
        </p>
      </div>

      <div className="relative w-[32rem] h-[32rem] rounded-full border-4 border-blue-400/30 p-4 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
        <Brain 
          className={`w-32 h-32 absolute center transform transition-all duration-500
            ${isLearning ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`}
        />
        
        {taskList.map((task, index) => {
          const angle = (index * 360) / tasks.length
          const isActive = index === activeTask
          
          return (
            <div
              key={task.id}
              onMouseEnter={() => setShowTooltip(task.id)}
              onMouseLeave={() => setShowTooltip(null)}
              style={{
                transform: `rotate(${angle}deg) translateX(180px) rotate(-${angle}deg)`,
              }}
              className="absolute transition-all duration-500"
            >
              <div className={`relative p-6 rounded-xl backdrop-blur-sm
                ${task.mastered ? 'bg-green-500/90' : 'bg-blue-100 dark:bg-gray-700'}
                ${isActive ? 'scale-125 shadow-xl' : 'scale-100'}
                hover:scale-110 cursor-pointer
              `}>
                {task.icon}
                {showTooltip === task.id && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-48 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl z-10">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{task.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{task.description}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => setIsLearning(!isLearning)}
        className={`mt-12 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2
          ${isLearning 
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
      >
        {isLearning ? 'Pause Learning' : 'Start Learning'}
        <ArrowRight className={`w-5 h-5 ${isLearning ? 'animate-pulse' : ''}`} />
      </button>

      <div className="mt-6 text-lg font-semibold text-blue-600 dark:text-blue-400">
        Learning Acceleration: {Math.round(1000/learningSpeed * 100)/100}x
      </div>
    </div>
  )
}

export default MetaLearningVisualizer