'use client'
import { useState, useEffect } from 'react'
import {
  Brain,
  Binary,
  Camera,
  Music,
  MessageSquare,
  Lightbulb,
  Waves,
  ThermometerSun,
  Heart,
  SmilePlus,
  ArrowRight,
  Monitor,
  RefreshCw
} from 'lucide-react'

interface GroundingItem {
  id: number
  binary: string
  icon: JSX.Element
  meaning: string
  category: 'sensory' | 'abstract' | 'emotion'
  description: string
}

const GroundingExplainer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'sensory' | 'abstract' | 'emotion'>('sensory')
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showExplanation, setShowExplanation] = useState<boolean>(false)

  const groundingItems: GroundingItem[] = [
    {
      id: 1,
      binary: "10101",
      icon: <Camera className="w-6 h-6" />,
      meaning: "Visual Input",
      category: 'sensory',
      description: "AI processes images just like we see things"
    },
    {
      id: 2,
      binary: "11000",
      icon: <Waves className="w-6 h-6" />,
      meaning: "Sound",
      category: 'sensory',
      description: "Converting sound waves to meaning"
    },
    {
      id: 3,
      binary: "10011",
      icon: <ThermometerSun className="w-6 h-6" />,
      meaning: "Temperature",
      category: 'sensory',
      description: "Understanding environmental conditions"
    },
    {
      id: 4,
      binary: "01101",
      icon: <MessageSquare className="w-6 h-6" />,
      meaning: "Language",
      category: 'abstract',
      description: "Connecting words to their meanings"
    },
    {
      id: 5,
      binary: "11101",
      icon: <Lightbulb className="w-6 h-6" />,
      meaning: "Concepts",
      category: 'abstract',
      description: "Understanding abstract ideas"
    },
    {
      id: 6,
      binary: "00101",
      icon: <Heart className="w-6 h-6" />,
      meaning: "Emotions",
      category: 'emotion',
      description: "Recognizing human feelings"
    }
  ]

  const categoryColors = {
    sensory: 'bg-blue-500',
    abstract: 'bg-purple-500',
    emotion: 'bg-pink-500'
  }

  const categoryBorderColors = {
    sensory: 'border-blue-500',
    abstract: 'border-purple-500',
    emotion: 'border-pink-500'
  }

  const handleCategoryChange = (category: 'sensory' | 'abstract' | 'emotion') => {
    setIsAnimating(true)
    setActiveCategory(category)
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Brain className="w-8 h-8 text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold">From Data to Understanding</h2>
        </div>
        <Monitor className="w-8 h-8 text-gray-400" />
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {(['sensory', 'abstract', 'emotion'] as const).map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-6 py-3 rounded-lg font-medium transition duration-300 
              ${activeCategory === category 
                ? `${categoryColors[category]} text-white` 
                : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} Grounding
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {groundingItems
          .filter(item => item.category === activeCategory)
          .map(item => (
            <div
              key={item.id}
              className={`p-6 rounded-lg border-2 transition-all duration-300 transform
                ${categoryBorderColors[item.category]}
                ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
              `}
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center space-x-4 w-1/3">
                  <Binary className="w-6 h-6 text-gray-600" />
                  <code className="font-mono text-sm">{item.binary}</code>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />
                <div className="flex items-center space-x-4 w-1/3">
                  {item.icon}
                  <span className="font-medium">{item.meaning}</span>
                </div>
                <div className="w-1/3 text-gray-600 text-sm ml-4">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300"
        >
          <SmilePlus className="w-5 h-5 mr-2" />
          {showExplanation ? "Hide" : "Show"} Example
        </button>
      </div>

      {showExplanation && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            Just like how a child learns to connect the word "dog" with actual dogs they see,
            AI systems need to connect their internal representations (binary patterns) with
            real-world meanings. This process of "grounding" helps AI make sense of the world
            across different types of inputs - from basic sensory data to complex emotions and
            abstract concepts.
          </p>
        </div>
      )}
    </div>
  )
}

export default GroundingExplainer