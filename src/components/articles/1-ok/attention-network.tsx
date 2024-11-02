"use client"
import { useState, useEffect } from 'react'
import { Brain, FileText, Lightbulb } from 'lucide-react'

const INITIAL_SENTENCE = "The cat sat on the mat"
const WORDS = INITIAL_SENTENCE.split(" ")

const AttentionNetwork = () => {
  const [activeWord, setActiveWord] = useState(0)
  const [attentionWeights, setAttentionWeights] = useState(
    new Array(WORDS.length).fill(0.2)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % WORDS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const weights = WORDS.map((_, idx) => 
      idx === activeWord ? 0.9 : 0.2
    )
    setAttentionWeights(weights)
  }, [activeWord])

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 md:p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        {/* Title and Description */}
        <div className="text-center space-y-2">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
            Understanding Neural Attention
          </h2>
          <p className="text-xs md:text-sm text-gray-600 max-w-xl mx-auto">
            Watch how the network focuses on different words while processing text.
          </p>
        </div>

        {/* Main Visualization */}
        <div className="relative bg-gray-50 rounded-lg p-4 md:p-6">
          {/* Input Layer */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-sm">
              <FileText className="text-blue-500 w-4 h-4" />
              <span className="text-xs font-medium">Input Text</span>
            </div>
          </div>

          {/* Words with Attention */}
          <div className="flex flex-col items-center gap-2">
            {WORDS.map((word, idx) => (
              <div
                key={`${word}-${idx}`}
                className="relative flex items-center gap-2 w-full justify-center"
              >
                <div 
                  className="px-3 py-1 rounded-lg text-sm md:text-base font-medium transition-all duration-300 shadow-sm min-w-[60px] text-center"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${attentionWeights[idx]})`,
                    color: attentionWeights[idx] > 0.5 ? 'white' : 'black'
                  }}
                >
                  {word}
                </div>
                <div className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full shadow-sm min-w-[40px] text-center">
                  {Math.round(attentionWeights[idx] * 100)}%
                </div>
              </div>
            ))}
          </div>

          {/* Attention Mechanism */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Brain className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
              Attention Mechanism
            </span>
          </div>

          {/* Output */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
              <Lightbulb className="text-green-500 w-4 h-4" />
              <span className="text-xs font-medium text-green-600">
                Context-Aware Output
              </span>
            </div>
            <div className="text-xs md:text-sm px-3 py-1 bg-white shadow-sm rounded-lg text-gray-700 text-center">
              {`Focusing on "${WORDS[activeWord]}"`}
            </div>
          </div>
        </div>

        {/* Educational Notes */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-700">Input</h3>
            <p className="text-blue-600">
              Words processed separately
            </p>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <h3 className="font-bold text-purple-700">Weights</h3>
            <p className="text-purple-600">
              Attention scores
            </p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <h3 className="font-bold text-green-700">Focus</h3>
            <p className="text-green-600">
              Dynamic attention
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttentionNetwork