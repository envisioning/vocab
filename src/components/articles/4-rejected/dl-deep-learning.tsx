"use client"
import { useState, useEffect } from "react"
import { Building2, CircleDot, Brain, ArrowRight, Eye, Check, X } from "lucide-react"

interface LayerTownProps {}

type District = {
  id: number
  name: string
  feature: string
  icon: JSX.Element
  description: string
}

type DataPacket = {
  id: number
  position: number
  features: string[]
}

const DISTRICTS: District[] = [
  {
    id: 1,
    name: "Input Suburbs",
    feature: "Raw Shapes",
    icon: <CircleDot className="w-8 h-8" />,
    description: "Receives raw visual data like edges and basic shapes"
  },
  {
    id: 2,
    name: "Pattern Plaza",
    feature: "Simple Patterns",
    icon: <Building2 className="w-8 h-8" />,
    description: "Identifies basic patterns and combinations"
  },
  {
    id: 3,
    name: "Feature Fields",
    feature: "Complex Features",
    icon: <Eye className="w-8 h-8" />,
    description: "Recognizes complex features and arrangements"
  },
  {
    id: 4,
    name: "Decision Downtown",
    feature: "Final Output",
    icon: <Brain className="w-8 h-8" />,
    description: "Makes final classification decisions"
  }
]

export default function LayerTown({}: LayerTownProps) {
  const [activeDistrict, setActiveDistrict] = useState<number>(0)
  const [dataPackets, setDataPackets] = useState<DataPacket[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [prediction, setPrediction] = useState<string>("")
  const [score, setScore] = useState<number>(0)

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setDataPackets(prev => {
          return prev.map(packet => ({
            ...packet,
            position: packet.position < DISTRICTS.length ? packet.position + 1 : packet.position,
            features: [...packet.features, DISTRICTS[packet.position]?.feature || ""]
          }))
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isProcessing])

  const handleDistrictClick = (id: number) => {
    if (!isProcessing) {
      setActiveDistrict(id)
    }
  }

  const startProcessing = () => {
    setIsProcessing(true)
    setDataPackets([{ id: Date.now(), position: 0, features: [] }])
  }

  const handlePrediction = (guess: string) => {
    const isCorrect = guess === "circle"
    setPrediction(guess)
    setScore(prev => isCorrect ? prev + 1 : prev)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Layer Town: Deep Learning Journey</h1>
      
      <div className="flex space-x-4 mb-8">
        {DISTRICTS.map((district) => (
          <button
            key={district.id}
            onClick={() => handleDistrictClick(district.id)}
            className={`flex-1 p-4 rounded-lg transition-all duration-300 ${
              activeDistrict === district.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            aria-pressed={activeDistrict === district.id}
          >
            <div className="flex flex-col items-center space-y-2">
              {district.icon}
              <span className="text-sm font-medium">{district.name}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="relative h-32 bg-gray-200 rounded-lg mb-4">
        {dataPackets.map(packet => (
          <div
            key={packet.id}
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-500"
            style={{ left: `${(packet.position / (DISTRICTS.length - 1)) * 100}%` }}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse" />
          </div>
        ))}
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={startProcessing}
          disabled={isProcessing}
          className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
        >
          Process New Data
        </button>
        <div className="text-lg">Score: {score}</div>
      </div>

      {activeDistrict > 0 && (
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2">{DISTRICTS[activeDistrict - 1].name}</h2>
          <p>{DISTRICTS[activeDistrict - 1].description}</p>
        </div>
      )}

      {isProcessing && dataPackets[0]?.position === DISTRICTS.length && (
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => handlePrediction("circle")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Circle <Check className="inline w-4 h-4" />
          </button>
          <button
            onClick={() => handlePrediction("square")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Square <X className="inline w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}