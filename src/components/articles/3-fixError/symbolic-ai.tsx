"use client"
import { useState, useEffect } from "react"
import { Brain, Code2, Puzzle, ArrowRight, Info, Lightbulb, CheckCircle2 } from "lucide-react"

interface SymbolicAIProps {}

type Rule = {
  id: number
  if: string
  then: string
  explanation: string
  isActive: boolean
}

const RULES: Rule[] = [
  {
    id: 1,
    if: "is_round && is_yellow",
    then: "is_sun",
    explanation: "Just like humans recognize the sun by its round shape and yellow color, Symbolic AI uses these basic properties to identify objects.",
    isActive: false
  },
  {
    id: 2,
    if: "has_wings && has_feathers",
    then: "is_bird",
    explanation: "By combining multiple characteristics (wings and feathers), the AI can make logical deductions about what something might be.",
    isActive: false
  },
  {
    id: 3,
    if: "has_fur && barks",
    then: "is_dog",
    explanation: "The AI follows these IF-THEN rules just like a decision tree, making conclusions based on observable features.",
    isActive: false
  }
]

export default function SymbolicAI({}: SymbolicAIProps) {
  const [rules, setRules] = useState<Rule[]>(RULES)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)

  const activateRule = (id: number) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === id ? {...rule, isActive: true} : rule
      )
    )
    setCurrentStep(prev => prev + 1)
  }

  useEffect(() => {
    if (currentStep === rules.length) {
      const timer = setTimeout(() => setShowResult(true), 500)
      return () => clearTimeout(timer)
    }
  }, [currentStep, rules.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-indigo-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Symbolic AI Explorer
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Discover how early AI systems used rule-based reasoning to make decisions, just like following a logical recipe!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {rules.map((rule, index) => (
            <div 
              key={rule.id}
              className={`
                transform transition-all duration-500 relative
                ${index <= currentStep ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                ${rule.isActive ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-white dark:bg-slate-800'}
                rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700
              `}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4 flex-wrap md:flex-nowrap">
                  <Code2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">If</p>
                    <p className="font-mono bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-md">{rule.if}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden md:block" />
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Then</p>
                    <p className="font-mono bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-md">{rule.then}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveTooltip(activeTooltip === rule.id ? null : rule.id)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300"
                  >
                    <Info className="w-5 h-5 text-blue-500" />
                  </button>
                  
                  <button
                    onClick={() => activateRule(rule.id)}
                    disabled={index !== currentStep}
                    className={`
                      p-3 rounded-full transition-all duration-300 flex items-center space-x-2
                      ${index === currentStep ? 
                        'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer' : 
                        'bg-slate-200 dark:bg-slate-700 cursor-not-allowed'}
                    `}
                  >
                    {rule.isActive ? <CheckCircle2 className="w-5 h-5" /> : <Puzzle className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {activeTooltip === rule.id && (
                <div className="mt-4 bg-blue-50 dark:bg-slate-700 p-4 rounded-lg flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">{rule.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {showResult && (
          <div className="text-center animate-fade-in bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
            <Brain className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Congratulations! You've Mastered Symbolic AI!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto">
              You've just experienced how early AI systems worked! They used these simple but powerful IF-THEN rules to make decisions and solve problems, laying the foundation for modern artificial intelligence.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}