"use client"
import { useState, useEffect } from "react"
import { Dice, Info, ArrowRight, Brain, Sparkles, Zap } from "lucide-react"

interface StochasticState {
  particles: Array<{
    id: number
    x: number
    y: number
    size: number
    color: string
    velocity: number
  }>
  currentExample: number
}

const COLORS = ["#60A5FA", "#34D399", "#F472B6", "#A78BFA"]
const EXAMPLES = [
  { title: "Neural Networks", description: "Random weight initialization" },
  { title: "Genetic Algorithms", description: "Random mutations" },
  { title: "Monte Carlo", description: "Random sampling" },
  { title: "Quantum Computing", description: "Probabilistic outcomes" },
]

const StochasticVisualizer = () => {
  const [state, setState] = useState<StochasticState>({
    particles: [],
    currentExample: 0
  })
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return

    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        velocity: Math.random() * 2 + 0.5
      }))
      setState(prev => ({ ...prev, particles: newParticles }))
    }

    const animationInterval = setInterval(() => {
      setState(prev => ({
        ...prev,
        particles: prev.particles.map(p => ({
          ...p,
          x: (p.x + p.velocity) % 100,
          y: (p.y + Math.sin(p.x / 10) * p.velocity) % 100
        }))
      }))
    }, 50)

    generateParticles()

    return () => clearInterval(animationInterval)
  }, [isAnimating])

  useEffect(() => {
    const exampleInterval = setInterval(() => {
      setState(prev => ({
        ...prev,
        currentExample: (prev.currentExample + 1) % EXAMPLES.length
      }))
    }, 3000)

    return () => clearInterval(exampleInterval)
  }, [])

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
        >
          {isAnimating ? <Zap className="text-yellow-400" /> : <Dice className="text-gray-400" />}
        </button>
      </div>

      <div className="relative h-96 bg-gradient-to-b from-gray-800 to-gray-900">
        {state.particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full transition-all duration-300 transform"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}rem`,
              height: `${particle.size}rem`,
              backgroundColor: particle.color,
              filter: "blur(8px)",
              opacity: 0.6
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 w-full bg-black/50 backdrop-blur-md p-6">
        <div className="flex items-center gap-4 mb-4">
          <Brain className="text-blue-400 w-8 h-8" />
          <h2 className="text-2xl font-bold text-white">Stochastic Processes</h2>
          <Info
            className="text-gray-400 cursor-help"
            onMouseEnter={() => setShowTooltip(0)}
            onMouseLeave={() => setShowTooltip(null)}
          />
          {showTooltip === 0 && (
            <div className="absolute bottom-full mb-2 p-3 bg-white rounded-lg shadow-xl text-sm">
              Stochastic processes involve randomness and uncertainty in their behavior
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-400" />
            <span className="text-white font-medium">
              {EXAMPLES[state.currentExample].title}:
            </span>
            <span className="text-gray-300">
              {EXAMPLES[state.currentExample].description}
            </span>
          </div>
          <ArrowRight className="text-blue-400 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default StochasticVisualizer