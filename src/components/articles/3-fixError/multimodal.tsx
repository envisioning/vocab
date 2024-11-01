"use client"
import { useState, useEffect } from "react"
import { Image, FileText, Music, BrainCircuit, Sparkles, ArrowRight, Info, Eye, BookOpen, Mic } from "lucide-react"

interface ModalityState {
  active: boolean
  processed: boolean
}

interface TooltipState {
  visible: boolean
  content: string
}

const MultimodalAI = () => {
  const [modalities, setModalities] = useState<Record<string, ModalityState>>({
    image: { active: false, processed: false },
    text: { active: false, processed: false },
    audio: { active: false, processed: false }
  })

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: ""
  })
  const [processing, setProcessing] = useState(false)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    const allActive = Object.values(modalities).every(m => m.active)
    if (allActive && !processing) {
      setProcessing(true)
      const timer = setTimeout(() => {
        setModalities(prev => (
          Object.entries(prev).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: { ...value, processed: true }
          }), {})
        ))
        setProcessing(false)
        setComplete(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [modalities, processing])

  const handleModalityClick = (type: string) => {
    if (!processing) {
      setModalities(prev => ({
        ...prev,
        [type]: { ...prev[type], active: !prev[type].active }
      }))
    }
  }

  const handleTooltip = (content: string) => {
    setTooltip({ visible: true, content })
  }

  const hideTooltip = () => {
    setTooltip({ visible: false, content: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8 flex flex-col items-center justify-center">
      <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 flex items-center gap-3">
          Multimodal AI
          <Info 
            className="w-6 h-6 text-gray-400 cursor-help"
            onMouseEnter={() => handleTooltip("AI systems that can understand multiple types of input: images, text, and sound - just like humans!")}
            onMouseLeave={hideTooltip}
          />
        </h1>

        <div className="grid grid-cols-3 gap-8 mb-12">
          {[
            { type: "image", icon: Eye, label: "Vision" },
            { type: "text", icon: BookOpen, label: "Language" },
            { type: "audio", icon: Mic, label: "Audio" }
          ].map(({ type, icon: Icon, label }) => (
            <div 
              key={type}
              className={`
                relative group rounded-xl p-8 transition-all duration-500 cursor-pointer
                ${modalities[type].processed 
                  ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20' 
                  : modalities[type].active 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20'
                    : 'bg-gray-700 hover:bg-gray-600'}
              `}
              onClick={() => handleModalityClick(type)}
            >
              <div className="flex flex-col items-center gap-4">
                <Icon className="w-16 h-16" />
                <span className="font-medium text-lg text-white">{label}</span>
              </div>
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/20 transition-all duration-300" />
            </div>
          ))}
        </div>

        <div className={`flex justify-center items-center gap-8 transition-all duration-500 ${processing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <BrainCircuit className="w-20 h-20 text-blue-400 animate-pulse" />
          <ArrowRight className="w-12 h-12 text-gray-400" />
          <Sparkles className="w-20 h-20 text-green-400 animate-bounce" />
        </div>

        {complete && (
          <div className="text-center mt-8 text-xl font-medium text-blue-400 animate-fade-in">
            Unified Understanding Achieved! 🌟
          </div>
        )}

        {tooltip.visible && (
          <div className="absolute top-20 right-8 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-xs">
            {tooltip.content}
          </div>
        )}
      </div>
    </div>
  )
}

export default MultimodalAI