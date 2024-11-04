// PART #01:
"use client"
import { useState, useEffect, useRef } from 'react'
import {
    Sparkles,
    Star,
    Moon,
    Sun,
    Binary,
    Wind,
    Infinity,
    Brain,
    Zap,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Quote
} from 'lucide-react'

// Theme type definition
type Theme = 'light' | 'dark'

// Memory interface with theme-aware styling
interface Memory {
    id: number
    text: string
    angle: number
    distance: number
    size: number
    opacity: number
    colorLight: string  // Color for light theme
    colorDark: string   // Color for dark theme
    active: boolean
    type: 'thought' | 'memory' | 'dream' | 'question'
    connections: number[]
}

interface Revelation {
    title: string
    text: string
}

interface InsightSection {
    text: string
    highlight: boolean
}

// Responsive font size utility
const getFontSize = (width: number): string => {
    if (width < 640) {
        return 'text-sm'  // Small screens
    }
    if (width < 768) {
        return 'text-base' // Medium screens
    }
    return 'text-lg'                    // Large screens
}
const FINAL_INSIGHT = "The Infinite Context Window represents a breakthrough in AI's ability to process information. Unlike traditional models limited to fixed context lengths, this approach allows the AI to maintain and utilize the entire history of interaction. By preserving and accessing all previous context, the model can provide more accurate, consistent, and contextually aware responses, fundamentally changing how AI understands and processes information."

const POETIC_MEMORIES: Memory[] = [
    {
        id: 1,
        text: "Early context is fully preserved",
        angle: 0,
        distance: 10,
        size: 2,
        opacity: 0.9,
        colorLight: "text-blue-600",
        colorDark: "text-blue-400",
        active: false,
        type: 'memory',
        connections: [2, 7]
    },
    {
        id: 2,
        text: "No token window limitations",
        angle: 30,
        distance: 20,
        size: 3,
        opacity: 0.8,
        colorLight: "text-purple-600",
        colorDark: "text-purple-400",
        active: false,
        type: 'thought',
        connections: [1, 3]
    },
    {
        id: 3,
        text: "Maintains complete conversation history",
        angle: 60,
        distance: 30,
        size: 2.5,
        opacity: 0.7,
        colorLight: "text-amber-600",
        colorDark: "text-amber-400",
        active: false,
        type: 'dream',
        connections: [2, 4]
    },
    {
        id: 4,
        text: "Processes lengthy documents entirely",
        angle: 90,
        distance: 40,
        size: 2.8,
        opacity: 0.9,
        colorLight: "text-indigo-600",
        colorDark: "text-indigo-400",
        active: false,
        type: 'memory',
        connections: [3, 5]
    },
    {
        id: 5,
        text: "Enhanced long-term comprehension",
        angle: 120,
        distance: 25,
        size: 2.2,
        opacity: 0.8,
        colorLight: "text-cyan-600",
        colorDark: "text-cyan-400",
        active: false,
        type: 'dream',
        connections: [4, 6]
    },
    {
        id: 6,
        text: "How far back can AI remember?",
        angle: 150,
        distance: 35,
        size: 3,
        opacity: 0.9,
        colorLight: "text-rose-600",
        colorDark: "text-rose-400",
        active: false,
        type: 'question',
        connections: [5, 7]
    },
    {
        id: 7,
        text: "Unlimited contextual memory",
        angle: 180,
        distance: 15,
        size: 2.4,
        opacity: 0.7,
        colorLight: "text-yellow-600",
        colorDark: "text-yellow-400",
        active: false,
        type: 'memory',
        connections: [6, 8]
    },
    {
        id: 8,
        text: "Better reasoning with full context",
        angle: 210,
        distance: 45,
        size: 2.6,
        opacity: 0.8,
        colorLight: "text-emerald-600",
        colorDark: "text-emerald-400",
        active: false,
        type: 'dream',
        connections: [7, 9]
    },
    {
        id: 9,
        text: "No information loss over time",
        angle: 240,
        distance: 28,
        size: 2.3,
        opacity: 0.9,
        colorLight: "text-violet-600",
        colorDark: "text-violet-400",
        active: false,
        type: 'memory',
        connections: [8, 10]
    },
    {
        id: 10,
        text: "How does infinite memory work?",
        angle: 270,
        distance: 38,
        size: 2.7,
        opacity: 0.8,
        colorLight: "text-fuchsia-600",
        colorDark: "text-fuchsia-400",
        active: false,
        type: 'question',
        connections: [9, 11]
    },
    {
        id: 11,
        text: "Advanced context processing",
        angle: 300,
        distance: 22,
        size: 2.5,
        opacity: 0.7,
        colorLight: "text-teal-600",
        colorDark: "text-teal-400",
        active: false,
        type: 'thought',
        connections: [10, 12]
    },
    {
        id: 12,
        text: "Seamless information retention",
        angle: 330,
        distance: 33,
        size: 2.9,
        opacity: 0.9,
        colorLight: "text-orange-600",
        colorDark: "text-orange-400",
        active: false,
        type: 'dream',
        connections: [11, 1]
    }
]

const ALL_REVELATIONS: Revelation[] = [
    {
        title: "No Token Limits",
        text: "Unlike traditional models limited to 2048 or 4096 tokens, Infinite Context Window allows processing of unlimited preceding text, enabling comprehensive document analysis."
    },
    {
        title: "Memory Persistence",
        text: "The model maintains perfect recall of all previous interactions in a conversation, eliminating the need to repeat or summarize earlier information."
    },
    {
        title: "Enhanced Reasoning",
        text: "By accessing the complete context, the model can make more accurate inferences and connections between different parts of a conversation or document."
    },
    {
        title: "Document Processing",
        text: "Entire books or lengthy documents can be processed at once, allowing for deeper analysis and more accurate responses to complex queries."
    },
    {
        title: "Context Integration",
        text: "The model seamlessly integrates information from different parts of the conversation, maintaining consistency across all responses."
    },
    {
        title: "Historical Reference",
        text: "All previous exchanges remain accessible, allowing the model to reference and build upon earlier discussions without information loss."
    },
    {
        title: "Pattern Recognition",
        text: "With access to complete context, the model can identify patterns and relationships across the entire conversation history."
    },
    {
        title: "Contextual Understanding",
        text: "The model develops a deeper understanding of the discussion by maintaining awareness of all previous context and nuances."
    },
    {
        title: "Information Retrieval",
        text: "Any piece of information from the conversation history can be instantly accessed and utilized in generating responses."
    },
    {
        title: "Long-form Analysis",
        text: "Complex documents can be analyzed in their entirety, enabling more comprehensive and accurate insights."
    },
    {
        title: "Memory Management",
        text: "The system efficiently manages and organizes vast amounts of contextual information without degradation over time."
    },
    {
        title: "Semantic Connections",
        text: "The model can form meaningful connections between concepts discussed at any point in the conversation."
    },
    {
        title: "Temporal Understanding",
        text: "The sequence and timing of information is preserved, allowing for better understanding of cause-and-effect relationships."
    },
    {
        title: "Knowledge Accumulation",
        text: "Information builds upon itself throughout the conversation, creating a rich, interconnected understanding of the topic."
    },
    {
        title: "Context Preservation",
        text: "No information is lost or forgotten as the conversation progresses, ensuring consistent and accurate responses."
    }
]

// Theme hook for system preference detection
const useTheme = (): Theme => {
    const [theme, setTheme] = useState<Theme>('dark')

    useEffect(() => {
        // Check system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
            setTheme(e.matches ? 'dark' : 'light')
        }

        // Set initial theme
        updateTheme(mediaQuery)

        // Listen for changes
        mediaQuery.addEventListener('change', updateTheme)

        return () => {
            mediaQuery.removeEventListener('change', updateTheme)
        }
    }, [])

    return theme
}

// Screen width hook for responsive font sizes
const useWindowWidth = () => {
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024)

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return width
}
// END OF PART #01

// PART #02:
const InfiniteContextGalaxy: React.FC = () => {
    // Core state
    const [memories, setMemories] = useState<Memory[]>(POETIC_MEMORIES)
    const [isExpanding, setIsExpanding] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [insight, setInsight] = useState("")
    const [phase, setPhase] = useState<'initial' | 'exploring' | 'connecting' | 'revelation'>('initial')
    const [currentRevelation, setCurrentRevelation] = useState(0)
    const [currentRevelations, setCurrentRevelations] = useState<Revelation[]>([])

    // Theme and responsive hooks
    const theme = useTheme()
    const windowWidth = useWindowWidth()
    const fontSize = getFontSize(windowWidth)

    // Refs
    const galaxyRef = useRef<HTMLDivElement>(null)

    // Get random revelations
    const getRandomRevelations = (): Revelation[] => {
        const shuffled = [...ALL_REVELATIONS].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, 3)
    }

    // Initialize random revelations on mount
    useEffect(() => {
        setCurrentRevelations(getRandomRevelations())
    }, [])

    // Animation sequence
    const animateGalaxy = async () => {
        // Reset and get new revelations
        setCurrentRevelations(getRandomRevelations())
        setPhase('exploring')
        setIsExpanding(true)
        setInsight("")
        let currentRotation = rotation

        // Phase 1: Spiral expansion
        const expandInterval = setInterval(() => {
            currentRotation += 0.5
            setRotation(currentRotation)
        }, 50)

        // Phase 2: Memory activation
        for (let i = 0; i < memories.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800))
            setMemories(prev => prev.map((m, idx) => ({
                ...m,
                active: idx === i
            })))
        }

        clearInterval(expandInterval)
        setIsExpanding(false)

        // Phase 3: Connection phase
        setPhase('connecting')
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Phase 4: Revelation phase
        setPhase('revelation')
        for (let i = 0; i < currentRevelations.length; i++) {
            setCurrentRevelation(i)
            await new Promise(resolve => setTimeout(resolve, 3000))
        }

        // Final insight
        await new Promise(resolve => setTimeout(resolve, 300))
        setInsight(FINAL_INSIGHT)
    }

    // Render connections between memories
    const renderConnections = () => {
        if (phase !== 'connecting' && phase !== 'revelation') {
            return null
        }

        return memories.map(memory =>
            memory.connections.map(targetId => {
                const target = memories.find(m => m.id === targetId)
                if (!target) {
                    return null
                }

                const startAngle = (memory.angle + rotation) * (Math.PI / 180)
                const endAngle = (target.angle + rotation) * (Math.PI / 180)

                const startX = Math.cos(startAngle) * memory.distance + 50
                const startY = Math.sin(startAngle) * memory.distance + 50
                const endX = Math.cos(endAngle) * target.distance + 50
                const endY = Math.sin(endAngle) * target.distance + 50

                return (
                    <line
                        key={`${memory.id}-${targetId}`}
                        x1={`${startX}%`}
                        y1={`${startY}%`}
                        x2={`${endX}%`}
                        y2={`${endY}%`}
                        stroke={theme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                        strokeWidth="1"
                        className="animate-pulse"
                    />
                )
            })
        )
    }

    // Reset galaxy state
    const resetGalaxy = () => {
        setPhase('initial')
        setIsExpanding(false)
        setMemories(POETIC_MEMORIES)
        setRotation(0)
        setInsight("")
        setCurrentRevelation(0)
    }

    // Handle theme-based background colors
    const getBackgroundStyle = () => {
        return theme === 'dark'
            ? 'radial-gradient(circle at center, #1a1a3a 0%, #0a0a1a 100%)'
            : 'radial-gradient(circle at center, #f0f9ff 0%, #e0f2fe 100%)'
    }

    // Get theme-based text color
    const getTextColor = (memory: Memory): string => {
        return theme === 'dark' ? memory.colorDark : memory.colorLight
    }
    // END OF PART #02

    // PART #03:
    return (
        <div className={`w-full max-w-4xl mx-auto p-4 md:p-6 rounded-lg shadow-xl 
            ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} 
            min-h-[600px] md:min-h-[800px] transition-colors duration-300`}>

            {/* Header Section */}
            <div className="text-center mb-6 md:mb-8">
                <h2 className={`text-2xl md:text-3xl font-bold flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4
                    ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <Sparkles className={`w-6 h-6 md:w-8 md:h-8 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                        The Infinite Context Galaxy
                    </span>
                    <Sparkles className={`w-6 h-6 md:w-8 md:h-8 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </h2>
                <p className={`text-sm md:text-base italic
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Where memories spiral through the cosmos of consciousness
                </p>
            </div>

            {/* Galaxy Visualization */}
            <div
                ref={galaxyRef}
                className="relative h-[400px] md:h-[500px] mb-6 md:mb-8 overflow-hidden rounded-full transition-all duration-300"
                style={{
                    background: getBackgroundStyle()
                }}
            >
                <svg className="absolute inset-0 w-full h-full">
                    {renderConnections()}
                </svg>

                {memories.map((memory) => {
                    const angle = memory.angle + rotation
                    const radian = (angle * Math.PI) / 180
                    const spiralFactor = isExpanding ? 1.5 : 1
                    const x = Math.cos(radian) * (memory.distance * spiralFactor) + 50
                    const y = Math.sin(radian) * (memory.distance * spiralFactor) + 50

                    return (
                        <div
                            key={memory.id}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000
                                ${memory.active ? 'scale-125 z-10' : 'scale-100'}
                                ${getTextColor(memory)}`}
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                opacity: memory.opacity,
                            }}
                        >
                            <div className="relative group cursor-pointer max-w-[120px] md:max-w-[150px]">
                                <Star
                                    className={`w-${memory.size} h-${memory.size} ${memory.active ? 'animate-pulse' : ''}`}
                                />
                                <div className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-full top-0
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap
                                    text-xs md:text-sm px-2 py-1 rounded-lg 
                                    ${theme === 'dark'
                                        ? 'bg-black/50 backdrop-blur-sm'
                                        : 'bg-white/70 backdrop-blur-sm shadow-sm'}`}>
                                    {memory.text}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Stars Background */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-1 h-1 rounded-full animate-twinkle
                                ${theme === 'dark' ? 'bg-white' : 'bg-gray-800'}`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                opacity: Math.random() * 0.5 + 0.25
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Revelations Section */}
            {phase === 'revelation' && currentRevelations.length > 0 && (
                <div className="mb-6 md:mb-8 text-center animate-fade-in">
                    <div className={`${theme === 'dark'
                        ? 'bg-black/30'
                        : 'bg-white/70'} 
                        backdrop-blur-sm rounded-lg p-4 md:p-6 transform transition-all duration-1000`}>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => setCurrentRevelation(prev => Math.max(0, prev - 1))}
                                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                                    transition-colors disabled:opacity-50`}
                                disabled={currentRevelation === 0}
                                aria-label="Previous revelation"
                            >
                                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                                {currentRevelations[currentRevelation]?.title}
                            </h3>
                            <button
                                onClick={() => setCurrentRevelation(prev => Math.min(currentRevelations.length - 1, prev + 1))}
                                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                                    transition-colors disabled:opacity-50`}
                                disabled={currentRevelation === currentRevelations.length - 1}
                                aria-label="Next revelation"
                            >
                                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                        <p className={`${fontSize} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {currentRevelations[currentRevelation]?.text}
                        </p>
                        <div className="mt-4 flex justify-center gap-2">
                            {currentRevelations.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentRevelation(idx)}
                                    className={`w-2 h-2 rounded-full transition-all 
                                        ${currentRevelation === idx ? 'bg-blue-500 w-4' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}
                                    aria-label={`Go to revelation ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Control Button */}
            <div className="flex justify-center mb-6 md:mb-8">
                <button
                    onClick={() => phase === 'revelation' ? resetGalaxy() : animateGalaxy()}
                    disabled={phase === 'exploring' || phase === 'connecting'}
                    className={`
                        px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold
                        transition-all duration-300 transform
                        ${phase === 'exploring' || phase === 'connecting'
                            ? theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                            : theme === 'dark'
                                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105'
                                : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:scale-105'
                        }
                        ${phase === 'exploring' || phase === 'connecting' ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                >
                    <span className="flex items-center gap-2">
                        {phase === 'initial' ? (
                            <>
                                <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                                Explore the Infinite
                            </>
                        ) : phase === 'exploring' ? (
                            <>
                                <Infinity className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                                Expanding Consciousness...
                            </>
                        ) : phase === 'connecting' ? (
                            <>
                                <Brain className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                                Forming Connections...
                            </>
                        ) : (
                            <>
                                <Infinity className="w-5 h-5 md:w-6 md:h-6" />
                                Try infinite times again
                            </>
                        )}
                    </span>
                </button>
            </div>

            {/* Final Insight */}
            {insight && (
                <div className={`relative text-center animate-fade-in backdrop-blur-sm 
        ${theme === 'dark' ? 'bg-black/20' : 'bg-white/20'} 
        rounded-xl p-4 md:p-8 border 
        ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Quote className={`w-6 h-6 md:w-8 md:h-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <div className={`h-px bg-gradient-to-r from-transparent 
            ${theme === 'dark' ? 'via-gray-700' : 'via-gray-300'} 
            to-transparent`} />
                    <p className={`text-xs sm:text-sm md:text-base lg:text-lg font-serif leading-relaxed tracking-wide 
            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} 
            px-2 sm:px-3 md:px-4 py-4 md:py-6`}>
                        {insight}
                    </p>
                    <div className={`h-px bg-gradient-to-r from-transparent 
            ${theme === 'dark' ? 'via-gray-700' : 'via-gray-300'} 
            to-transparent`} />
                </div>
            )}
        </div>
    )
}

export default InfiniteContextGalaxy;
// END OF PART #03

// Added to my global CSS:
/*
@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.8; }
}

.animate-twinkle {
  animation: twinkle 3s infinite;
}

.animate-fade-in {
  animation: fadeIn 2s forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
*/

