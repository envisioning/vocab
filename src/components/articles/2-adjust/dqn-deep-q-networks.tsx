'use client'
import { useState, useEffect } from 'react'
import { Dog, Bone, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Zap, Brain, RotateCcw } from 'lucide-react'

interface State {
  position: [number, number]
  reward: number
  episodes: number
  currentPhase: number
  isLearning: boolean
  actionHistory: string[]
  rewardHistory: number[]
}

interface Environment {
  treats: [number, number][]
  obstacles: [number, number][]
}

const GRID_SIZE = 5
const PHASES = [
  { treats: [[4, 4]], obstacles: [] },
  { treats: [[4, 4]], obstacles: [[2, 2], [2, 3]] },
  { treats: [[4, 4], [0, 4]], obstacles: [[2, 2], [2, 3], [3, 1]] }
]

const DQNPetLearning = () => {
  const [state, setState] = useState<State>({
    position: [0, 0],
    reward: 0,
    episodes: 0,
    currentPhase: 0,
    isLearning: false,
    actionHistory: [],
    rewardHistory: []
  })

  useEffect(() => {
    if (state.isLearning) {
      const interval = setInterval(() => {
        moveAgent()
      }, 800)
      return () => clearInterval(interval)
    }
  }, [state.isLearning, state.position])

  const moveAgent = () => {
    const actions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    const currentEnv = PHASES[state.currentPhase]
    
    const newPos: [number, number] = [...state.position]
    const randomAction = actions[Math.floor(Math.random() * actions.length)]
    newPos[0] += randomAction[0]
    newPos[1] += randomAction[1]

    if (
      newPos[0] >= 0 && newPos[0] < GRID_SIZE &&
      newPos[1] >= 0 && newPos[1] < GRID_SIZE &&
      !currentEnv.obstacles.some(obs => obs[0] === newPos[0] && obs[1] === newPos[1])
    ) {
      const foundTreat = currentEnv.treats.some(
        treat => treat[0] === newPos[0] && treat[1] === newPos[1]
      )

      setState(prev => ({
        ...prev,
        position: newPos,
        reward: prev.reward + (foundTreat ? 10 : -1),
        actionHistory: [...prev.actionHistory, `${randomAction[0]},${randomAction[1]}`],
        rewardHistory: [...prev.rewardHistory, foundTreat ? 10 : -1]
      }))

      if (foundTreat) {
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            episodes: prev.episodes + 1,
            position: [0, 0],
            isLearning: prev.episodes < 2
          }))
        }, 500)
      }
    }
  }

  const handlePhaseChange = () => {
    setState(prev => ({
      ...prev,
      currentPhase: (prev.currentPhase + 1) % PHASES.length,
      position: [0, 0],
      reward: 0,
      episodes: 0,
      actionHistory: [],
      rewardHistory: []
    }))
  }

  const resetSimulation = () => {
    setState({
      position: [0, 0],
      reward: 0,
      episodes: 0,
      currentPhase: state.currentPhase,
      isLearning: false,
      actionHistory: [],
      rewardHistory: []
    })
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="text-blue-500" />
          <h2 className="text-xl font-bold">Smart Pet Training</h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setState(prev => ({ ...prev, isLearning: !prev.isLearning }))}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            aria-label={state.isLearning ? "Pause Learning" : "Start Learning"}
          >
            <Zap size={20} />
            {state.isLearning ? 'Pause' : 'Learn'}
          </button>
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
            aria-label="Reset Simulation"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="relative w-96 h-96 bg-gray-100 rounded-lg">
          {Array.from({ length: GRID_SIZE }).map((_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: GRID_SIZE }).map((_, col) => {
                const isTreat = PHASES[state.currentPhase].treats.some(
                  t => t[0] === row && t[1] === col
                )
                const isObstacle = PHASES[state.currentPhase].obstacles.some(
                  o => o[0] === row && o[1] === col
                )
                const isAgent = state.position[0] === row && state.position[1] === col

                return (
                  <div
                    key={`${row}-${col}`}
                    className={`w-1/5 h-20 border border-gray-200 flex items-center justify-center ${
                      isObstacle ? 'bg-gray-400' : ''
                    }`}
                    role="gridcell"
                    aria-label={`Cell ${row},${col} ${isTreat ? 'contains treat' : ''} ${
                      isObstacle ? 'contains obstacle' : ''
                    }`}
                  >
                    {isAgent && <Dog className="text-blue-500 animate-bounce" />}
                    {isTreat && <Bone className="text-green-500" />}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <p className="text-lg font-semibold">Episode: {state.episodes + 1}</p>
            <p className="text-lg">Total Reward: {state.reward}</p>
          </div>

          <div className="h-40 bg-gray-50 p-4 rounded-lg overflow-y-auto">
            <h3 className="font-semibold mb-2">Recent Actions</h3>
            <div className="flex flex-wrap gap-2">
              {state.actionHistory.slice(-10).map((action, idx) => {
                const [dx, dy] = action.split(',').map(Number)
                const ArrowIcon = 
                  dx === 1 ? ArrowDown :
                  dx === -1 ? ArrowUp :
                  dy === 1 ? ArrowRight :
                  ArrowLeft

                return (
                  <div
                    key={idx}
                    className="p-2 bg-white rounded-lg shadow-sm"
                    role="listitem"
                  >
                    <ArrowIcon
                      size={16}
                      className={state.rewardHistory[idx] > 0 ? 'text-green-500' : 'text-gray-400'}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={handlePhaseChange}
            className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            aria-label="Change Environment"
          >
            Next Environment
          </button>
        </div>
      </div>
    </div>
  )
}

export default DQNPetLearning