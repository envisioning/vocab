"use client"
import { useState, useEffect } from "react"
import { Database, AlertCircle, CheckCircle, RefreshCcw, Info, Star, XCircle, BrainCircuit } from "lucide-react"

interface ComponentProps {}

type DataQuality = "good" | "bad"
type AnimationState = "idle" | "processing" | "complete"

const GIGODemonstrator: React.FC<ComponentProps> = () => {
    const [inputQuality, setInputQuality] = useState<DataQuality>("good")
    const [animationState, setAnimationState] = useState<AnimationState>("idle")
    const [showOutput, setShowOutput] = useState(false)
    const [showTooltip, setShowTooltip] = useState("")

    useEffect(() => {
        if (animationState === "processing") {
            const timer = setTimeout(() => {
                setAnimationState("complete")
                setShowOutput(true)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [animationState])

    const handleProcess = () => {
        setAnimationState("processing")
        setShowOutput(false)
    }

    const handleReset = () => {
        setAnimationState("idle")
        setShowOutput(false)
    }

    return (
        <div className="min-h-[500px] w-full max-w-3xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-6">
                <BrainCircuit className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Data Quality Matters
                </h2>
            </div>
            
            <p className="text-center text-gray-600 mb-8">
                Explore how the quality of input data directly affects AI model performance
            </p>

            <div className="flex flex-col items-center gap-8">
                <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
                    <div
                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                            inputQuality === "good"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white"
                        }`}
                        onClick={() => setInputQuality("good")}
                        onMouseEnter={() => setShowTooltip("good")}
                        onMouseLeave={() => setShowTooltip("")}
                    >
                        <div className="flex flex-col items-center">
                            <Database className="w-12 h-12 text-blue-500 mb-3" />
                            <h3 className="text-lg font-semibold">Clean Data</h3>
                            {showTooltip === "good" && (
                                <div className="absolute -top-12 left-0 right-0 bg-gray-800 text-white p-2 rounded text-sm">
                                    Properly formatted, accurate data
                                </div>
                            )}
                            <div className="flex mt-3 gap-2">
                                <Star className="w-4 h-4 text-blue-500" />
                                <Star className="w-4 h-4 text-blue-500" />
                                <Star className="w-4 h-4 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                            inputQuality === "bad"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white"
                        }`}
                        onClick={() => setInputQuality("bad")}
                        onMouseEnter={() => setShowTooltip("bad")}
                        onMouseLeave={() => setShowTooltip("")}
                    >
                        <div className="flex flex-col items-center">
                            <XCircle className="w-12 h-12 text-red-500 mb-3" />
                            <h3 className="text-lg font-semibold">Messy Data</h3>
                            {showTooltip === "bad" && (
                                <div className="absolute -top-12 left-0 right-0 bg-gray-800 text-white p-2 rounded text-sm">
                                    Inconsistent, incomplete, or incorrect data
                                </div>
                            )}
                            <div className="flex mt-3 gap-2">
                                <Star className="w-4 h-4 text-red-300" />
                                <Star className="w-4 h-4 text-red-300" />
                                <XCircle className="w-4 h-4 text-red-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative w-full h-24 bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                    <div
                        className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 transition-transform duration-500 ${
                            animationState === "processing" ? "translate-x-0" : "-translate-x-full"
                        }`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        {animationState === "processing" && (
                            <RefreshCcw className="w-8 h-8 text-white animate-spin" />
                        )}
                    </div>
                </div>

                {showOutput && (
                    <div
                        className={`flex items-center gap-4 p-6 rounded-xl shadow-lg ${
                            inputQuality === "good"
                                ? "bg-green-50 border-2 border-green-200"
                                : "bg-red-50 border-2 border-red-200"
                        }`}
                    >
                        {inputQuality === "good" ? (
                            <>
                                <CheckCircle className="w-10 h-10 text-green-500" />
                                <div>
                                    <h4 className="font-semibold text-green-700">Excellent Results!</h4>
                                    <p className="text-green-600">High accuracy and reliability</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-10 h-10 text-red-500" />
                                <div>
                                    <h4 className="font-semibold text-red-700">Poor Results</h4>
                                    <p className="text-red-600">Low accuracy and unreliable predictions</p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={handleProcess}
                        disabled={animationState === "processing"}
                        className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                        Process Data
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GIGODemonstrator