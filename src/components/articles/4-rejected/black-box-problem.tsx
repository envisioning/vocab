"use client"
import { useState, useEffect } from "react"
import { Box, Brain, ChefHat, Sandwich, Music, ThumbsUp, ThumbsDown, Search, Lightbulb } from "lucide-react"

interface SandwichOrder {
  bread: string
  cheese: number 
  meat: string
  veggies: string[]
}

interface Hypothesis {
  id: number
  theory: string
  tested: boolean
  correct: boolean
}

interface GameState {
  phase: 'discovery' | 'investigation' | 'reflection'
  sandwichOrders: SandwichOrder[]
  currentHypothesis: Hypothesis[]
  score: number
}

const BREAD_TYPES = ['white', 'wheat', 'rye']
const MEAT_TYPES = ['turkey', 'ham', 'chicken']
const VEGGIE_TYPES = ['lettuce', 'tomato', 'onion', 'cucumber']

const HIDDEN_RULES = {
  extraCheese: (order: SandwichOrder) => 
    order.bread === 'rye' && order.veggies.includes('onion'),
  perfectRating: (order: SandwichOrder) =>
    order.meat === 'turkey' && order.veggies.length >= 3
}

const UnboxAI = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'discovery',
    sandwichOrders: [],
    currentHypothesis: [],
    score: 0
  })

  const [currentOrder, setCurrentOrder] = useState<SandwichOrder>({
    bread: 'white',
    cheese: 1,
    meat: 'turkey', 
    veggies: []
  })

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameState.sandwichOrders.length >= 5) {
        setGameState(prev => ({...prev, phase: 'investigation'}))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState.sandwichOrders])

  const handleOrderSubmit = () => {
    const extraCheese = HIDDEN_RULES.extraCheese(currentOrder)
    const perfectRating = HIDDEN_RULES.perfectRating(currentOrder)
    
    setGameState(prev => ({
      ...prev,
      sandwichOrders: [...prev.sandwichOrders, {
        ...currentOrder,
        cheese: extraCheese ? 2 : 1
      }],
      score: perfectRating ? prev.score + 10 : prev.score
    }))
  }

  const handleHypothesisSubmit = (theory: string) => {
    const hypothesisId = gameState.currentHypothesis.length + 1
    const isCorrect = theory.toLowerCase().includes('rye') && 
                     theory.toLowerCase().includes('onion')

    setGameState(prev => ({
      ...prev,
      currentHypothesis: [...prev.currentHypothesis, {
        id: hypothesisId,
        theory,
        tested: true,
        correct: isCorrect
      }]
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <header className="flex items-center gap-4 mb-8">
        <Box className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">UnboxAI: The Mystery Machine Dilemma</h1>
      </header>

      {gameState.phase === 'discovery' && (
        <section className="space-y-6" role="region" aria-label="Discovery Phase">
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <ChefHat className="w-12 h-12 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold mb-2">The Secret Recipe Vending Machine</h2>
              <p className="text-gray-600">Create sandwiches and observe the AI's mysterious decisions</p>
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleOrderSubmit()
          }} 
          className="space-y-4">
            <select 
              value={currentOrder.bread}
              onChange={(e) => setCurrentOrder(prev => ({
                ...prev, 
                bread: e.target.value
              }))}
              className="block w-full p-2 border rounded"
              aria-label="Select bread type"
            >
              {BREAD_TYPES.map(bread => (
                <option key={bread} value={bread}>{bread}</option>
              ))}
            </select>

            {/* Similar selects for meat and veggies */}

            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Create Sandwich
            </button>
          </form>

          <div className="grid grid-cols-3 gap-4">
            {gameState.sandwichOrders.map((order, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg shadow">
                <Sandwich className="w-8 h-8 mb-2" />
                <p>Cheese: {order.cheese}</p>
                <p>Rating: {HIDDEN_RULES.perfectRating(order) ? '⭐⭐⭐' : '⭐'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar sections for investigation and reflection phases */}
      
    </div>
  )
}

export default UnboxAI