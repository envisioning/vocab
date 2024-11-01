"use client"
import { useState, useEffect } from "react"
import { Brain, Cat, Dog, Fish, Bird, AlertCircle, CheckCircle2, HelpCircle, Sparkles, Target } from "lucide-react"

interface AnimalPrediction {
  id: number
  icon: JSX.Element
  label: string
  isTrainingSet: boolean
  features: string[]
}

const GeneralizationDemo = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [confidence, setConfidence] = useState<number>(0)
  const [modelState, setModelState] = useState<'learning' | 'predicting' | 'idle'>('idle')

  const animals: AnimalPrediction[] = [
    { 
      id: 1, 
      icon: <Dog className="w-12 h-12" />, 
      label: "Dog", 
      isTrainingSet: true,
      features: ["4 legs", "fur", "barks"]
    },
    { 
      id: 2, 
      icon: <Cat className="w-12 h-12" />, 
      label: "Cat", 
      isTrainingSet: true,
      features: ["4 legs", "fur", "meows"]
    },
    { 
      id: 3, 
      icon: <Fish className="w-12 h-12" />, 
      label: "Fish", 
      isTrainingSet: false,
      features: ["fins", "swims", "gills"]
    },
    { 
      id: 4, 
      icon: <Bird className="w-12 h-12" />, 
      label: "Bird", 
      isTrainingSet: false,
      features: ["wings", "feathers", "flies"]
    }
  ]

  useEffect(() => {
    if (selectedAnimal) {
      setModelState('learning')
      const timer = setTimeout(() => {
        setModelState('predicting')
        setConfidence(Math.random() * 30 + 70)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [selectedAnimal])

  const handleAnimalClick = (id: number) => {
    setSelectedAnimal(id)
    setConfidence(0)
  }

  return (
    <div className="flex flex-col items-center p-8 min-h-[600px] bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-blue-950 rounded-xl shadow-xl">
      <div className="text-center mb-8 relative">
        <h2 className="text-4xl font-bold mb-3 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-500" />
          AI Generalization
          <HelpCircle 
            className="w-5 h-5 text-blue-400 cursor-help"
            onMouseEnter={() => setShowTooltip(-1)}
            onMouseLeave={() => setShowTooltip(null)}
          />
        </h2>
        {showTooltip === -1 && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg w-64 z-10">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Generalization is an AI's ability to apply learned patterns to new, unseen examples
            </p>
          </div>
        )}
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Discover how AI learns to recognize new animals!
        </p>
      </div>

      <div className="relative mb-12">
        <Brain 
          className={`w-20 h-20 ${
            modelState === 'learning' ? 'text-green-500 animate-pulse' :
            modelState === 'predicting' ? 'text-blue-500 animate-bounce' :
            'text-slate-400'
          } transition-colors duration-300`}
        />
        {modelState !== 'idle' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2">
            <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-sm">
              {modelState === 'learning' ? 'Learning...' : 'Predicting!'}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-12 mb-8 w-full max-w-4xl">
        {['Training Set', 'New Data'].map((title, idx) => (
          <div key={title} className="space-y-4">
            <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              {title}
              <Target className="w-5 h-5 text-blue-500" />
            </h3>
            <div className="flex flex-col gap-4">
              {animals
                .filter(a => a.isTrainingSet === (idx === 0))
                .map(animal => (
                  <button
                    key={animal.id}
                    onClick={() => handleAnimalClick(animal.id)}
                    onMouseEnter={() => setShowTooltip(animal.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                    className={`relative flex items-center gap-3 p-6 rounded-xl transition-all duration-300
                      ${selectedAnimal === animal.id 
                        ? 'bg-blue-500 text-white scale-105 shadow-lg' 
                        : 'bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 shadow-md'
                      }`}
                  >
                    {animal.icon}
                    <span className="text-lg">{animal.label}</span>
                    {animal.isTrainingSet ? (
                      <CheckCircle2 className="w-6 h-6 ml-auto text-green-500" />
                    ) : (
                      <AlertCircle className={`w-6 h-6 ml-auto ${
                        selectedAnimal === animal.id ? 'text-white' : 'text-blue-500'
                      }`} />
                    )}
                    {showTooltip === animal.id && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg z-10">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Features: {animal.features.join(", ")}
                        </div>
                      </div>
                    )}
                  </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedAnimal && modelState === 'predicting' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl max-w-md text-center shadow-lg animate-fade-in">
          <div className="mb-3 text-green-500 font-semibold">
            Confidence: {confidence.toFixed(1)}%
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-lg">
            The AI model uses patterns learned from dogs and cats (like having legs and fur)
            to understand new animals, even if they're quite different!
          </p>
        </div>
      )}
    </div>
  )
}

export default GeneralizationDemo