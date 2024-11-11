"use client"
import { useState, useEffect } from "react"
import { Database, Image, FileText, Music, SplitSquareHorizontal, Shuffle, Info, ArrowRight } from "lucide-react"

interface DataPoint {
  id: number
  type: "image" | "text" | "audio" 
  color: string
}

const INITIAL_DATASET: DataPoint[] = [
  { id: 1, type: "image", color: "bg-blue-400/90" },
  { id: 2, type: "text", color: "bg-emerald-400/90" },
  { id: 3, type: "audio", color: "bg-amber-400/90" },
  { id: 4, type: "image", color: "bg-violet-400/90" },
  { id: 5, type: "text", color: "bg-rose-400/90" },
  { id: 6, type: "audio", color: "bg-orange-400/90" },
]

const TOOLTIPS = {
  training: "Used to teach the model patterns in the data. Like studying for an exam with practice questions.",
  validation: "Used during training to check if the model is learning well. Like doing practice tests.",
  testing: "Used only at the end to evaluate the final model. Like taking the final exam."
}

export default function DatasetVisualizer() {
  const [dataset, setDataset] = useState<DataPoint[]>(INITIAL_DATASET)
  const [split, setSplit] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(darkModeQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    darkModeQuery.addEventListener('change', handler)
    return () => darkModeQuery.removeEventListener('change', handler)
  }, [])

  const getIcon = (type: string) => {
    switch(type) {
      case "image": return <Image className="w-5 h-5 sm:w-6 sm:h-6" />
      case "text": return <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
      case "audio": return <Music className="w-5 h-5 sm:w-6 sm:h-6" />
    }
  }

  const handleShuffle = () => {
    setIsShuffling(true)
    const shuffled = [...dataset]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setDataset(shuffled)
    setTimeout(() => setIsShuffling(false), 500)
  }

  return (
    <div className={`w-full sm:aspect-[1.618/1] mx-auto p-3 sm:p-6 flex flex-col rounded-xl shadow-lg
      ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white' : 
                 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900'}`}>
      
      <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Dataset Splitting in Machine Learning
        </h1>
        <p className={`text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {split ? "Data is split into three parts for effective model development" : "Click 'Split' to see how we divide data for training"}
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 sm:gap-6">
        <div className="flex justify-center gap-3 sm:gap-4">
          <button
            onClick={handleShuffle}
            className={`flex items-center gap-2 px-4 py-2 text-sm sm:text-base rounded-lg 
              bg-gradient-to-r from-blue-500 to-blue-600 text-white 
              hover:from-blue-600 hover:to-blue-700 transition-all duration-300
              ${isShuffling ? 'animate-pulse' : ''}`}
          >
            <Shuffle className="w-4 h-4" />
            Shuffle Data
          </button>
          <button
            onClick={() => setSplit(!split)}
            className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base rounded-lg
              bg-gradient-to-r from-purple-500 to-purple-600 text-white 
              hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
          >
            <SplitSquareHorizontal className="w-4 h-4" />
            {split ? 'Show Combined' : 'Split Dataset'}
          </button>
        </div>

        <div className={`flex-1 flex flex-col ${split ? 'justify-between' : 'justify-center'}`}>
          {!split ? (
            <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">Complete Dataset</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">All available data points</p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {dataset.map((item) => (
                  <div
                    key={item.id}
                    className={`${item.color} p-3 sm:p-4 rounded-lg shadow-md flex items-center justify-center 
                      transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}
                  >
                    {getIcon(item.type)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="relative inline-block group">
                    <p className="text-lg font-semibold flex items-center gap-2 cursor-help">
                      Training Set <span className="text-sm text-slate-500">(60%)</span>
                      <Info className="w-4 h-4 opacity-50" />
                    </p>
                    <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 top-full mt-2
                      w-64 p-3 text-sm bg-black/90 text-white rounded shadow-lg z-50">
                      {TOOLTIPS.training}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {dataset.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className={`${item.color} p-3 sm:p-4 rounded-lg shadow-md flex items-center justify-center 
                        transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}
                    >
                      {getIcon(item.type)}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="relative inline-block group">
                      <p className="text-lg font-semibold flex items-center gap-2 cursor-help">
                        Validation Set <span className="text-sm text-slate-500">(20%)</span>
                        <Info className="w-4 h-4 opacity-50" />
                      </p>
                      <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 top-full mt-2
                        w-64 p-3 text-sm bg-black/90 text-white rounded shadow-lg z-50">
                        {TOOLTIPS.validation}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {dataset.slice(4, 5).map((item) => (
                      <div
                        key={item.id}
                        className={`${item.color} p-3 sm:p-4 rounded-lg shadow-md flex items-center justify-center 
                          transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}
                      >
                        {getIcon(item.type)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="relative inline-block group">
                      <p className="text-lg font-semibold flex items-center gap-2 cursor-help">
                        Test Set <span className="text-sm text-slate-500">(20%)</span>
                        <Info className="w-4 h-4 opacity-50" />
                      </p>
                      <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 top-full mt-2
                        w-64 p-3 text-sm bg-black/90 text-white rounded shadow-lg z-50">
                        {TOOLTIPS.testing}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {dataset.slice(5, 6).map((item) => (
                      <div
                        key={item.id}
                        className={`${item.color} p-3 sm:p-4 rounded-lg shadow-md flex items-center justify-center 
                          transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}
                      >
                        {getIcon(item.type)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}