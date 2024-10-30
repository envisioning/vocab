"use client"
import { useState, useEffect } from "react"
import { Shirt, Sparkles, Brain, Ruler, AlertTriangle, CheckCircle2 } from "lucide-react"

interface ClothingItem {
  id: number
  style: string
  formality: number
  complexity: number
}

interface Prediction {
  id: number
  correct: boolean
  prediction: string
  actual: string
}

const BiasVarianceDilemma = () => {
  const [modelComplexity, setModelComplexity] = useState<number>(50)
  const [trainingData, setTrainingData] = useState<ClothingItem[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [bias, setBias] = useState<number>(0)
  const [variance, setVariance] = useState<number>(0)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)

  // Generate initial training data
  useEffect(() => {
    const initialData = Array.from({length: 10}, (_, i) => ({
      id: i,
      style: i % 2 === 0 ? "formal" : "casual",
      formality: Math.random() * 100,
      complexity: Math.random() * 100
    }))
    setTrainingData(initialData)
    return () => setTrainingData([])
  }, [])

  // Run predictions based on model complexity
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        const newPrediction = {
          id: predictions.length,
          correct: Math.random() > (modelComplexity > 50 ? 0.7 : 0.3),
          prediction: modelComplexity > 50 ? "formal" : "casual",
          actual: Math.random() > 0.5 ? "formal" : "casual"
        }
        setPredictions(prev => [...prev.slice(-4), newPrediction])
        
        // Update bias/variance based on complexity
        setBias(100 - modelComplexity)
        setVariance(modelComplexity)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isSimulating, modelComplexity])

  const handleComplexityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelComplexity(Number(e.target.value))
  }

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center mb-6 gap-2">
        <Brain className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">AI Fashion Designer Workshop</h1>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="flex items-center gap-2 mb-4">
            <Shirt className="w-5 h-5" />
            Training Data
          </h2>
          <div className="space-y-2">
            {trainingData.slice(0,5).map(item => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{item.style}</span>
                <span className="text-sm text-gray-500">
                  Formality: {item.formality.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" />
            Model Predictions
          </h2>
          <div className="space-y-2">
            {predictions.map(pred => (
              <div key={pred.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="flex items-center gap-2">
                  {pred.correct ? 
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  }
                  {pred.prediction}
                </span>
                <span className="text-sm text-gray-500">
                  Actual: {pred.actual}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow mb-6">
        <h2 className="flex items-center gap-2 mb-4">
          <Ruler className="w-5 h-5" />
          Model Controls
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Model Complexity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={modelComplexity}
              onChange={handleComplexityChange}
              className="w-full"
              aria-label="Adjust model complexity"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Simple (High Bias)</span>
              <span>Complex (High Variance)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Bias</div>
              <div className="text-xl font-bold">{bias}%</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Variance</div>
              <div className="text-xl font-bold">{variance}%</div>
            </div>
          </div>

          <button
            onClick={toggleSimulation}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            {isSimulating ? "Pause Simulation" : "Start Simulation"}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Experiment with different model complexities to find the optimal balance between bias and variance.</p>
        <p>Watch how the model's predictions change as you adjust the complexity.</p>
      </div>
    </div>
  )
}

export default BiasVarianceDilemma