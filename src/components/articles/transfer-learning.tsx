"use client"
import { useState, useEffect } from "react"
import { Brain, Image, Camera, Transfer, Info, Lightbulb, ArrowRight } from "lucide-react"

interface TransferLearningProps {}

type ModelState = {
  knowledge: number
  trained: boolean
  transferring: boolean
}

const INITIAL_KNOWLEDGE = 20
const MAX_KNOWLEDGE = 100
const TRANSFER_SPEED = 50

const TransferLearning: React.FC<TransferLearningProps> = () => {
  const [sourceModel, setSourceModel] = useState<ModelState>({
    knowledge: INITIAL_KNOWLEDGE,
    trained: false,
    transferring: false
  })
  
  const [targetModel, setTargetModel] = useState<ModelState>({
    knowledge: 0,
    trained: false,
    transferring: false
  })

  const [isTransferring, setIsTransferring] = useState(false)
  const [showTooltip, setShowTooltip] = useState("")

  useEffect(() => {
    let interval: NodeJS.Timer
    
    if (isTransferring) {
      interval = setInterval(() => {
        setSourceModel(prev => ({
          ...prev,
          transferring: true
        }))
        
        setTargetModel(prev => {
          const newKnowledge = Math.min(prev.knowledge + 5, sourceModel.knowledge * 0.8)
          return {
            ...prev,
            knowledge: newKnowledge,
            transferring: true
          }
        })
      }, TRANSFER_SPEED)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTransferring, sourceModel.knowledge])

  const handleTrainSource = () => {
    setSourceModel(prev => ({
      ...prev,
      knowledge: MAX_KNOWLEDGE,
      trained: true
    }))
  }

  const handleTransfer = () => {
    setIsTransferring(true)
    setTimeout(() => {
      setIsTransferring(false)
      setSourceModel(prev => ({...prev, transferring: false}))
      setTargetModel(prev => ({...prev, transferring: false, trained: true}))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="relative mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
            Transfer Learning Journey
          </h1>
          <Lightbulb className="absolute -top-4 -right-4 text-yellow-400 animate-pulse" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="relative group">
            <div className={`p-6 md:p-8 rounded-xl bg-white/90 dark:bg-gray-800/90 shadow-xl
              backdrop-blur-sm border-2 border-blue-100 dark:border-blue-900
              transform transition-all duration-500 hover:shadow-2xl
              ${sourceModel.transferring ? 'scale-95' : 'scale-100'}`}>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Brain 
                    size={48} 
                    className={`${sourceModel.trained ? 'text-green-500' : 'text-gray-400'} 
                    transition-colors duration-300`}
                  />
                  <Info
                    size={16}
                    className="absolute -top-2 -right-2 text-blue-500 cursor-pointer"
                    onMouseEnter={() => setShowTooltip("source")}
                    onMouseLeave={() => setShowTooltip("")}
                  />
                </div>
                {showTooltip === "source" && (
                  <div className="absolute -top-16 left-0 right-0 bg-blue-600 text-white p-2 rounded-lg text-sm text-center">
                    Pre-trained on millions of images
                  </div>
                )}
                <h2 className="font-semibold text-gray-700 dark:text-gray-200 text-center">
                  Source: Image Recognition
                </h2>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-500 rounded-full h-3 transition-all duration-300"
                    style={{width: `${sourceModel.knowledge}%`}}
                  />
                </div>
                {!sourceModel.trained && (
                  <button
                    onClick={handleTrainSource}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg
                      hover:bg-blue-600 transition-colors duration-300
                      transform hover:scale-105 active:scale-95"
                  >
                    Train Model
                  </button>
                )}
              </div>
            </div>
            <Image className="absolute -top-4 -left-4 text-blue-500 animate-bounce" />
            <Camera className="absolute -bottom-4 -right-4 text-blue-500 animate-bounce delay-150" />
          </div>

          {sourceModel.trained && !targetModel.trained && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleTransfer}
                className="transform transition-all duration-300 relative group"
              >
                <ArrowRight 
                  size={48}
                  className={`${isTransferring ? 'text-green-500 animate-pulse' : 'text-blue-500'}
                    transform rotate-90 md:rotate-0`}
                />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                  bg-blue-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 text-sm">
                  Transfer Knowledge
                </span>
              </button>
            </div>
          )}

          <div className="relative group">
            <div className={`p-6 md:p-8 rounded-xl bg-white/90 dark:bg-gray-800/90 shadow-xl
              backdrop-blur-sm border-2 border-blue-100 dark:border-blue-900
              transform transition-all duration-500 hover:shadow-2xl
              ${targetModel.transferring ? 'scale-105' : 'scale-100'}`}>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Brain 
                    size={48}
                    className={`${targetModel.trained ? 'text-green-500' : 'text-gray-400'}
                    transition-colors duration-300`}
                  />
                  <Info
                    size={16}
                    className="absolute -top-2 -right-2 text-blue-500 cursor-pointer"
                    onMouseEnter={() => setShowTooltip("target")}
                    onMouseLeave={() => setShowTooltip("")}
                  />
                </div>
                {showTooltip === "target" && (
                  <div className="absolute -top-16 left-0 right-0 bg-blue-600 text-white p-2 rounded-lg text-sm text-center">
                    Learning from source model's expertise
                  </div>
                )}
                <h2 className="font-semibold text-gray-700 dark:text-gray-200 text-center">
                  Target: Sketch Recognition
                </h2>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-500 rounded-full h-3 transition-all duration-300"
                    style={{width: `${targetModel.knowledge}%`}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 text-center px-4">
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Just as a chef's knife skills help them learn new cooking techniques faster,
            our AI model transfers its image recognition expertise to quickly master sketch recognition!
          </p>
        </div>
      </div>
    </div>
  )
}

export default TransferLearning