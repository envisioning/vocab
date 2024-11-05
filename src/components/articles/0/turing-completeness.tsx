"use client"
import { useState, useEffect } from 'react'
import {
  Play,
  Brain,
  Infinity,
  PauseCircle,
  RefreshCcw,
  Zap,
  Binary
} from 'lucide-react'

type Mode = 'compute' | 'transform' | 'create'

interface Cell {
  value: string
  active: boolean
  processing: boolean
  highlight: boolean
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  cellBg: string
  controlBg: string
}

interface ColorScheme {
  light: ThemeColors
  dark: ThemeColors
}

const COLORS: ColorScheme = {
  light: {
    primary: 'rgba(59, 130, 246, 0.8)',
    secondary: 'rgba(139, 92, 246, 0.8)',
    accent: 'rgba(236, 72, 153, 0.8)',
    background: 'bg-gray-100',
    text: 'text-gray-900',
    cellBg: 'bg-white',
    controlBg: 'bg-gray-200'
  },
  dark: {
    primary: 'rgba(59, 130, 246, 0.8)',
    secondary: 'rgba(139, 92, 246, 0.8)',
    accent: 'rgba(236, 72, 153, 0.8)',
    background: 'bg-gray-900',
    text: 'text-white',
    cellBg: 'bg-gray-800',
    controlBg: 'bg-gray-800'
  }
}

const ArtisticTuringMachine = () => {
  const [isDark, setIsDark] = useState(false)
  const [cells, setCells] = useState<Cell[]>(() => 
    Array(15).fill(null).map((_, index) => ({
      value: Math.random() > 0.5 ? '1' : '0',
      active: index === 0,
      processing: index === 0,
      highlight: index === 0
    }))
  )
  const [headPosition, setHeadPosition] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [mode, setMode] = useState<Mode>('compute')
  const [cycleCount, setCycleCount] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const themeHandler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
    }
    mediaQuery.addEventListener('change', themeHandler)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      mediaQuery.removeEventListener('change', themeHandler)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const createParticle = (x: number, y: number): Particle => ({
    id: Math.random(),
    x,
    y,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    life: 1
  })

  const spawnParticles = (x: number, y: number, count: number) => {
    const newParticles = Array(count).fill(null).map(() => createParticle(x, y))
    setParticles(prev => [...prev, ...newParticles])
  }

  const toggleSimulation = () => {
    setIsRunning(prev => !prev)
  }

  const changeMode = () => {
    setMode(prev => {
      if (prev === 'compute') {
        return 'transform'
      }
      if (prev === 'transform') {
        return 'create'
      }
      return 'compute'
    })
    setCells(prev => prev.map(cell => ({ ...cell, highlight: false, processing: false })))
  }

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const interval = setInterval(() => {
      setCells(prev => {
        const next = [...prev]
        const current = next[headPosition]

        if (mode === 'compute') {
          next[headPosition] = {
            ...current,
            value: current.value === '1' ? '0' : '1',
            processing: true,
            highlight: true
          }
        } else if (mode === 'transform') {
          const target = (headPosition + 2) % next.length
          next[target] = { ...next[headPosition], highlight: true }
          next[headPosition] = { ...current, value: '0', processing: true }
        } else {
          next[headPosition] = {
            ...current,
            value: Math.random() > 0.7 ? '1' : '0',
            processing: true,
            highlight: true
          }
        }

        return next
      })

      setHeadPosition(prev => (prev + 1) % cells.length)
      setCycleCount(prev => prev + 1)

      const cellElement = document.getElementById(`cell-${headPosition}`)
      if (cellElement) {
        const rect = cellElement.getBoundingClientRect()
        spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 3)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [isRunning, headPosition, mode, cells.length])

  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02,
            vy: p.vy + 0.1
          }))
          .filter(p => p.life > 0)
      )
    }

    const animation = requestAnimationFrame(animateParticles)
    return () => cancelAnimationFrame(animation)
  }, [particles])

  const theme = isDark ? COLORS.dark : COLORS.light
  const isMobile = windowWidth < 640
  const isTablet = windowWidth < 1024

  return (
    <div className={`${theme.background} ${theme.text} px-4 sm:px-6 py-1 sm:py-2 flex flex-col items-center justify-center`}>
      <div className="relative w-full max-w-4xl py-4">
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-xl sm:text-3xl font-bold bg-gradient-to-r 
              ${isDark ? 'from-blue-400 via-purple-400 to-pink-400' :
                'from-blue-600 via-purple-600 to-pink-600'} 
              text-transparent bg-clip-text`}>
              Universal Computation
            </h1>
            <Infinity className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
          </div>
          {!isMobile && (
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>
              Witness the elegance of Turing completeness through symbolic manipulation
            </p>
          )}
        </div>

        <div className="relative mb-6 sm:mb-8">
          <div className="flex justify-center items-center gap-2">
            {cells.map((cell, index) => (
              <div
                id={`cell-${index}`}
                key={index}
                className={`w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg
                  transition-all duration-500 transform
                  ${cell.highlight ? 'scale-110' : 'scale-100'}
                  ${cell.processing ? 'bg-opacity-30' : 'bg-opacity-10'}
                  ${index === headPosition ? 'ring-2 ring-offset-2' : ''}
                  ${mode === 'compute' ? 'ring-blue-400 bg-blue-900' :
                    mode === 'transform' ? 'ring-purple-400 bg-purple-900' :
                      'ring-pink-400 bg-pink-900'}
                  ${isDark ? 'ring-offset-gray-900' : 'ring-offset-gray-100'}`}
              >
                <span className={`text-base sm:text-xl font-mono transition-all duration-300
                  ${cell.highlight ? 'opacity-100' : 'opacity-70'}`}>
                  {cell.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={toggleSimulation}
            className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-1.5 sm:py-2 rounded-full
              ${theme.controlBg} hover:bg-opacity-80
              transition-all duration-300 transform hover:scale-105`}
          >
            {isRunning ?
              <PauseCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> :
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            }
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={changeMode}
            className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-1.5 sm:py-2 rounded-full
              ${theme.controlBg} hover:bg-opacity-80
              transition-all duration-300 transform hover:scale-105`}
          >
            <Zap className={`w-4 h-4 sm:w-5 sm:h-5
              ${mode === 'compute' ? 'text-blue-400' :
                mode === 'transform' ? 'text-purple-400' :
                  'text-pink-400'}`}
            />
            <span>Change Mode</span>
          </button>
        </div>

        <div className="mt-4">
          <div className={`px-4 sm:px-6 py-4 sm:py-5 rounded-xl backdrop-blur-sm transition-all duration-500
            ${isDark ?
              (mode === 'compute' ? 'bg-blue-900/20' :
                mode === 'transform' ? 'bg-purple-900/20' :
                  'bg-pink-900/20') :
              (mode === 'compute' ? 'bg-blue-100/50' :
                mode === 'transform' ? 'bg-purple-100/50' :
                  'bg-pink-100/50')}`}>

            <h3 className={`text-base sm:text-lg font-semibold mb-3
              ${mode === 'compute' ? 'text-blue-600' :
                mode === 'transform' ? 'text-purple-600' :
                  'text-pink-600'}`}>
              {mode === 'compute' ? '🔄 Computing Mode' :
                mode === 'transform' ? '🔀 Transforming Mode' :
                  '✨ Creating Mode'}
            </h3>

            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm mb-4 leading-relaxed`}>
              {mode === 'compute' ?
                "This mode demonstrates the fundamental operation of a computer's processor (CPU). Just like how your computer processes 1s and 0s, the Turing machine reads each binary digit (0 or 1) and flips it to its opposite value (1 becomes 0, 0 becomes 1). This simple operation is the building block of all computer calculations!" :
                mode === 'transform' ?
                  "Think of this like a 'copy-paste' operation in your text editor, but for binary numbers. The machine reads a value from one position and writes it two cells ahead, showing how computers move data around in memory. This ability to move and manipulate data is crucial for tasks like sorting arrays or managing computer memory." :
                  "This mode showcases how computers can generate new patterns. Using probability (70/30 chance), the machine writes either 0 or 1 in each cell it visits. This is similar to how computers generate random numbers or create procedural content in video games!"}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <Binary className={`w-3 h-3 sm:w-4 sm:h-4 mr-1
                  ${mode === 'compute' ? 'text-blue-400' :
                    mode === 'transform' ? 'text-purple-400' :
                      'text-pink-400'}`} />
                <span>Value: {cells[headPosition]?.value}</span>
              </div>
              <div className="flex items-center justify-center">
                <RefreshCcw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1
                  ${mode === 'compute' ? 'text-blue-400' :
                    mode === 'transform' ? 'text-purple-400' :
                      'text-pink-400'}`} />
                <span>Cycles: {cycleCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtisticTuringMachine