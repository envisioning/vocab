"use client"
import { useState, useEffect } from "react"
import { Brain, Eye, Lightbulb, Search, ArrowRight, Info, CheckCircle2, HelpCircle, Sparkles } from "lucide-react"

interface InterpretabilityProps {}

type Decision = {
    id: number
    input: string
    context: string
    reasoning: string[]
    output: string
    revealed: boolean
    explanation: string
}

const DECISIONS: Decision[] = [
    {
        id: 1,
        input: "🎓 College Application Review",
        context: "AI evaluating a student's application",
        reasoning: [
            "Academic Excellence: 4.0 GPA in Advanced Courses",
            "Leadership: Founded Coding Club",
            "Innovation: Created ML Project for Local Business",
            "Community Impact: 200+ Volunteer Hours"
        ],
        output: "Strong Acceptance Recommendation",
        revealed: false,
        explanation: "AI systems analyze multiple factors holistically to make fair decisions"
    },
    {
        id: 2,
        input: "🌍 Climate Pattern Analysis",
        context: "AI forecasting weather patterns",
        reasoning: [
            "Historical Data: 50 Years Analyzed",
            "Satellite Imagery: Cloud Formations",
            "Ocean Temperature Patterns",
            "Atmospheric Pressure Trends"
        ],
        output: "Predicted Weather Shift",
        revealed: false,
        explanation: "Complex environmental data is processed to understand climate changes"
    },
    {
        id: 3,
        input: "🎨 Art Style Recognition",
        context: "AI analyzing artistic elements",
        reasoning: [
            "Brush Stroke Patterns: Impressionist",
            "Color Palette: Warm Tones",
            "Composition: Rule of Thirds",
            "Historical Context: 19th Century"
        ],
        output: "Monet-Inspired Style",
        revealed: false,
        explanation: "Visual elements are broken down to understand artistic techniques"
    }
]

export default function InterpretabilityDemo({}: InterpretabilityProps) {
    const [decisions, setDecisions] = useState<Decision[]>(DECISIONS)
    const [activeDecision, setActiveDecision] = useState<Decision | null>(null)
    const [showTooltip, setShowTooltip] = useState<number | null>(null)

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowTooltip(null)
        }
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    const handleReveal = (id: number) => {
        setDecisions(prev => 
            prev.map(d => d.id === id ? {...d, revealed: true} : d)
        )
        setActiveDecision(decisions.find(d => d.id === id) || null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8 text-white">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <div className="relative">
                        <Brain className="w-14 h-14 text-blue-400" />
                        <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            AI Decision Journey Explorer
                        </h1>
                        <p className="text-gray-300 mt-2">Unveiling the thought process behind artificial intelligence decisions</p>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {decisions.map((decision) => (
                        <div
                            key={decision.id}
                            className={`relative bg-gray-800/40 backdrop-blur-lg p-6 rounded-xl border-2 transition-all duration-500
                                ${decision.revealed ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-700'}
                                hover:transform hover:-translate-y-2`}
                        >
                            <div className="absolute -top-3 -right-3">
                                <div className="relative">
                                    <HelpCircle
                                        className="w-6 h-6 text-blue-400 cursor-help transition-colors duration-300 hover:text-blue-300"
                                        onMouseEnter={() => setShowTooltip(decision.id)}
                                        onMouseLeave={() => setShowTooltip(null)}
                                    />
                                    {showTooltip === decision.id && (
                                        <div className="absolute right-0 w-64 p-4 mt-2 text-sm bg-gray-900 rounded-lg shadow-xl border border-blue-500 z-10">
                                            {decision.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div 
                                className="cursor-pointer group"
                                onClick={() => handleReveal(decision.id)}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                                    <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors duration-300">
                                        {decision.input}
                                    </h3>
                                </div>
                                
                                <p className="text-gray-400 text-sm mb-4">{decision.context}</p>
                                
                                {decision.revealed ? (
                                    <div className="space-y-3 animate-fadeIn">
                                        {decision.reasoning.map((reason, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm bg-gray-800/30 p-2 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                <span className="text-gray-300">{reason}</span>
                                            </div>
                                        ))}
                                        <div className="mt-6 pt-4 border-t border-gray-700">
                                            <div className="flex items-center gap-2 text-green-400 font-medium">
                                                <ArrowRight className="w-5 h-5" />
                                                <span>{decision.output}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 text-gray-400">
                                        <Eye className="w-6 h-6 mx-auto mb-2 animate-pulse" />
                                        <p>Click to reveal analysis</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}