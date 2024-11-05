"use client"
import { useState, useEffect } from "react"
import { Smile, Frown, Meh, Brain, Zap, Camera, Laptop, Info, Bot, Sparkles, Sun, Moon } from "lucide-react"

interface EmotionData {
  emotion: string
  icon: JSX.Element
  color: string
  confidence: number
  description: string
}

interface SystemTheme {
  isDark: boolean
  isSystemTheme: boolean
}

export default function AffectiveComputingDemo() {
  const [activeEmotion, setActiveEmotion] = useState<number>(0)
  const [processing, setProcessing] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [theme, setTheme] = useState<SystemTheme>({
    isDark: false,
    isSystemTheme: true
  })

  const emotions: EmotionData[] = [
    { 
      emotion: "Happy", 
      icon: <Smile className="w-12 h-12 md:w-16 md:h-16" />, 
      color: "text-yellow-400",
      confidence: 0.85,
      description: "Detection of upturned mouth corners, crinkled eyes, and raised cheeks"
    },
    { 
      emotion: "Sad", 
      icon: <Frown className="w-12 h-12 md:w-16 md:h-16" />, 
      color: "text-blue-400",
      confidence: 0.72,
      description: "Analysis of downturned expressions, furrowed brows, and drooping features"
    },
    { 
      emotion: "Neutral", 
      icon: <Meh className="w-12 h-12 md:w-16 md:h-16" />, 
      color: "text-gray-400",
      confidence: 0.93,
      description: "Balanced facial features with minimal emotional indicators"
    }
  ]

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (theme.isSystemTheme) {
        setTheme(prev => ({...prev, isDark: e.matches}))
      }
    }

    handleChange(mediaQuery)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme.isSystemTheme])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEmotion((prev) => (prev + 1) % emotions.length)
      setProcessing(true)
      const timeout = setTimeout(() => setProcessing(false), 1000)
      return () => clearTimeout(timeout)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const toggleTooltip = () => {
    setShowTooltip(prev => !prev)
  }

  const toggleTheme = () => {
    setTheme(prev => ({
      isDark: !prev.isDark,
      isSystemTheme: false
    }))
  }

  const resetToSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setTheme({
      isDark: mediaQuery.matches,
      isSystemTheme: true
    })
  }

  return (
    <div className={`${theme.isDark ? 'dark' : ''}`}>
      <div className="flex flex-col items-center justify-center min-h-[600px] p-4 md:p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label={theme.isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme.isDark ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
          {!theme.isSystemTheme && (
            <button
              onClick={resetToSystemTheme}
              className="text-sm px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              Reset to system theme
            </button>
          )}
        </div>

        <div className="max-w-3xl w-full space-y-4 md:space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center items-center space-x-3">
              <Bot className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Affective Computing
              </h1>
            </div>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
              Teaching machines to understand human emotions
            </p>
          </div>

          <div className="relative bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl border border-gray-200 dark:border-gray-700/50">
            <div className="mt-8 flex justify-center mb-4">
              <div className="flex items-center space-x-2 sm:space-x-4 pb-2">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 animate-pulse" />
                <div className="h-0.5 w-4 sm:w-16 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                <div className="h-0.5 w-4 sm:w-16 bg-gradient-to-r from-purple-400 to-green-400"></div>
                <Laptop className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </div>
            </div>

            <div className="flex justify-center mb-6 relative">
              <div className={`transform transition-all duration-500 ${processing ? 'scale-110' : 'scale-100'}`}>
                <div className={`w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700/50 backdrop-blur-sm ${emotions[activeEmotion].color} shadow-lg relative`}>
                  {emotions[activeEmotion].icon}
                  <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="min-h-[150px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-base md:text-lg lg:text-xl font-semibold">
                      {emotions[activeEmotion].emotion}
                    </span>
                    <Info 
                      className="w-4 h-4 md:w-5 md:h-5 text-gray-400 cursor-pointer hover:text-blue-400 transition-colors duration-300"
                      onClick={toggleTooltip}
                      role="button"
                      aria-label={showTooltip ? "Hide details" : "Show details"}
                    />
                  </div>
                  <span className="text-base md:text-lg lg:text-xl font-semibold text-blue-400">
                    {(emotions[activeEmotion].confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                    style={{ width: `${emotions[activeEmotion].confidence * 100}%` }}
                  ></div>
                </div>
                {showTooltip && (
                  <div className="mt-4 p-3 md:p-4 bg-gray-100 dark:bg-gray-700/70 backdrop-blur-sm rounded-lg text-xs md:text-sm lg:text-base">
                    {emotions[activeEmotion].description}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg md:text-xl font-semibold">Understanding Emotions</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              Affective computing bridges the gap between human emotions and artificial intelligence. 
              Using advanced computer vision and machine learning, AI systems can now detect subtle 
              facial expressions, voice patterns, and physiological signals to understand human 
              emotional states with increasing accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}