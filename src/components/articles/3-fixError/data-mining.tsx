"use client"
import { useState, useEffect } from "react"
import { Database, Search, Sparkles, Brain, ChevronRight, ArrowRight, Info } from "lucide-react"

interface DataPattern {
  id: number
  category: "purchase" | "location" | "time" | "preference"
  value: number
  discovered: boolean
  insight: string
}

const TOOLTIPS = {
  raw: "Raw data is like a puzzle - lots of pieces waiting to be connected!",
  mining: "We're using AI to find valuable patterns in this data ocean",
  patterns: "Each discovered pattern reveals customer behavior insights",
  insights: "Transform raw numbers into actionable business strategies"
}

const DataMiningVisualizer = () => {
  const [patterns, setPatterns] = useState<DataPattern[]>([])
  const [activeTooltip, setActiveTooltip] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [insightCount, setInsightCount] = useState(0)

  useEffect(() => {
    const categories: DataPattern["category"][] = ["purchase", "location", "time", "preference"]
    const insights = [
      "Customers shop more on weekends",
      "Peak hours are 2-5 PM",
      "Popular in urban areas",
      "Preference for eco-products",
      "Seasonal buying patterns",
      "Social media influence"
    ]
    
    const initialPatterns: DataPattern[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      category: categories[Math.floor(Math.random() * categories.length)],
      value: Math.floor(Math.random() * 100),
      discovered: false,
      insight: insights[Math.floor(Math.random() * insights.length)]
    }))
    
    setPatterns(initialPatterns)
    return () => setPatterns([])
  }, [])

  const analyzeData = () => {
    setIsAnalyzing(true)
    let newPatterns = [...patterns]
    let discoveries = 0

    const analyze = () => {
      const undiscovered = newPatterns.filter(p => !p.discovered && p.value > 65)
      if (undiscovered.length > 0) {
        const index = newPatterns.findIndex(p => p.id === undiscovered[0].id)
        newPatterns[index] = { ...newPatterns[index], discovered: true }
        discoveries++
        setPatterns(newPatterns)
        setInsightCount(discoveries)
      } else {
        setIsAnalyzing(false)
      }
    }

    const timer = setInterval(analyze, 400)
    return () => clearInterval(timer)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Data Mining Explorer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover hidden patterns in the digital goldmine
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Database className="text-blue-500 h-6 w-6" />
              <h2 className="text-xl font-semibold dark:text-white">Pattern Discovery</h2>
              <Info 
                className="text-gray-400 cursor-help h-5 w-5"
                onMouseEnter={() => setActiveTooltip("raw")}
                onMouseLeave={() => setActiveTooltip("")}
              />
            </div>
            <button
              onClick={analyzeData}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Brain className={`h-5 w-5 ${isAnalyzing ? "animate-pulse" : ""}`} />
              Analyze Data
            </button>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {patterns.map((pattern) => (
              <div
                key={pattern.id}
                className={`relative p-4 rounded-xl transition-all duration-500 transform hover:scale-105
                  ${pattern.discovered 
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg" 
                    : "bg-gray-100 dark:bg-gray-700"}`}
              >
                {pattern.discovered && (
                  <>
                    <Sparkles className="absolute top-2 right-2 h-4 w-4 text-yellow-300 animate-pulse" />
                    <div className="absolute -bottom-12 left-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg text-xs opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
                      {pattern.insight}
                    </div>
                  </>
                )}
                <div className="text-center">
                  {pattern.category === "purchase" && "💳"}
                  {pattern.category === "location" && "📍"}
                  {pattern.category === "time" && "⏰"}
                  {pattern.category === "preference" && "❤️"}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Search className="text-purple-500" />
              <span className="text-lg font-medium dark:text-white">
                Insights Found: {insightCount}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <span>Raw Data</span>
              <ChevronRight className="h-4 w-4" />
              <span>Analysis</span>
              <ArrowRight className="h-4 w-4" />
              <span className="text-green-500 font-medium">Insights</span>
            </div>
          </div>
        </div>

        {activeTooltip && (
          <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-xl max-w-xs">
            {TOOLTIPS[activeTooltip as keyof typeof TOOLTIPS]}
          </div>
        )}
      </div>
    </div>
  )
}

export default DataMiningVisualizer