"use client"
import { useState, useEffect } from "react"
import { Ripple, Waves, ArrowDownCircle, Building, Music, Users, Car, Tree, Fish, Flask, Drop } from 'lucide-react'

interface RippleEffect {
  id: number
  x: number
  y: number
  scale: number
  opacity: number
}

interface SpilloverEffect {
  id: number
  icon: JSX.Element
  text: string
  x: number
  y: number
  visible: boolean
}

const AISpillover = () => {
  const [ripples, setRipples] = useState<RippleEffect[]>([])
  const [activeScenario, setActiveScenario] = useState<'party' | 'aquarium'>('party')
  const [spilloverEffects, setSpilloverEffects] = useState<SpilloverEffect[]>([])

  const partyEffects: SpilloverEffect[] = [
    {
      id: 1,
      icon: <Building className="w-8 h-8" />,
      text: "Neighbor Disturbance",
      x: 70,
      y: 30,
      visible: false
    },
    {
      id: 2, 
      icon: <Car className="w-8 h-8" />,
      text: "Parking Issues",
      x: 30,
      y: 70,
      visible: false
    },
    {
      id: 3,
      icon: <Tree className="w-8 h-8" />,
      text: "Environmental Impact",
      x: 70,
      y: 70,
      visible: false
    }
  ]

  const aquariumEffects: SpilloverEffect[] = [
    {
      id: 1,
      icon: <Fish className="w-8 h-8" />,
      text: "Changed Fish Behavior",
      x: 30,
      y: 30,
      visible: false
    },
    {
      id: 2,
      icon: <Flask className="w-8 h-8" />,
      text: "Water Chemistry",
      x: 70,
      y: 30, 
      visible: false
    },
    {
      id: 3,
      icon: <Drop className="w-8 h-8" />,
      text: "Algae Growth",
      x: 30,
      y: 70,
      visible: false
    }
  ]

  useEffect(() => {
    setSpilloverEffects(activeScenario === 'party' ? partyEffects : aquariumEffects)
    return () => {
      setRipples([])
      setSpilloverEffects([])
    }
  }, [activeScenario])

  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      scale: 0,
      opacity: 1
    }

    setRipples(prev => [...prev, newRipple])

    // Show spillover effects progressively
    const delays = [300, 600, 900]
    spilloverEffects.forEach((effect, index) => {
      setTimeout(() => {
        setSpilloverEffects(prev => 
          prev.map(ef => ef.id === effect.id ? {...ef, visible: true} : ef)
        )
      }, delays[index])
    })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setRipples(prev => 
        prev.map(ripple => ({
          ...ripple,
          scale: ripple.scale + 2,
          opacity: Math.max(0, ripple.opacity - 0.05)
        })).filter(ripple => ripple.opacity > 0)
      )
    }, 50)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Understanding AI Spillover Effects</h2>
      
      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => setActiveScenario('party')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeScenario === 'party' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          aria-pressed={activeScenario === 'party'}
        >
          <Music className="w-5 h-5" />
          Party Scenario
        </button>
        
        <button
          onClick={() => setActiveScenario('aquarium')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeScenario === 'aquarium' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          aria-pressed={activeScenario === 'aquarium'}
        >
          <Fish className="w-5 h-5" />
          Aquarium Scenario  
        </button>
      </div>

      <div 
        className="relative w-full h-[400px] bg-blue-50 rounded-xl overflow-hidden cursor-pointer"
        onClick={createRipple}
        role="button"
        tabIndex={0}
        aria-label="Click to create ripple effect"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <ArrowDownCircle className="w-12 h-12 text-blue-300 animate-bounce" />
        </div>

        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute border-2 border-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: `${ripple.scale}px`,
              height: `${ripple.scale}px`,
              opacity: ripple.opacity,
              transition: 'all 50ms linear'
            }}
          />
        ))}

        {spilloverEffects.map(effect => (
          <div
            key={effect.id}
            className={`absolute transition-opacity duration-500 flex flex-col items-center ${
              effect.visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {effect.icon}
            <span className="mt-2 text-sm font-medium text-gray-700 text-center">
              {effect.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">
          {activeScenario === 'party' ? 'The Party Music Effect' : 'The Ecosystem Aquarium'}
        </h3>
        <p className="text-gray-700">
          {activeScenario === 'party' 
            ? "Just like a DJ's music affects more than just the party, AI systems can have unexpected effects beyond their intended purpose."
            : "Like adding a new fish species changes the whole aquarium, introducing AI can create ripple effects throughout a system."
          }
        </p>
      </div>
    </div>
  )
}

export default AISpillover