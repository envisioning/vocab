"use client"
import { useState, useEffect } from "react"
import { Mic, Waveform, Brain, Speaker, Volume2, VolumeX, Info } from "lucide-react"

interface ComponentProps {}

type WavePoint = { x: number; y: number }
type StageInfo = { title: string; description: string; icon: JSX.Element }

const STAGES: StageInfo[] = [
  {
    title: "Audio Capture",
    description: "Microphone converts sound waves into electrical signals",
    icon: <Mic className="w-6 h-6 text-blue-500" />
  },
  {
    title: "Signal Analysis",
    description: "Converting audio into digital waveforms for processing",
    icon: <Waveform className="w-6 h-6 text-blue-500" />
  },
  {
    title: "Neural Processing",
    description: "AI algorithms interpret speech patterns and meaning",
    icon: <Brain className="w-6 h-6 text-blue-500" />
  },
  {
    title: "Speech Output",
    description: "Generating natural-sounding speech response",
    icon: <Speaker className="w-6 h-6 text-blue-500" />
  }
]

const SpeechProcessing = ({}: ComponentProps) => {
  const [isListening, setIsListening] = useState<boolean>(false)
  const [wavePoints, setWavePoints] = useState<WavePoint[]>([])
  const [processingStage, setProcessingStage] = useState<number>(0)
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)

  useEffect(() => {
    if (!isListening) {
      setWavePoints([])
      return
    }

    const points: WavePoint[] = []
    const interval = setInterval(() => {
      points.length = 0
      for (let i = 0; i < 30; i++) {
        points.push({
          x: i * 15,
          y: 50 + Math.sin(Date.now() / 200 + i) * (Math.random() * 15 + 10)
        })
      }
      setWavePoints([...points])
    }, 50)

    return () => clearInterval(interval)
  }, [isListening])

  useEffect(() => {
    if (!isListening) {
      setProcessingStage(0)
      return
    }

    const interval = setInterval(() => {
      setProcessingStage(prev => (prev + 1) % 4)
    }, 2000)

    return () => clearInterval(interval)
  }, [isListening])

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-gray-800 dark:text-gray-100">
        Speech Processing Technology
      </h2>

      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden p-4">
        <div className="h-32 sm:h-48 mb-16">
          <svg 
            className="w-full h-full"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            <path
              d={`M 0,50 ${wavePoints.map(p => `L ${p.x},${p.y}`).join(' ')}`}
              fill="none"
              stroke={isListening ? "#3B82F6" : "#6B7280"}
              strokeWidth="2"
              className="transition-colors duration-300"
            />
          </svg>
        </div>

        <div className="absolute bottom-0 w-full flex flex-wrap justify-around p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          {STAGES.map((stage, index) => (
            <div 
              key={index}
              className="relative group flex flex-col items-center p-2"
              onMouseEnter={() => setActiveTooltip(index)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                processingStage >= index ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {stage.icon}
              </div>
              <span className="text-xs sm:text-sm mt-1 dark:text-gray-200">{stage.title}</span>
              
              {activeTooltip === index && (
                <div className="absolute bottom-full mb-2 w-48 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-xs">
                  <p className="text-gray-700 dark:text-gray-300">{stage.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsListening(prev => !prev)}
        className={`mt-6 p-3 sm:p-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
          isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isListening ? (
          <VolumeX className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        )}
      </button>

      <p className="mt-4 text-center text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md">
        {isListening 
          ? "Processing speech patterns in real-time..."
          : "Click the button to start the speech processing simulation"}
      </p>
    </div>
  )
}

export default SpeechProcessing