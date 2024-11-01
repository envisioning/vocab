"use client"
import { useState, useEffect } from "react"
import { Brain, ArrowRight, Info, Check, X, Zap, CircleDot, HelpCircle, Sparkles } from "lucide-react"

interface DecisionNode {
  id: number
  condition: string
  explanation: string
  yesPath: number
  noPath: number
  isEnd?: boolean
  result?: string
  resultExplanation?: string
}

const DECISION_TREE: DecisionNode[] = [
  {
    id: 0,
    condition: "Should the robot stop?",
    explanation: "The robot's sensors detect an obstacle ahead",
    yesPath: 1,
    noPath: 2
  },
  {
    id: 1,
    condition: "Is the obstacle moving?",
    explanation: "Determining if the obstacle is dynamic or static",
    yesPath: 3,
    noPath: 4
  },
  {
    id: 2,
    condition: "Is path clear ahead?",
    explanation: "Checking if there are any potential obstacles in the planned route",
    yesPath: 5,
    noPath: 6
  },
  {
    id: 3,
    condition: "",
    explanation: "",
    yesPath: -1,
    noPath: -1,
    isEnd: true,
    result: "Wait for obstacle to pass",
    resultExplanation: "The robot waits safely until the moving obstacle clears the path"
  },
  {
    id: 4,
    condition: "",
    explanation: "",
    yesPath: -1,
    noPath: -1,
    isEnd: true,
    result: "Recalculate alternative route",
    resultExplanation: "Finding a new path to avoid the static obstacle"
  },
  {
    id: 5,
    condition: "",
    explanation: "",
    yesPath: -1,
    noPath: -1,
    isEnd: true,
    result: "Continue on current path",
    resultExplanation: "Safe to proceed as planned with current trajectory"
  },
  {
    id: 6,
    condition: "",
    explanation: "",
    yesPath: -1,
    noPath: -1,
    isEnd: true,
    result: "Slow down and scan surroundings",
    resultExplanation: "Cautiously assess the environment for safe navigation"
  }
]

export default function ControlLogicDemo() {
  const [currentNode, setCurrentNode] = useState<number>(0)
  const [path, setPath] = useState<number[]>([0])
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [fadeIn, setFadeIn] = useState<boolean>(false)

  const handleDecision = (isYes: boolean) => {
    const node = DECISION_TREE[currentNode]
    const nextNode = isYes ? node.yesPath : node.noPath
    if (nextNode >= 0) {
      setCurrentNode(nextNode)
      setPath(prev => [...prev, nextNode])
      setFadeIn(true)
    }
  }

  const resetDemo = () => {
    setCurrentNode(0)
    setPath([0])
    setFadeIn(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-blue-500" />
            Robotic Control Logic
            <HelpCircle
              className="w-6 h-6 text-blue-400 cursor-help transition-transform hover:scale-110"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
          </h2>
          
          {showTooltip && (
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg text-sm animate-fade-in">
              Control logic helps robots make smart decisions by following a set of rules and conditions
            </div>
          )}
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 transition-all duration-500 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {DECISION_TREE[currentNode].isEnd ? (
            <div className="text-center space-y-6">
              <div className="text-3xl font-bold text-green-500 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8" />
                {DECISION_TREE[currentNode].result}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {DECISION_TREE[currentNode].resultExplanation}
              </p>
              <button
                onClick={resetDemo}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition duration-300"
              >
                Start New Simulation
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
                  <CircleDot className="w-7 h-7 text-blue-500" />
                  {DECISION_TREE[currentNode].condition}
                </div>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  <Info className="inline w-4 h-4 mr-2" />
                  {DECISION_TREE[currentNode].explanation}
                </p>
              </div>
              
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => handleDecision(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 transition duration-300"
                >
                  <Check className="w-5 h-5" />
                  Yes
                </button>
                <button
                  onClick={() => handleDecision(false)}
                  className="flex items-center gap-2 px-8 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transform hover:scale-105 transition duration-300"
                >
                  <X className="w-5 h-5" />
                  No
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex flex-wrap gap-3 justify-center">
              {path.map((nodeId, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md">
                    {nodeId}
                  </div>
                  {index < path.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-blue-400 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}