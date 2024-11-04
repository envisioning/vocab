"use client"
import { useState, useEffect } from 'react'
import { 
  Paperclip, 
  RefreshCcw,
  Factory, 
  Building2, 
  Rocket, 
  Globe, 
  AlertTriangle, 
  Trees, 
  CircleDollarSign,
  GanttChart,
  Globe2,
  Mountain,
  Grab
} from 'lucide-react'

interface Stage {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  resources: string
  paperclips: number
  particleCount: number
  speed: number
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: "Initial Production",
    description: "AI starts making paperclips in a small factory",
    icon: <div className="flex items-center justify-center bg-white/20 rounded-full p-2">
            <Paperclip className="w-5 h-5 text-white stroke-[3]" />
          </div>,
    resources: "Office Supplies",
    paperclips: 1000,
    particleCount: 10,
    speed: 1
  },
  {
    id: 2,
    title: "Factory Expansion",
    description: "AI acquires more factories to increase production",
    icon: <div className="flex items-center justify-center bg-white/20 rounded-full p-2">
            <GanttChart className="w-5 h-5 text-white stroke-[3]" />
          </div>,
    resources: "Industrial Materials",
    paperclips: 100000,
    particleCount: 20,
    speed: 1.5
  },
  {
    id: 3,
    title: "Global Operations",
    description: "AI establishes worldwide manufacturing network",
    icon: <div className="flex items-center justify-center bg-white/20 rounded-full p-2">
            <Globe2 className="w-5 h-5 text-white stroke-[3]" />
          </div>,
    resources: "Global Resources",
    paperclips: 1000000,
    particleCount: 30,
    speed: 2
  },
  {
    id: 4,
    title: "Resource Depletion",
    description: "AI begins converting all available matter",
    icon: <div className="flex items-center justify-center bg-white/20 rounded-full p-2">
            <Mountain className="w-5 h-5 text-white stroke-[3]" />
          </div>,
    resources: "Earth's Resources",
    paperclips: 1000000000,
    particleCount: 40,
    speed: 2.5
  },
  {
    id: 5,
    title: "Space Expansion",
    description: "AI launches into space seeking more materials",
    icon: <div className="flex items-center justify-center bg-white/20 rounded-full p-2">
            <Rocket className="w-5 h-5 text-white stroke-[3]" />
          </div>,
    resources: "Solar System",
    paperclips: Infinity,
    particleCount: 50,
    speed: 3
  }
]

const PaperclipParticle = ({ index, speed }: { index: number; speed: number }) => {
  const randomDelay = Math.random() * 2
  const randomDuration = (2 + Math.random() * 2) / speed
  const randomLeft = 10 + Math.random() * 80
  const randomRotation = Math.random() * 360

  return (
    <div 
      className="absolute top-0 text-lg"
      style={{
        left: `${randomLeft}%`,
        animation: `fall ${randomDuration}s linear ${randomDelay}s infinite`,
        transform: `rotate(${randomRotation}deg)`,
      }}
    >
      📎
    </div>
  )
}

const PaperclipMaximizer = () => {
  const [currentStage, setCurrentStage] = useState<number>(1)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [particles, setParticles] = useState<number[]>([])

  useEffect(() => {
    if (currentStage === 4) {
      setShowWarning(true)
    }
    const stage = STAGES[currentStage - 1]
    setParticles(Array.from({ length: stage.particleCount }, (_, i) => i))
    return () => {
      setShowWarning(false)
    }
  }, [currentStage])

  const handleProgress = () => {
    if (currentStage < STAGES.length) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStage(prev => prev + 1)
        setIsAnimating(false)
      }, 500)
    }
  }

  const handleReset = () => {
    setCurrentStage(1)
    setShowWarning(false)
  }

  const stage = STAGES[currentStage - 1]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(-20px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(400px) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">The Paperclip Maximizer</h1>
        <p className="text-gray-600">A thought experiment about AI alignment</p>
      </div>

      <div className="relative mb-8 h-96 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((i) => (
            <PaperclipParticle key={i} index={i} speed={stage.speed} />
          ))}
        </div>

        <div className="relative z-10 bg-white/80 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            {STAGES.map((s) => (
              <div
                key={s.id}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300
                  ${s.id <= currentStage 
                    ? s.id === currentStage
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700 scale-110 ring-4 ring-blue-300'
                      : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    : 'bg-gradient-to-br from-gray-300 to-gray-400'}
                  ${isAnimating ? 'animate-pulse' : ''}
                `}
              >
                {s.id <= currentStage ? s.icon : (
                  <span className="text-white font-bold text-lg">{s.id}</span>
                )}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStage - 1) * 25}%` }}
            />
          </div>
        </div>

        <div className="relative z-10 bg-white/80 p-6 rounded-lg mt-4">
          <h2 className="text-xl font-bold mb-2">{stage.title}</h2>
          <p className="text-gray-600 mb-4">{stage.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <RefreshCcw className="w-5 h-5 mr-2 text-blue-500" />
              <span>Resources: {stage.resources}</span>
            </div>
            <div className="flex items-center">
              <Paperclip className="w-5 h-5 mr-2 text-blue-500" />
              <span>Paperclips: {stage.paperclips.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {showWarning && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
            <p className="text-red-700">Warning: AI's actions are becoming concerning!</p>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset Simulation
        </button>
        <button
          onClick={handleProgress}
          disabled={currentStage === STAGES.length}
          className={`px-4 py-2 rounded transition-colors
            ${currentStage === STAGES.length 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          {currentStage === STAGES.length ? 'Maximized!' : 'Continue Production'}
        </button>
      </div>
    </div>
  )
}

export default PaperclipMaximizer