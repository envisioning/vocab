"use client"
import { useState, useEffect } from "react"
import { Calculator, Database, ChartBar, Brain, BarChart2, ArrowRight, Info } from "lucide-react"

interface DataPoint {
  id: number
  value: number
  color: string
}

interface StepInfo {
  title: string
  description: string
  icon: typeof Database | typeof Brain | typeof Calculator | typeof ChartBar
}

const STEPS: StepInfo[] = [
  {
    title: "Data Collection",
    description: "Gathering numerical samples for analysis",
    icon: Database
  },
  {
    title: "Data Processing",
    description: "Preparing and cleaning the dataset",
    icon: Brain
  },
  {
    title: "Statistical Analysis",
    description: "Computing mean and other metrics",
    icon: Calculator
  },
  {
    title: "Visualization",
    description: "Presenting results graphically",
    icon: ChartBar
  }
]

const StatisticalComputing = () => {
  const [data, setData] = useState<DataPoint[]>([])
  const [step, setStep] = useState<number>(0)
  const [mean, setMean] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  const colors = ["#3B82F6", "#22C55E", "#EC4899", "#EAB308", "#8B5CF6"]

  useEffect(() => {
    const generateData = () => {
      const newData = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        value: Math.floor(Math.random() * 100),
        color: colors[i]
      }))
      setData(newData)
    }
    generateData()
    return () => setData([])
  }, [])

  useEffect(() => {
    if (step === 2) {
      setIsProcessing(true)
      const calculatedMean = data.reduce((acc, curr) => acc + curr.value, 0) / data.length
      const timer = setTimeout(() => {
        setMean(calculatedMean)
        setIsProcessing(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [step, data])

  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 3))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-6 bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8 shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
          Statistical Computing Explorer
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {STEPS.map((stepInfo, i) => (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => setHoveredStep(i)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className={`p-3 md:p-4 rounded-lg transition-all duration-500 transform
                ${step >= i ? 'bg-blue-500 text-white scale-105' : 'bg-gray-200 dark:bg-gray-700'}
                ${step === i ? 'ring-4 ring-blue-300 dark:ring-blue-500' : ''}
              `}>
                <stepInfo.icon size={24} />
              </div>
              {hoveredStep === i && (
                <div className="absolute z-10 -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-2 rounded-lg text-sm w-48 text-center">
                  <p className="font-bold">{stepInfo.title}</p>
                  <p className="text-xs">{stepInfo.description}</p>
                </div>
              )}
              {i < 3 && step >= i && (
                <ArrowRight className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-8 h-48 relative">
          {step === 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 animate-fade-in">
              {data.map((point) => (
                <div key={point.id} className="flex flex-col items-center justify-end h-full">
                  <div
                    style={{ height: `${point.value}%`, backgroundColor: point.color }}
                    className="w-6 md:w-8 rounded-t-lg transition-all duration-500"
                  />
                  <span className="text-xs md:text-sm mt-2 dark:text-gray-300">{point.value}</span>
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Brain size={80} className="text-blue-500 animate-pulse" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Processing data patterns...</p>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Calculator size={80} className={`text-green-500 ${isProcessing ? 'animate-spin' : ''}`} />
              {!isProcessing && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                  Mean: {mean.toFixed(2)}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="w-full text-center space-y-4">
              <BarChart2 size={80} className="text-blue-500 mx-auto" />
              <div className="text-base md:text-lg dark:text-gray-300">
                Statistical analysis complete!
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleNextStep}
          disabled={step >= 3}
          className={`w-full py-3 rounded-lg text-white transition-all duration-300
            ${step >= 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}
          `}
        >
          {step >= 3 ? 'Analysis Complete!' : 'Next Step'}
        </button>
      </div>
    </div>
  )
}

export default StatisticalComputing