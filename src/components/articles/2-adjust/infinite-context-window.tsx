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

interface Memory {
    id: number
    text: string
    angle: number
    distance: number
    size: number
    opacity: number
    color: string
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

const FINAL_INSIGHT = "The Infinite Context Window represents a breakthrough in AI's ability to process information. Unlike traditional models limited to fixed context lengths, this approach allows the AI to maintain and utilize the entire history of interaction. By preserving and accessing all previous context, the model can provide more accurate, consistent, and contextually aware responses, fundamentally changing how AI understands and processes information."

const POETIC_MEMORIES: Memory[] = [
    { id: 1, text: "Early context is fully preserved", angle: 0, distance: 10, size: 2, opacity: 0.9, color: "text-blue-400", active: false, type: 'memory', connections: [2, 7] },
    { id: 2, text: "No token window limitations", angle: 30, distance: 20, size: 3, opacity: 0.8, color: "text-purple-400", active: false, type: 'thought', connections: [1, 3] },
    { id: 3, text: "Maintains complete conversation history", angle: 60, distance: 30, size: 2.5, opacity: 0.7, color: "text-amber-400", active: false, type: 'dream', connections: [2, 4] },
    { id: 4, text: "Processes lengthy documents entirely", angle: 90, distance: 40, size: 2.8, opacity: 0.9, color: "text-indigo-400", active: false, type: 'memory', connections: [3, 5] },
    { id: 5, text: "Enhanced long-term comprehension", angle: 120, distance: 25, size: 2.2, opacity: 0.8, color: "text-cyan-400", active: false, type: 'dream', connections: [4, 6] },
    { id: 6, text: "How far back can AI remember?", angle: 150, distance: 35, size: 3, opacity: 0.9, color: "text-rose-400", active: false, type: 'question', connections: [5, 7] },
    { id: 7, text: "Unlimited contextual memory", angle: 180, distance: 15, size: 2.4, opacity: 0.7, color: "text-yellow-400", active: false, type: 'memory', connections: [6, 8] },
    { id: 8, text: "Better reasoning with full context", angle: 210, distance: 45, size: 2.6, opacity: 0.8, color: "text-emerald-400", active: false, type: 'dream', connections: [7, 9] },
    { id: 9, text: "No information loss over time", angle: 240, distance: 28, size: 2.3, opacity: 0.9, color: "text-violet-400", active: false, type: 'memory', connections: [8, 10] },
    { id: 10, text: "How does infinite memory work?", angle: 270, distance: 38, size: 2.7, opacity: 0.8, color: "text-fuchsia-400", active: false, type: 'question', connections: [9, 11] },
    { id: 11, text: "Advanced context processing", angle: 300, distance: 22, size: 2.5, opacity: 0.7, color: "text-teal-400", active: false, type: 'thought', connections: [10, 12] },
    { id: 12, text: "Seamless information retention", angle: 330, distance: 33, size: 2.9, opacity: 0.9, color: "text-orange-400", active: false, type: 'dream', connections: [11, 1] }
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

const InfiniteContextGalaxy: React.FC = () => {
    const [memories, setMemories] = useState<Memory[]>(POETIC_MEMORIES)
    const [isExpanding, setIsExpanding] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [insight, setInsight] = useState("")
    const [phase, setPhase] = useState<'initial' | 'exploring' | 'connecting' | 'revelation'>('initial')
    const [currentRevelation, setCurrentRevelation] = useState(0)
    const [currentRevelations, setCurrentRevelations] = useState<Revelation[]>([])
    const galaxyRef = useRef<HTMLDivElement>(null)

    // Function to get random revelations
    const getRandomRevelations = (): Revelation[] => {
        const shuffled = [...ALL_REVELATIONS].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, 3)
    }

    // Initialize random revelations on component mount
    useEffect(() => {
        setCurrentRevelations(getRandomRevelations())
    }, [])

    const animateGalaxy = async () => {
        // Reset and get new random revelations
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

        // Set final insight
        await new Promise(resolve => setTimeout(resolve, 300))
        setInsight(FINAL_INSIGHT)
    }

    const renderConnections = () => {
        if (phase !== 'connecting' && phase !== 'revelation') return null

        return memories.map(memory =>
            memory.connections.map(targetId => {
                const target = memories.find(m => m.id === targetId)
                if (!target) return null

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
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                        className="animate-pulse"
                    />
                )
            })
        )
    }
    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-xl text-white min-h-[800px]">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                        The Infinite Context Galaxy
                    </span>
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                </h2>
                <p className="text-gray-400 italic">
                    Where memories spiral through the cosmos of consciousness
                </p>
            </div>

            <div
                ref={galaxyRef}
                className="relative h-[500px] mb-8 overflow-hidden rounded-full"
                style={{
                    background: 'radial-gradient(circle at center, #1a1a3a 0%, #0a0a1a 100%)'
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
                                ${memory.color}`}
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                opacity: memory.opacity,
                            }}
                        >
                            <div className={`relative group cursor-pointer max-w-[150px]`}>
                                <Star
                                    className={`w-${memory.size} h-${memory.size} ${memory.active ? 'animate-pulse' : ''}`}
                                />
                                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full top-0
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap
                                    text-xs px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
                                    {memory.text}
                                </div>
                            </div>
                        </div>
                    )
                })}

                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
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

            {phase === 'revelation' && currentRevelations.length > 0 && (
                <div className="mb-8 text-center animate-fade-in">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 transform transition-all duration-1000">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => setCurrentRevelation(prev => Math.max(0, prev - 1))}
                                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                disabled={currentRevelation === 0}
                                aria-label="Previous revelation"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                {currentRevelations[currentRevelation]?.title}
                            </h3>
                            <button
                                onClick={() => setCurrentRevelation(prev => Math.min(currentRevelations.length - 1, prev + 1))}
                                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                disabled={currentRevelation === currentRevelations.length - 1}
                                aria-label="Next revelation"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-gray-300">
                            {currentRevelations[currentRevelation]?.text}
                        </p>
                        <div className="mt-4 flex justify-center gap-2">
                            {currentRevelations.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentRevelation(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${currentRevelation === idx ? 'bg-blue-400 w-4' : 'bg-gray-600'
                                        }`}
                                    aria-label={`Go to revelation ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center mb-8">
                <button
                    onClick={() => {
                        if (phase === 'revelation') {
                            setPhase('initial')
                            setIsExpanding(false)
                            setMemories(POETIC_MEMORIES)
                            setRotation(0)
                            setInsight("")
                            setCurrentRevelation(0)
                        } else {
                            animateGalaxy()
                        }
                    }}
                    disabled={phase === 'exploring' || phase === 'connecting'}
                    className={`
        px-8 py-4 rounded-full text-lg font-semibold
        transition-all duration-300 transform
        ${phase === 'exploring' || phase === 'connecting'
                            ? 'bg-gray-700 cursor-not-allowed'
                            : phase === 'revelation'
                                ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 hover:scale-105'
                                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105'}
    `}
                >
                    <span className="flex items-center gap-2">
                        {phase === 'initial' ? (
                            <>
                                <Sparkles className="w-6 h-6" />
                                Explore the Infinite
                            </>
                        ) : phase === 'exploring' ? (
                            <>
                                <Infinity className="w-6 h-6 animate-spin" />
                                Expanding Consciousness...
                            </>
                        ) : phase === 'connecting' ? (
                            <>
                                <Brain className="w-6 h-6 animate-pulse" />
                                Forming Connections...
                            </>
                        ) : (
                            <>
                                <Infinity className="w-6 h-6" />
                                ∞ Experience infinite times again
                            </>
                        )}
                    </span>
                </button>
            </div>

            {insight && (
                <div className="relative text-center animate-fade-in backdrop-blur-sm bg-black/20 rounded-xl p-8 border border-gray-800">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Quote className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                    <p className="text-lg font-serif leading-relaxed tracking-wide text-gray-300 px-4 py-6">
                        {insight}
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                </div>
            )}
        </div>
    )
}

export default InfiniteContextGalaxy

// Add to your global CSS:
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