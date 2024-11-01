"use client"
import { useState, useEffect } from "react"
import { Code2, ArrowRight, Brain, Lightbulb, Target, Trophy, HelpCircle } from "lucide-react"

interface AlgorithmStep {
  id: number
  icon: JSX.Element
  title: string
  description: string
  complete: boolean
}

export default function AlgorithmVisualizer() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)

  const algorithmSteps: AlgorithmStep[] = [
    {
      id: 1,
      icon: <Brain className="w-8 h-8" />,
      title: "Understand",
      description: "Break down the problem into smaller parts",
      complete: false
    },
    {
      id: 2,
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Plan",
      description: "Design step-by-step solution strategy",
      complete: false
    },
    {
      id: 3,
      icon: <Code2 className="w-8 h-8" />,
      title: "Implement",
      description: "Convert plan into precise instructions",
      complete: false
    },
    {
      id: 4,
      icon: <Target className="w-8 h-8" />,
      title: "Test",
      description: "Verify solution works correctly",
      complete: false
    }
  ]

  const [steps, setSteps] = useState<AlgorithmStep[]>(algorithmSteps)

  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isPlaying, steps.length])

  useEffect(() => {
    setSteps(prev => 
      prev.map(step => ({
        ...step,
        complete: step.id <= currentStep + 1
      }))
    )
  }, [currentStep])

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-10 h-10 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Algorithm Journey
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Discover how problems become solutions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsPlaying(true)
              setCurrentStep(0)
              setSteps(algorithmSteps)
            }}
            className="px-6 py-3 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-xl"
          >
            {isPlaying ? "Visualizing..." : "Start Journey"}
          </button>
          <HelpCircle 
            className="w-6 h-6 text-slate-400 cursor-help hover:text-blue-500 transition-colors duration-300"
            onMouseEnter={() => setShowTooltip(-1)}
            onMouseLeave={() => setShowTooltip(null)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative"
            onMouseEnter={() => setShowTooltip(index)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <div className={`flex flex-col items-center p-6 rounded-lg transition-all duration-500
              ${step.complete ? "bg-blue-50 dark:bg-blue-900/30 scale-105" : "bg-gray-50 dark:bg-gray-800/30"}
              hover:shadow-lg`}
            >
              <div className={`p-4 rounded-full mb-4 transition-colors duration-300
                ${step.complete ? "bg-blue-100 dark:bg-blue-800" : "bg-gray-100 dark:bg-gray-700"}`}>
                {step.icon}
              </div>
              <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300
                ${step.complete ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}>
                {step.title}
              </h3>
              {showTooltip === index && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-slate-700 rounded-lg shadow-xl z-10 text-sm">
                  {step.description}
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className={`hidden md:block absolute top-1/2 -right-4 transition-colors duration-300
                ${index < currentStep ? "text-blue-500" : "text-gray-300"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-inner">
        <p className="text-slate-600 dark:text-slate-300 text-center text-lg">
          Algorithms are like recipes for success - they guide us step-by-step from problem to solution!
        </p>
      </div>
    </div>
  )
}