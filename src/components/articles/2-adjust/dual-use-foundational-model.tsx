'use client'
import { useState } from 'react'
import { Brain, Database, Sparkles, Shield, Sword, Lock } from 'lucide-react'

interface AIType {
  id: number
  name: string
  icon: JSX.Element
  beneficial: string
  harmful: string
  revealed: {
    beneficial: boolean
    harmful: boolean
  }
}

const DualUseAIComponent: React.FC = () => {
  const [aiTypes, setAITypes] = useState<AIType[]>([
    {
      id: 1,
      name: "Language Models",
      icon: <Brain className="w-8 h-8" />,
      beneficial: "Educational tutoring assistance",
      harmful: "Generating deceptive content",
      revealed: {
        beneficial: false,
        harmful: false
      }
    },
    {
      id: 2,
      name: "Computer Vision Models",
      icon: <Sparkles className="w-8 h-8" />,
      beneficial: "Medical imaging analysis",
      harmful: "Surveillance without consent",
      revealed: {
        beneficial: false,
        harmful: false
      }
    },
    {
      id: 3,
      name: "Predictive Models",
      icon: <Database className="w-8 h-8" />,
      beneficial: "Weather forecasting",
      harmful: "Manipulative behavior prediction",
      revealed: {
        beneficial: false,
        harmful: false
      }
    }
  ])

  const toggleReveal = (id: number, type: 'beneficial' | 'harmful') => {
    setAITypes(prev => prev.map(item => 
      item.id === id 
        ? {
            ...item,
            revealed: {
              ...item.revealed,
              [type]: !item.revealed[type]
            }
          }
        : item
    ))
  }

  const resetExploration = () => {
    setAITypes(prev => prev.map(type => ({
      ...type,
      revealed: {
        beneficial: false,
        harmful: false
      }
    })))
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dual-Use AI Types</h2>
        <button
          onClick={resetExploration}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          aria-label="Reset exploration"
        >
          Start Over
        </button>
      </div>

      <div className="space-y-6">
        {aiTypes.map(type => (
          <div 
            key={type.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{type.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => toggleReveal(type.id, 'beneficial')}
                  className={`relative p-4 rounded-lg text-left group transition-all duration-300
                    ${type.revealed.beneficial ? 'bg-green-100' : 'bg-gray-100 hover:bg-green-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-700">Beneficial Use</span>
                  </div>
                  {type.revealed.beneficial ? (
                    <p className="mt-2 text-green-800">{type.beneficial}</p>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-green-100/90 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-green-700">
                        <Lock className="w-5 h-5" />
                        <span>Click to reveal</span>
                      </div>
                    </div>
                  )}
                </button>

                <button 
                  onClick={() => toggleReveal(type.id, 'harmful')}
                  className={`relative p-4 rounded-lg text-left group transition-all duration-300
                    ${type.revealed.harmful ? 'bg-red-100' : 'bg-gray-100 hover:bg-red-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <Sword className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-700">Harmful Use</span>
                  </div>
                  {type.revealed.harmful ? (
                    <p className="mt-2 text-red-800">{type.harmful}</p>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-100/90 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-red-700">
                        <Lock className="w-5 h-5" />
                        <span>Click to reveal</span>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DualUseAIComponent