"use client"
import { useState, useEffect } from "react"
import {
    Box,
    Brain,
    Eye,
    EyeOff,
    Camera,
    Bot,
    Lightbulb,
    ChevronRight,
    HelpCircle,
    Stars
} from "lucide-react"

interface TooltipType {
    show: boolean
    content: string
    x: number
    y: number
}

interface PixelType {
    brightness: number
    key: string
}

interface PredictionType {
    input: string
    processing: boolean
    output: string | null
}

const GRID_SIZE = 16 // Number of pixels in each row/column

const TOOLTIPS = {
    camera: "In real life, we can see how cameras work internally",
    blackbox: "But in complex AI models, we can't see the internal process!",
    input: "We can only see what goes in...",
    output: "...and what comes out",
    brain: "Millions of calculations happen inside",
}

const PREDICTIONS = [
    { input: "🐱", output: "Cat" },
    { input: "🐕", output: "Dog" },
    { input: "🦜", output: "Bird" },
]

const animations = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
    50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
    100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
  }
`

export default function BlackBoxExplainer() {
    const [showInternals, setShowInternals] = useState<boolean>(false)
    const [pixels, setPixels] = useState<PixelType[]>([])
    const [tooltip, setTooltip] = useState<TooltipType>({
        show: false,
        content: "",
        x: 0,
        y: 0
    })
    const [prediction, setPrediction] = useState<PredictionType>({
        input: "",
        processing: false,
        output: null
    })

    // Initialize pixels
    useEffect(() => {
        const initialPixels = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
            brightness: 0,
            key: `pixel-${i}`
        }))
        setPixels(initialPixels)
    }, [])

    // Handle pixel animation
    useEffect(() => {
        if (prediction.processing) {
            const updatePixels = () => {
                setPixels(prevPixels =>
                    prevPixels.map(pixel => ({
                        ...pixel,
                        brightness: Math.random()
                    }))
                )
            }

            const interval = setInterval(updatePixels, 100)
            return () => clearInterval(interval)
        } else {
            setPixels(prev => prev.map(pixel => ({ ...pixel, brightness: 0 })))
        }
    }, [prediction.processing])

    const handlePredict = (input: string) => {
        setPrediction({ input, processing: true, output: null })
        setTimeout(() => {
            const result = PREDICTIONS.find(p => p.input === input)
            setPrediction({
                input,
                processing: false,
                output: result?.output || "Unknown"
            })
        }, 1500)
    }

    const handleMouseEnter = (content: string, e: React.MouseEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect()
        setTooltip({
            show: true,
            content,
            x: rect.left,
            y: rect.top - 10
        })
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 rounded-xl shadow-2xl">
            <style>{animations}</style>

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
                    <Bot className="text-blue-500" />
                    The AI Black Box
                    <Stars className="text-yellow-400" />
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Understanding what we can (and can't) see in AI systems
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Regular Camera Example */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        <Camera className="text-blue-500" />
                        Regular Camera
                    </h3>
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                        <div className="relative"
                            onMouseEnter={(e) => handleMouseEnter(TOOLTIPS.camera, e)}
                            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}>
                            <div className="absolute inset-0 bg-blue-500/10 rounded-lg" />
                            <Camera size={48} className="text-blue-500" />
                            <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
                                We can see inside! 🔍
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Black Box */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        <Brain className="text-blue-500" />
                        AI Model
                    </h3>
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                        onMouseEnter={(e) => handleMouseEnter(TOOLTIPS.blackbox, e)}
                        onMouseLeave={() => setTooltip({ ...tooltip, show: false })}>
                        <Box
                            size={48}
                            className={`text-gray-400 transition-all duration-500
                ${showInternals ? 'opacity-25' : 'opacity-100'}`}
                        />
                        {showInternals && (
                            <div className="absolute inset-0">
                                <div className="absolute inset-0 grid gap-0.5 p-4"
                                    style={{
                                        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                                        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
                                    }}>
                                    {pixels.map((pixel) => (
                                        <div
                                            key={pixel.key}
                                            className="bg-white dark:bg-gray-300 transition-all duration-150"
                                            style={{
                                                opacity: prediction.processing ? pixel.brightness * 0.7 : 0
                                            }}
                                        />
                                    ))}
                                </div>
                                <Brain
                                    size={48}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 z-10"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Interactive Demo */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                        <Lightbulb className="text-yellow-400" />
                        Try it yourself!
                    </h3>
                    <button
                        onClick={() => setShowInternals(!showInternals)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                        {showInternals ? <EyeOff size={18} /> : <Eye size={18} />}
                        {showInternals ? "Hide Internals" : "Show Internals"}
                    </button>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex gap-4">
                        {PREDICTIONS.map(({ input }) => (
                            <button
                                key={input}
                                onClick={() => handlePredict(input)}
                                className="text-4xl p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                            >
                                {input}
                            </button>
                        ))}
                    </div>

                    {prediction.input && (
                        <div className="flex items-center gap-4">
                            <div className="text-4xl animate-[float_2s_ease-in-out_infinite]">
                                {prediction.input}
                            </div>
                            <ChevronRight className="text-blue-500" />
                            <div className="w-48 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                {prediction.processing ? (
                                    <div className="w-full h-full">
                                        <div className="grid gap-0.5 w-full h-full p-2"
                                            style={{
                                                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                                                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
                                            }}>
                                            {pixels.map((pixel) => (
                                                <div
                                                    key={pixel.key}
                                                    className="bg-blue-500 dark:bg-blue-400 transition-all duration-150"
                                                    style={{
                                                        opacity: pixel.brightness * 0.7
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    prediction.output && (
                                        <span className="text-xl font-bold text-blue-500">
                                            {prediction.output}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tooltip */}
            {tooltip.show && (
                <div
                    className="fixed z-10 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl max-w-xs"
                    style={{
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                        transform: 'translateY(-100%)',
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    )
}