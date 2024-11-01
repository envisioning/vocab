"use client"
import { useState, useEffect } from "react"
import { 
  Brain, 
  Target, 
  Book, 
  Zap, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Sparkles,
  GraduationCap
} from "lucide-react"

interface TrainingData {
  input: number
  output: number
}

interface ToolTipProps {
  message: string
  show: boolean
}

const ML_TRAINING_DATA: TrainingData[] = [
  { input: 1, output: 2 },
  { input: 2, output: 4 },
  { input: 3, output: 6 },
  { input: 4, output: 8 }
]

export default function MLConcept() {
  const [prediction, setPrediction] = useState<number>(0)
  const [isLearning, setIsLearning] = useState<boolean>(false)
  const [hasLearned, setHasLearned] = useState<boolean>(false)
  const [selectedInput, setSelectedInput] = useState<number>(5)
  const [showHint, setShowHint] = useState<boolean>(false)
  const [activeTooltip, setActiveTooltip] = useState<string>("")

  useEffect(() => {
    if (isLearning) {
      const timer = setTimeout(() => {
        setIsLearning(false)
        setHasLearned(true)
        setPrediction(selectedInput * 2)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isLearning, selectedInput])

  const handlePrediction = () => {
    setIsLearning(true)
    setHasLearned(false)
    setShowHint(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg shadow-lg">
      <header className="flex items-center gap-2 mb-4 sm:mb-6">
        <div className="relative">
          <Brain className="w-6 h-6 text-blue-500 animate-pulse" />
          <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" />
        </div>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
          Machine Learning Explorer
          <GraduationCap className="w-5 h-5 text-blue-500" />
        </h1>
      </header>

      <section className="mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-md border border-blue-100">
        <div className="relative inline-block" onMouseLeave={() => setActiveTooltip("")}>
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Book className="w-4 h-4 text-blue-500" />
            Training Data Set
            <button
              aria-label="Show training data info"
              onMouseEnter={() => setActiveTooltip("training")}
              onFocus={() => setActiveTooltip("training")}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            >
              <Info className="w-4 h-4 text-blue-400" />
            </button>
          </h2>
          {activeTooltip === "training" && (
            <div role="tooltip" className="absolute z-10 -top-2 left-full ml-2 p-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg w-56 shadow-lg">
              This is the data the model learns from. Can you spot the pattern?
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {ML_TRAINING_DATA.map((data) => (
            <div key={data.input} className="relative group">
              <div className="bg-blue-50 p-3 rounded-lg text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-gray-600 text-sm sm:text-base">Input: {data.input}</div>
                <ArrowRight className="w-4 h-4 mx-auto my-1 text-blue-400" />
                <div className="text-blue-600 font-bold text-sm sm:text-base">Output: {data.output}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-blue-100 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <label htmlFor="input-range" className="text-gray-700 font-medium text-sm sm:text-base">
            Select Input:
          </label>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              id="input-range"
              type="range"
              min="5"
              max="10"
              value={selectedInput}
              onChange={(e) => setSelectedInput(parseInt(e.target.value))}
              className="w-full sm:w-56 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-blue-600 font-bold text-sm sm:text-base min-w-[2rem]">
              {selectedInput}
            </span>
          </div>
        </div>

        <button
          onClick={handlePrediction}
          disabled={isLearning}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-md hover:from-blue-700 hover:to-blue-600 flex items-center justify-center gap-2 text-sm font-medium"
          aria-label={isLearning ? "Learning in progress" : "Make prediction"}
        >
          {isLearning ? (
            <>
              <Zap className="w-4 h-4 animate-bounce" />
              <span>Learning Pattern...</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 animate-pulse" />
              <span>Predict Output</span>
            </>
          )}
        </button>
      </section>

      {hasLearned && (
        <section className="bg-gradient-to-r from-green-50 to-blue-50 p-3 sm:p-4 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2 text-green-700">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Prediction Result
          </h3>
          <p className="text-gray-700 text-sm sm:text-base mb-3">
            For input <span className="font-bold text-blue-600">{selectedInput}</span>, 
            the predicted output is{" "}
            <span className="font-bold text-base sm:text-lg text-green-600">{prediction}</span>
          </p>
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-blue-500 text-xs sm:text-sm font-medium hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            {showHint ? "Hide Explanation" : "🤔 How does it work?"}
          </button>
          {showHint && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-gray-600 text-xs sm:text-sm">
              The model discovered a pattern: Output = Input × 2. It learned this relationship from analyzing the training data!
            </div>
          )}
        </section>
      )}
    </div>
  )
}