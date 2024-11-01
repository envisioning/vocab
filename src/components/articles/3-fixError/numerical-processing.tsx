"use client"
import { useState, useEffect } from "react"
import { Calculator, Brain, ChevronRight, BarChart3, Sigma, Binary, Info, Sparkles, ArrowRight } from "lucide-react"

interface ComponentProps {}

type DataPoint = {
    value: number
    color: string
    processed: boolean
    pattern?: string
}

const PATTERNS = ["Even", "Odd", "Prime", "Composite"]

const NumericalProcessingDemo = ({}: ComponentProps) => {
    const [data, setData] = useState<DataPoint[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [step, setStep] = useState(0)
    const [showTooltip, setShowTooltip] = useState<number | null>(null)

    useEffect(() => {
        const initialData = Array.from({ length: 8 }, () => ({
            value: Math.floor(Math.random() * 100),
            color: 'bg-gray-200',
            processed: false
        }))
        setData(initialData)
        return () => setData([])
    }, [])

    useEffect(() => {
        if (isProcessing && step < data.length) {
            const timer = setTimeout(() => {
                setData(prev => prev.map((d, i) => {
                    if (i === step) {
                        const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)]
                        return {
                            ...d,
                            color: 'bg-blue-500',
                            processed: true,
                            pattern
                        }
                    }
                    return d
                }))
                setStep(s => s + 1)
            }, 800)
            return () => clearTimeout(timer)
        } else if (step >= data.length) {
            setIsProcessing(false)
        }
    }, [isProcessing, step, data.length])

    const handleProcess = () => {
        setIsProcessing(true)
        setStep(0)
        setData(prev => prev.map(d => ({ ...d, color: 'bg-gray-200', processed: false, pattern: undefined })))
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold text-gray-800 flex items-center justify-center gap-3">
                        <Brain className="w-12 h-12 text-blue-500 animate-pulse" />
                        Numerical Processing
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                    </h1>
                    <p className="text-gray-600 text-lg">Explore how AI analyzes numerical patterns and relationships</p>
                </div>

                <div className="relative bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
                    <div className="absolute top-4 right-4">
                        <div className="group relative">
                            <Info className="w-6 h-6 text-blue-400 cursor-help" />
                            <div className="hidden group-hover:block absolute right-0 w-64 p-4 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
                                Watch as the AI processes each number and identifies patterns. Hover over processed numbers to see their classifications!
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Calculator className="w-8 h-8 text-blue-500" />
                            <span className="text-gray-700 text-xl font-medium">Pattern Recognition</span>
                        </div>
                        <button
                            onClick={handleProcess}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        >
                            {isProcessing ? "Processing..." : "Analyze Numbers"}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-8 gap-6">
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className={`relative h-36 ${item.color} rounded-xl transition-all duration-500 transform hover:scale-105 cursor-pointer shadow-md`}
                                onMouseEnter={() => setShowTooltip(index)}
                                onMouseLeave={() => setShowTooltip(null)}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-700">
                                        {item.value}
                                    </span>
                                </div>
                                {item.processed && (
                                    <>
                                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                                            <Binary className="w-5 h-5 text-blue-500 animate-bounce" />
                                        </div>
                                        {showTooltip === index && item.pattern && (
                                            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
                                                {item.pattern}
                                                <ArrowRight className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-90 w-4 h-4 text-gray-800" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-6 h-6 text-green-500" />
                            <span className="text-gray-600 font-medium">Analysis Progress</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Sigma className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-600 font-medium">
                                {step}/{data.length} numbers analyzed
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NumericalProcessingDemo