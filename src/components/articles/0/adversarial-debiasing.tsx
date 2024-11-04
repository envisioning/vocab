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
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-lg">
      <header className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="relative">
          <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 animate-pulse" />
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 absolute -top-1 -right-1" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
          Machine Learning Explorer
          <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
        </h1>
      </header>

      <section className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md border border-blue-100">
        <div className="relative inline-block" onMouseLeave={() => setActiveTooltip("")}>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <Book className="text-blue-500" />
            Training Data Set
            <button
              aria-label="Show training data info"
              onMouseEnter={() => setActiveTooltip("training")}
              onFocus={() => setActiveTooltip("training")}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            >
              <Info className="w-5 h-5 text-blue-400" />
            </button>
          </h2>
          {activeTooltip === "training" && (
            <div role="tooltip" className="absolute z-10 -top-2 left-full ml-2 p-3 bg-blue-600 text-white text-sm rounded-lg w-64 shadow-lg">
              This is the data the model learns from. Can you spot the pattern?
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {ML_TRAINING_DATA.map((data, index) => (
            <div key={data.input} className="relative group">
              <div className="bg-blue-50 p-4 sm:p-6 rounded-xl text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-gray-600 text-base sm:text-lg">Input: {data.input}</div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mx-auto my-2 text-blue-400" />
                <div className="text-blue-600 font-bold text-lg sm:text-xl">Output: {data.output}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md border border-blue-100 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <label htmlFor="input-range" className="text-gray-700 font-medium text-base sm:text-lg">
            Select Input:
          </label>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <input
              id="input-range"
              type="range"
              min="5"
              max="10"
              value={selectedInput}
              onChange={(e) => setSelectedInput(parseInt(e.target.value))}
              className="w-full sm:w-64 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-blue-600 font-bold text-lg sm:text-xl min-w-[2rem]">
              {selectedInput}
            </span>
          </div>
        </div>

        <button
          onClick={handlePrediction}
          disabled={isLearning}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 sm:px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:from-blue-700 hover:to-blue-600 flex items-center justify-center gap-3 font-medium"
          aria-label={isLearning ? "Learning in progress" : "Make prediction"}
        >
          {isLearning ? (
            <>
              <Zap className="animate-bounce" />
              <span className="text-sm sm:text-base">Learning Pattern...</span>
            </>
          ) : (
            <>
              <Brain className="animate-pulse" />
              <span className="text-sm sm:text-base">Predict Output</span>
            </>
          )}
        </button>
      </section>

      {hasLearned && (
        <section className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 lg:p-8 rounded-xl shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
            <CheckCircle2 className="text-green-500" />
            Prediction Result
          </h3>
          <p className="text-gray-700 text-base sm:text-lg mb-4">
            For input <span className="font-bold text-blue-600">{selectedInput}</span>, 
            the predicted output is{" "}
            <span className="font-bold text-xl sm:text-2xl text-green-600">{prediction}</span>
          </p>
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-blue-500 text-sm sm:text-base font-medium hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
          >
            {showHint ? "Hide Explanation" : "🤔 How does it work?"}
          </button>
          {showHint && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-gray-600 text-sm sm:text-base">
              The model discovered a pattern: Output = Input × 2. It learned this relationship from analyzing the training data!
            </div>
          )}
        </section>
      )}
    </div>
  )
}