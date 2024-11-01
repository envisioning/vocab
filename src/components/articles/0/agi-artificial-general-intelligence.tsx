"use client"
import { useState, useEffect } from "react"
import { Brain, Book, Code, Palette, Music, Calculator, Globe, Zap, Info } from "lucide-react"

interface AGISkill {
  icon: JSX.Element
  name: string
  mastery: number
  description: string
}

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
}

export default function AGIExplorer() {
  const [selectedSkill, setSelectedSkill] = useState<number>(0)
  const [isLearning, setIsLearning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [stars, setStars] = useState<Star[]>([])

  const skills: AGISkill[] = [
    { 
      icon: <Code className="w-6 h-6 sm:w-8 sm:h-8" />, 
      name: "Programming", 
      mastery: 98,
      description: "Instant mastery of any programming language and complex system design"
    },
    { 
      icon: <Palette className="w-6 h-6 sm:w-8 sm:h-8" />, 
      name: "Creative Arts", 
      mastery: 95,
      description: "Generation of stunning artwork across all mediums and styles"
    },
    { 
      icon: <Music className="w-6 h-6 sm:w-8 sm:h-8" />, 
      name: "Music", 
      mastery: 92,
      description: "Composition and performance of complex musical pieces in any genre"
    },
    { 
      icon: <Calculator className="w-6 h-6 sm:w-8 sm:h-8" />, 
      name: "Mathematics", 
      mastery: 99,
      description: "Advanced problem-solving and theoretical mathematics capabilities"
    },
    { 
      icon: <Book className="w-6 h-6 sm:w-8 sm:h-8" />, 
      name: "Literature", 
      mastery: 94,
      description: "Understanding and creation of sophisticated written works"
    },
    { 
      icon: <Globe className="w-6 h-6 sm:w-8 sm:h-8" />, 
      name: "Languages", 
      mastery: 97,
      description: "Fluent communication in all human languages and translation"
    }
  ]

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = []
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 0.2 + 0.1,
          opacity: Math.random() * 0.5 + 0.2
        })
      }
      setStars(newStars)
    }

    generateStars()

    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isLearning) {
      const timeout = setTimeout(() => setIsLearning(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [isLearning])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4 sm:p-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}rem`,
              height: `${star.size}rem`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent leading-relaxed sm:leading-relaxed pb-1">
          Artificial General Intelligence
        </h1>
        <p className="text-sm sm:text-lg text-blue-200 max-w-2xl mx-auto px-4">
          Explore how AGI masters multiple domains simultaneously, achieving human-level or superior performance across diverse fields
        </p>
      </div>
      
      <div className="relative w-[280px] h-[280px] sm:w-[32rem] sm:h-[32rem] bg-gradient-to-r from-transparent via-blue-900/10 to-transparent rounded-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Brain 
              className={`w-16 h-16 sm:w-40 sm:h-40 text-blue-400 transition-all duration-500 ${
                isLearning ? 'scale-110 text-green-400 animate-pulse' : ''
              }`}
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <div className="absolute inset-0 bg-blue-500/20 blur-lg sm:blur-xl rounded-full animate-pulse" />
          </div>
          {showTooltip !== null && (
            <div className="absolute w-48 sm:w-64 bg-gray-900/95 text-xs sm:text-sm rounded-lg p-3 sm:p-4 
              shadow-xl border border-blue-500/30 z-50 backdrop-blur-sm">
              <p className="font-semibold mb-1">{skills[showTooltip].name}</p>
              <p className="text-gray-300 text-xs">{skills[showTooltip].description}</p>
            </div>
          )}
        </div>

        {skills.map((skill, index) => {
          const angle = (index * (360 / skills.length) + rotation) * (Math.PI / 180)
          const radius = window.innerWidth < 640 ? 70 : 180
          const x = Math.cos(angle) * radius + (window.innerWidth < 640 ? 140 : 240)
          const y = Math.sin(angle) * radius + (window.innerWidth < 640 ? 140 : 240)

          return (
            <div
              key={skill.name}
              className="absolute transition-all duration-300"
              style={{
                left: `${x - 24}px`,
                top: `${y - 24}px`,
                zIndex: 10
              }}
            >
              <div 
                className={`relative group cursor-pointer bg-gray-800/80 p-2 sm:p-4 rounded-full shadow-lg 
                  border-2 border-blue-500/30 hover:border-blue-400 backdrop-blur-sm
                  transform hover:scale-110 ${selectedSkill === index ? 'scale-125 border-green-400' : ''}`}
                onClick={() => {
                  setSelectedSkill(index)
                  setIsLearning(true)
                }}
                onMouseEnter={() => setShowTooltip(index)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                {skill.icon}
              </div>
            </div>
          )
        })}

        <div className="absolute w-full flex justify-center" style={{ top: window.innerWidth < 640 ? '260px' : '480px' }}>
            <div className="h-8 sm:h-12">
              {isLearning && (
                <Zap className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400 animate-pulse" />
              )}
            </div>
          </div>
      </div>

      <div className="mt-8 sm:mt-16 text-center bg-gray-900/50 p-3 sm:p-6 rounded-xl backdrop-blur-sm border border-blue-500/30 max-w-[260px] sm:max-w-none mx-auto">
        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 flex items-center justify-center gap-2">
          {isLearning ? "Learning..." : skills[selectedSkill].name}
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
        </h2>
        <div className="w-48 sm:w-80 bg-gray-700/50 rounded-full h-2.5 sm:h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 rounded-full h-full transition-all duration-500"
            style={{ width: `${skills[selectedSkill].mastery}%` }}
          />
        </div>
        <p className="mt-1 sm:mt-2 text-xs sm:text-base text-blue-200">Mastery Level: {skills[selectedSkill].mastery}%</p>
      </div>
    </div>
  )
}