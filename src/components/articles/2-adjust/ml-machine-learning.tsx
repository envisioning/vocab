"use client"
import { useState, useEffect } from "react"
import { Brain, Target, Book, Zap, CheckCircle2, Info, ArrowRight, Sparkles } from "lucide-react"

interface TrainingData {
  input: number
  output: number
}

const ML_TRAINING_DATA: TrainingData[] = [
  { input: 1, output: 2 },
  { input: 2, output: 4 },
  { input: 3, output: 6 },
  { input: 4, output: 8 }
]

export default function MLConcept() {
  const [prediction, setPrediction] = useState<number>(0)
  const [isLearning, setIsLearning] = useState(false)
  const [hasLearned, setHasLearned] = useState(false)
  const [selectedInput, setSelectedInput] = useState<number>(5)
  const [showHint, setShowHint] = useState(false)
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

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <Brain className="w-10 h-10 text-blue-500 animate-pulse" />
          <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Machine Learning Explorer
        </h2>
      </div>

      <div className="mb-8 bg-white p-8 rounded-xl shadow-md border border-blue-100">
        <div className="relative inline-block" onMouseLeave={() => setActiveTooltip("")}>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Book className="text-blue-500" />
            Training Data
            <Info
              className="w-5 h-5 text-blue-400 cursor-help"
              onMouseEnter={() => setActiveTooltip("training")}
            />
          </h3>
          {activeTooltip === "training" && (
            <div className="absolute z-10 -top-2 left-full ml-2 p-3 bg-blue-600 text-white text-sm rounded-lg w-64 shadow-lg">
              This is the data the model learns from. Notice the pattern?
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 gap-6">
          {ML_TRAINING_DATA.map((data, index) => (
            <div key={data.input} className="relative group">
              <div className="bg-blue-50 p-6 rounded-xl text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-gray-600 text-lg">Input: {data.input}</div>
                <ArrowRight className="w-5 h-5 mx-auto my-2 text-blue-400" />
                <div className="text-blue-600 font-bold text-xl">Output: {data.output}</div>
              </div>
              {index < ML_TRAINING_DATA.length - 1 && (
                <div className="absolute top-1/2 -right-3 w-6 border-t-2 border-blue-200 border-dashed" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 mb-8">
        <div className="relative inline-block" onMouseLeave={() => setActiveTooltip("")}>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Target className="text-blue-500" />
            Test Prediction
            <Info
              className="w-5 h-5 text-blue-400 cursor-help"
              onMouseEnter={() => setActiveTooltip("test")}
            />
          </h3>
          {activeTooltip === "test" && (
            <div className="absolute z-10 -top-2 left-full ml-2 p-3 bg-blue-600 text-white text-sm rounded-lg w-64 shadow-lg">
              Choose a new input value and see if the model can predict the correct output!
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6 mb-6">
          <label className="text-gray-700 font-medium">Input Value:</label>
          <input
            type="range"
            min="5"
            max="10"
            value={selectedInput}
            onChange={(e) => setSelectedInput(parseInt(e.target.value))}
            className="w-64 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-blue-600 font-bold text-xl min-w-[2rem]">{selectedInput}</span>
        </div>

        <button
          onClick={() => {
            setIsLearning(true)
            setHasLearned(false)
            setShowHint(false)
          }}
          disabled={isLearning}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:from-blue-700 hover:to-blue-600 flex items-center gap-3 font-medium"
        >
          {isLearning ? (
            <>
              <Zap className="animate-bounce" />
              Learning Pattern...
            </>
          ) : (
            <>
              <Brain className="animate-pulse" />
              Predict Output
            </>
          )}
        </button>
      </div>

      {hasLearned && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl shadow-md animate-fadeIn">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
            <CheckCircle2 className="text-green-500" />
            Prediction Complete!
          </h3>
          <p className="text-gray-700 text-lg mb-4">
            For input <span className="font-bold text-blue-600">{selectedInput}</span>, 
            the predicted output is{" "}
            <span className="font-bold text-2xl text-green-600">{prediction}</span>
          </p>
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-blue-500 font-medium hover:text-blue-600 transition-colors duration-300"
            >
              🤔 Curious how it works?
            </button>
          )}
          {showHint && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-gray-600 animate-fadeIn">
              The model discovered the pattern: Output = Input × 2. It learned this from the training data!
            </div>
          )}
        </div>
      )}
    </div>
  )
}