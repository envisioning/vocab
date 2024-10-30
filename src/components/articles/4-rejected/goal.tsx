'use client'
import { useState, useEffect } from 'react'
import { Target, Brain, ArrowRight, Lightbulb, Trophy, GitCommit, Sparkles, AlertCircle } from 'lucide-react'

interface SubGoal {
  id: number
  name: string
  completed: boolean
  position: { x: number; y: number }
  requires: number[]
}

interface Agent {
  id: number
  position: { x: number; y: number }
  targetId: number | null
  success: number
  color: string
}

const SUB_GOALS: SubGoal[] = [
  { id: 1, name: 'Analyze Environment', completed: false, position: { x: 20, y: 30 }, requires: [] },
  { id: 2, name: 'Identify Patterns', completed: false, position: { x: 50, y: 30 }, requires: [1] },
  { id: 3, name: 'Generate Strategy', completed: false, position: { x: 80, y: 30 }, requires: [2] },
  { id: 4, name: 'Gather Resources', completed: false, position: { x: 20, y: 70 }, requires: [1] },
  { id: 5, name: 'Optimize Path', completed: false, position: { x: 50, y: 70 }, requires: [2, 4] },
  { id: 6, name: 'Execute Plan', completed: false, position: { x: 80, y: 70 }, requires: [3, 5] }
]

const INITIAL_AGENTS: Agent[] = [
  { id: 1, position: { x: 10, y: 30 }, targetId: 1, success: 0, color: 'bg-blue-500' },
  { id: 2, position: { x: 10, y: 70 }, targetId: 4, success: 0, color: 'bg-purple-500' }
]

const AIGoalSystem: React.FC = () => {
  const [subGoals, setSubGoals] = useState<SubGoal[]>(SUB_GOALS)
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<number>(0)
  const [showInsights, setShowInsights] = useState(false)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isRunning) {
      intervalId = setInterval(() => {
        setAgents(prevAgents => {
          return prevAgents.map(agent => {
            if (!agent.targetId) return agent
            
            const target = subGoals.find(g => g.id === agent.targetId)
            if (!target) return agent

            const dx = target.position.x - agent.position.x
            const dy = target.position.y - agent.position.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 2) {
              const nextGoalId = getNextGoal(agent.targetId, subGoals)
              return {
                ...agent,
                targetId: nextGoalId,
                success: agent.success + 1
              }
            }

            return {
              ...agent,
              position: {
                x: agent.position.x + (dx / distance) * 2,
                y: agent.position.y + (dy / distance) * 2
              }
            }
          })
        })

        setSubGoals(prev => {
          const newGoals = [...prev]
          agents.forEach(agent => {
            if (agent.targetId) {
              const targetIndex = newGoals.findIndex(g => g.id === agent.targetId)
              if (targetIndex !== -1) {
                const canComplete = newGoals[targetIndex].requires.every(reqId => 
                  newGoals.find(g => g.id === reqId)?.completed
                )
                if (canComplete) {
                  newGoals[targetIndex].completed = true
                }
              }
            }
          })
          return newGoals
        })

        setCurrentPhase(prev => {
          const completedCount = subGoals.filter(g => g.completed).length
          return Math.floor((completedCount / subGoals.length) * 3)
        })

        if (subGoals.every(g => g.completed)) {
          setIsRunning(false)
          setShowInsights(true)
        }
      }, 50)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isRunning, subGoals])

  const getNextGoal = (currentId: number, goals: SubGoal[]): number | null => {
    const available = goals
      .filter(g => !g.completed && g.requires.every(reqId => 
        goals.find(sg => sg.id === reqId)?.completed
      ))
      .sort((a, b) => a.id - b.id)
    
    return available[0]?.id || null
  }

  const handleStart = () => {
    setIsRunning(true)
    setShowInsights(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setShowInsights(false)
    setCurrentPhase(0)
    setSubGoals(SUB_GOALS.map(g => ({ ...g, completed: false })))
    setAgents(INITIAL_AGENTS)
  }

  const renderPhaseIndicator = () => {
    const phases = ['Planning', 'Execution', 'Optimization', 'Complete']
    return (
      <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          {phases.map((phase, idx) => (
            <div key={phase} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${idx <= currentPhase ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="ml-1 text-sm text-gray-600">{phase}</span>
              {idx < phases.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400 mx-1" />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Brain className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">AI Goal Hierarchy System</h2>
        </div>
        <p className="text-gray-600">Watch AI agents decompose and achieve complex goals through collaboration</p>
      </div>

      <div className="relative h-96 mb-6 border-2 border-gray-100 rounded-lg overflow-hidden bg-gray-50">
        {renderPhaseIndicator()}

        {/* Dependency Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {subGoals.map(goal => 
            goal.requires.map(reqId => {
              const reqGoal = subGoals.find(g => g.id === reqId)
              if (!reqGoal) return null
              return (
                <line
                  key={`${goal.id}-${reqId}`}
                  x1={`${reqGoal.position.x}%`}
                  y1={`${reqGoal.position.y}%`}
                  x2={`${goal.position.x}%`}
                  y2={`${goal.position.y}%`}
                  stroke={goal.completed ? '#22C55E' : '#E5E7EB'}
                  strokeWidth="0.5"
                  strokeDasharray="2"
                />
              )
            })
          )}
        </svg>

        {/* Sub-Goals */}
        {subGoals.map(goal => (
          <div
            key={goal.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-lg 
              ${goal.completed ? 'bg-green-100 border-green-500' : 'bg-white border-gray-200'} 
              border-2 transition-colors duration-300`}
            style={{ left: `${goal.position.x}%`, top: `${goal.position.y}%` }}
          >
            <div className="flex items-center space-x-2">
              <GitCommit className={`w-4 h-4 ${goal.completed ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">{goal.name}</span>
            </div>
          </div>
        ))}

        {/* Agents */}
        {agents.map(agent => (
          <div
            key={agent.id}
            className={`absolute w-4 h-4 ${agent.color} rounded-full transition-all duration-50 transform -translate-x-1/2 -translate-y-1/2`}
            style={{ left: `${agent.position.x}%`, top: `${agent.position.y}%` }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs">
              {agent.success}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors duration-300 flex items-center"
        >
          <Brain className="w-4 h-4 mr-2" />
          Start Simulation
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Reset
        </button>
      </div>

      {/* Insights Panel */}
      {showInsights && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            Goal Achievement Insights
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <Trophy className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
              Goals are broken down into manageable sub-tasks
            </li>
            <li className="flex items-start">
              <GitCommit className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
              Dependencies ensure logical progression
            </li>
            <li className="flex items-start">
              <Sparkles className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
              Multiple agents collaborate to achieve the overall goal
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default AIGoalSystem