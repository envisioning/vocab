"use client"
import { useState, useEffect } from "react"
import { Circle, ChevronRight, ChevronLeft, Info } from "lucide-react"

interface ComponentProps {}

type Distribution = {
  mean: number
  spread: number
  weight: number
  color: string
  label: string
}

const MixtureModelDemo: React.FC<ComponentProps> = () => {
  const [step, setStep] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [distributions, setDistributions] = useState<Distribution[]>([
    { mean: 25, spread: 10, weight: 0.4, color: "rgb(236, 72, 153)", label: "Group A: 40% of population" },
    { mean: 75, spread: 15, weight: 0.6, color: "rgb(139, 92, 246)", label: "Group B: 60% of population" }
  ])

  const calculateHeight = (x: number, dist: Distribution): number => {
    const variance = dist.spread * dist.spread
    return (dist.weight * Math.exp(-Math.pow(x - dist.mean, 2) / (2 * variance))) / Math.sqrt(2 * Math.PI * variance)
  }

  const calculateMixture = (x: number): number => {
    return distributions.reduce((sum, dist) => sum + calculateHeight(x, dist), 0)
  }

  useEffect(() => {
    if (isAnimating) {
      const timer = setInterval(() => {
        setDistributions(prev =>
          prev.map(d => ({
            ...d,
            mean: d.mean + Math.sin(Date.now() / 1000) * 0.5
          }))
        )
      }, 50)
      return () => clearInterval(timer)
    }
  }, [isAnimating])

  const steps = [
    { text: "Meet our population! We have two distinct groups...", hint: "Each curve represents a subpopulation with its own characteristics" },
    { text: "Each group follows its own normal distribution pattern...", hint: "Notice how the curves have different spreads and heights" },
    { text: "Together they form a mixture model!", hint: "The green curve shows how both groups combine" },
    { text: "Watch how they dance together...", hint: "See how changes in one group affect the overall mixture" }
  ]

  const renderCurves = () => {
    const points: JSX.Element[] = []
    for (let x = 0; x <= 100; x += 2) {
      distributions.forEach((dist, idx) => {
        const h = calculateHeight(x, dist)
        points.push(
          <Circle
            key={`dist-${idx}-${x}`}
            cx={x}
            cy={100 - h * 100}
            r={0.8}
            style={{ fill: dist.color }}
            className="opacity-40"
          />
        )
      })

      if (step > 1) {
        const h = calculateMixture(x)
        points.push(
          <Circle
            key={`mix-${x}`}
            cx={x}
            cy={100 - h * 100}
            r={1}
            className="fill-emerald-500"
          />
        )
      }
    }
    return points
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl max-w-4xl mx-auto">
      <div className="relative w-full mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
          {steps[step].text}
        </h2>
        <div className="absolute right-0 top-0">
          <button
            onMouseEnter={() => setShowTooltip(step)}
            onMouseLeave={() => setShowTooltip(null)}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Info className="w-5 h-5" />
          </button>
          {showTooltip === step && (
            <div className="absolute right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm w-64 z-10">
              {steps[step].hint}
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full h-64 sm:h-80 mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transform scale-y-[-1]"
          preserveAspectRatio="none"
        >
          {renderCurves()}
        </svg>
        <div className="absolute bottom-2 left-2 flex flex-col gap-2">
          {distributions.map((dist, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dist.color }}></div>
              <span className="text-gray-700 dark:text-gray-300">{dist.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 items-center">
        <button
          onClick={() => setStep(Math => Math > 0 ? Math - 1 : Math)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
          disabled={step === 0}
        >
          <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <button
          onClick={() => {
            if (step === steps.length - 1) {
              setIsAnimating(!isAnimating)
            } else {
              setStep(s => s + 1)
            }
          }}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition duration-300 flex items-center gap-2"
        >
          {step === steps.length - 1 ? (
            isAnimating ? "Stop Animation" : "Start Animation"
          ) : (
            <>
              Next <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default MixtureModelDemo