"use client"
import { useState, useEffect } from "react"
import { Image, MoveHorizontal, Palette, RotateCcw, Brain, Info, Bot } from "lucide-react"

interface InvarianceProps {}

type TransformType = "rotate" | "scale" | "translate" | "color"

interface Animal {
  emoji: string;
  name: string;
}

const ANIMALS: Animal[] = [
  { emoji: "🐱", name: "cat" },
  { emoji: "🐶", name: "dog" },
  { emoji: "🐹", name: "hamster" },
  { emoji: "🦊", name: "fox" },
  { emoji: "🐯", name: "tiger" },
  { emoji: "🦁", name: "lion" },
  { emoji: "🐮", name: "cow" },
  { emoji: "🐷", name: "pig" },
  { emoji: "🐙", name: "octopus" }
]

/**
 * An interactive component demonstrating AI invariance through visual transformations
 */
const InvarianceDemo = ({}: InvarianceProps) => {
  const [activeTransform, setActiveTransform] = useState<TransformType>("rotate")
  const [isAnimating, setIsAnimating] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hue, setHue] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [currentAnimal, setCurrentAnimal] = useState<Animal>(ANIMALS[0])

  useEffect(() => {
    // Set random animal on mount
    const randomIndex = Math.floor(Math.random() * ANIMALS.length)
    setCurrentAnimal(ANIMALS[randomIndex])
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAnimating) {
      if (activeTransform === "rotate") {
        setRotation(prev => (prev + 90) % 360)
        setIsAnimating(false)
      } else if (activeTransform === "scale") {
        interval = setInterval(() => {
          setScale(prev => {
            const newScale = 1 + Math.sin(Date.now() * 0.002) * 0.5
            return Number(newScale.toFixed(2))
          })
        }, 50)
      } else if (activeTransform === "translate") {
        interval = setInterval(() => {
          const angle = Date.now() * 0.002
          setPosition({
            x: Math.sin(angle) * 30,
            y: Math.cos(angle) * 30
          })
        }, 50)
      } else if (activeTransform === "color") {
        interval = setInterval(() => {
          setHue(prev => (prev + 1) % 360)
        }, 50)
      }
    } else {
      if (activeTransform !== "rotate") {
        setScale(1)
        setPosition({ x: 0, y: 0 })
        setHue(0)
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isAnimating, activeTransform])

  const getEmojiStyle = () => {
    const transforms = []
    if (activeTransform === "rotate") transforms.push(`rotate(${rotation}deg)`)
    if (activeTransform === "scale") transforms.push(`scale(${scale})`)
    if (activeTransform === "translate") {
      transforms.push(`translate(${position.x}px, ${position.y}px)`)
    }
    
    return {
      transform: transforms.join(" "),
      filter: activeTransform === "color" ? `hue-rotate(${hue}deg)` : "none",
      transition: activeTransform === "rotate" ? "transform 0.3s ease-in-out" : "none"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <div className="relative w-full max-w-4xl p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
          >
            <Info size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Brain className="w-12 h-12 text-blue-500 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
            AI Invariance Explorer
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl">
            Discover how AI maintains consistent recognition despite visual changes
          </p>
        </div>

        {showInfo && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-sm md:text-base">
            <p className="text-gray-700 dark:text-gray-200">
              Invariance is a crucial property of AI systems that allows them to recognize objects
              consistently, even when the input is transformed through rotation, scaling, translation,
              or color changes. This robustness is essential for real-world applications.
            </p>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <span 
              className="text-4xl md:text-5xl"
              style={getEmojiStyle()}
            >
              {currentAnimal.emoji}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="relative flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
            <Bot className="w-6 h-6 text-blue-500" />
            <div className="relative">
              <div className="bg-white dark:bg-gray-600 px-4 py-2 rounded-2xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-200">
                  {hasInteracted 
                    ? `It's still a ${currentAnimal.name}.` 
                    : `This is a ${currentAnimal.name}.`}
                </p>
              </div>
              <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-white dark:bg-gray-600 rotate-45 transform" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: "rotate", icon: RotateCcw, label: "Rotate" },
            { type: "scale", icon: Image, label: "Scale" },
            { type: "translate", icon: MoveHorizontal, label: "Move" },
            { type: "color", icon: Palette, label: "Color" },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => {
                setActiveTransform(type as TransformType)
                setIsAnimating(!isAnimating)
                setHasInteracted(true)
              }}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                activeTransform === type && isAnimating
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm md:text-base">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InvarianceDemo