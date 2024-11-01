"use client"
import { useState, useEffect } from "react"
import { Sparkles, Brain, Wand2, Eraser, HelpCircle, Palette, ShuffleIcon } from "lucide-react"

interface GenerativeModelProps {}

type GeneratedPattern = {
  id: number
  pattern: string[][]
}

const GenerativeModel: React.FC<GenerativeModelProps> = () => {
  const [canvas, setCanvas] = useState<string[][]>(
    Array(10).fill(Array(10).fill("bg-gray-200"))
  )
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedPatterns, setGeneratedPatterns] = useState<GeneratedPattern[]>([])
  const [activeColor, setActiveColor] = useState<string>("bg-blue-500")
  const [showTooltip, setShowTooltip] = useState<string>("")

  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-amber-500"
  ]

  const handlePixelClick = (row: number, col: number) => {
    const newCanvas = canvas.map((r, i) => 
      i === row ? r.map((c, j) => 
        j === col ? activeColor : c
      ) : [...r]
    )
    setCanvas(newCanvas)
  }

  const generatePattern = () => {
    setIsGenerating(true)
    
    const variations = Array(3).fill(null).map(() => 
      canvas.map(row => 
        row.map(pixel => {
          if (pixel !== "bg-gray-200") {
            const randomFactor = Math.random()
            if (randomFactor > 0.7) {
              return colors[Math.floor(Math.random() * colors.length)]
            }
            if (randomFactor > 0.5) {
              return pixel
            }
          }
          return "bg-gray-200"
        })
      )
    )

    setGeneratedPatterns(prev => [
      ...prev,
      ...variations.map((pattern, idx) => ({
        id: prev.length + idx + 1,
        pattern
      }))
    ].slice(-6))

    setTimeout(() => setIsGenerating(false), 1000)
  }

  useEffect(() => {
    return () => {
      setGeneratedPatterns([])
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl">
      <div className="text-center space-y-4 relative">
        <div className="flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
            Generative AI Studio
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Create patterns and watch AI generate unique variations
        </p>
        <div className="absolute right-0 top-0">
          <button
            onMouseEnter={() => setShowTooltip("help")}
            onMouseLeave={() => setShowTooltip("")}
            className="text-gray-500 hover:text-blue-500 transition-colors duration-300"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
          {showTooltip === "help" && (
            <div className="absolute right-0 w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-300">
              Paint pixels to create a pattern, then click Generate to see AI-created variations!
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Palette className="w-6 h-6 text-gray-500" />
        {colors.map((color, i) => (
          <button
            key={i}
            className={`w-10 h-10 rounded-lg ${color} transition-all duration-300 
              ${activeColor === color ? 'scale-110 ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-105'}`}
            onClick={() => setActiveColor(color)}
          />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8 justify-center">
        <div className="space-y-4">
          <div className="grid grid-cols-10 gap-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            {canvas.map((row, i) => (
              <div key={i} className="flex">
                {row.map((pixel, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`w-8 h-8 ${pixel} rounded-md cursor-pointer 
                      transition-all duration-300 hover:opacity-75 hover:scale-105`}
                    onClick={() => handlePixelClick(i, j)}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={generatePattern}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg
                hover:bg-blue-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
            >
              {isGenerating ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              Generate Magic
            </button>

            <button
              onClick={() => {
                setCanvas(Array(10).fill(Array(10).fill("bg-gray-200")))
                setGeneratedPatterns([])
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg
                hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
            >
              <Eraser className="w-5 h-5" />
              Clear Canvas
            </button>
          </div>
        </div>

        <div className="space-y-4 w-full lg:w-auto">
          <div className="flex items-center justify-center gap-2">
            <ShuffleIcon className="w-5 h-5 text-purple-500" />
            <h3 className="text-xl font-semibold text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              AI Generated Variations
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {generatedPatterns.map((item) => (
              <div 
                key={item.id}
                className="grid grid-cols-10 gap-0.5 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
              >
                {item.pattern.map((row, i) => (
                  <div key={i} className="flex">
                    {row.map((pixel, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={`w-4 h-4 ${pixel} rounded-sm`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerativeModel