"use client"
import { useState, useEffect } from "react"
import { Target, CheckCircle2, Brain, ArrowRight, RefreshCw, Info } from "lucide-react"

interface GoalDemoProps {}

interface Robot {
  x: number
  y: number
  hasReachedGoal: boolean
}

const MAZE_SIZE = 8
const GOAL_POSITION = { x: 7, y: 7 }

const LEARNING_STAGES = [
  "Analyzing path...",
  "Calculating distance...",
  "Optimizing route...",
  "Learning from feedback..."
]

export default function GoalDemo({}: GoalDemoProps) {
  const [robot, setRobot] = useState<Robot>({ x: 0, y: 0, hasReachedGoal: false })
  const [isMoving, setIsMoving] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [currentStage, setCurrentStage] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (isMoving) {
      const stageInterval = setInterval(() => {
        setCurrentStage(prev => (prev + 1) % LEARNING_STAGES.length)
      }, 1000)

      const moveInterval = setInterval(() => {
        setRobot((prev) => {
          const newX = prev.x < GOAL_POSITION.x ? prev.x + 1 : prev.x
          const newY = prev.y < GOAL_POSITION.y ? prev.y + 1 : prev.y
          const hasReached = newX === GOAL_POSITION.x && newY === GOAL_POSITION.y

          if (hasReached) {
            setIsMoving(false)
          }

          return {
            x: newX,
            y: newY,
            hasReachedGoal: hasReached,
          }
        })
      }, 500)

      return () => {
        clearInterval(moveInterval)
        clearInterval(stageInterval)
      }
    }
  }, [isMoving])

  const handleStart = () => {
    setAttempts((prev) => prev + 1)
    setIsMoving(true)
    setRobot({ x: 0, y: 0, hasReachedGoal: false })
    setCurrentStage(0)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="relative">
        <h1 className="text-4xl font-bold mb-2 text-blue-600 flex items-center gap-3">
          <Brain className="w-8 h-8" />
          AI Goal Learning
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-blue-400 hover:text-blue-600 transition-colors duration-300"
          >
            <Info className="w-5 h-5" />
          </button>
        </h1>
        {showTooltip && (
          <div className="absolute top-12 right-0 bg-white p-4 rounded-lg shadow-xl text-sm w-64 text-gray-600 border border-blue-100 z-10">
            AI systems are designed with specific goals in mind. Watch how this AI learns to reach its target efficiently!
          </div>
        )}
      </div>

      <div className="relative w-[500px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 border-4 border-blue-100">
        <div className="absolute grid grid-cols-8 grid-rows-8 w-full h-full bg-gradient-to-br from-blue-50/30 to-purple-50/30">
          {Array.from({ length: MAZE_SIZE * MAZE_SIZE }).map((_, idx) => (
            <div key={idx} className="border border-blue-100/50" />
          ))}
        </div>

        <div
          className={`absolute transition-all duration-500 transform w-16 h-16 flex items-center justify-center
            ${robot.hasReachedGoal ? 'bg-green-100' : 'bg-blue-100'} rounded-full shadow-lg`}
          style={{
            left: `${(robot.x / MAZE_SIZE) * 100}%`,
            top: `${(robot.y / MAZE_SIZE) * 100}%`,
          }}
        >
          {robot.hasReachedGoal ? (
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          ) : (
            <Target className="w-10 h-10 text-blue-500 animate-pulse" />
          )}
        </div>

        <div className="absolute right-0 bottom-0 w-16 h-16 bg-green-100 flex items-center justify-center rounded-tl-2xl shadow-lg">
          <Target className="w-10 h-10 text-green-500" />
        </div>
      </div>

      <div className="text-lg font-semibold text-blue-600 mb-4">
        {isMoving && LEARNING_STAGES[currentStage]}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleStart}
          className="flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {isMoving ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
          {robot.hasReachedGoal ? "Try Again" : "Start Learning"}
        </button>
        
        <p className="text-gray-600 text-lg">
          Learning Iterations: {attempts} 
          {attempts > 3 && " - Persistence leads to mastery! 🌟"}
        </p>
      </div>

      <div className="mt-8 max-w-lg text-center text-gray-600 bg-white p-6 rounded-xl shadow-lg">
        <p className="text-lg">
          Just as this AI learns to reach its target, real AI systems are programmed
          to achieve specific goals through continuous learning and optimization.
          From mastering games to helping in healthcare, every AI has its own mission! 🎯🤖
        </p>
      </div>
    </div>
  )
}