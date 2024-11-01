"use client"
import { useState, useEffect } from "react"
import { ArrowUpDown, Info, Scale, Ruler, Thermometer, Clock, Heart, Battery } from "lucide-react"

interface ScalarExample {
    name: string
    value: number
    icon: JSX.Element
    unit: string
    description: string
}

const ScalarVisualizer = () => {
    const [activeValue, setActiveValue] = useState<number>(50)
    const [hoveredExample, setHoveredExample] = useState<number | null>(null)
    const [pulseIndex, setPulseIndex] = useState<number>(0)

    const scalarExamples: ScalarExample[] = [
        { 
            name: "Temperature", 
            value: 37.5, 
            icon: <Thermometer className="w-8 h-8"/>, 
            unit: "°C",
            description: "Body temperature is a perfect scalar - one number tells us if you're healthy!"
        },
        { 
            name: "Heart Rate", 
            value: 72, 
            icon: <Heart className="w-8 h-8 text-red-500"/>, 
            unit: "bpm",
            description: "Your heartbeat is a scalar that shows how hard your heart is working."
        },
        { 
            name: "Battery Level", 
            value: 85, 
            icon: <Battery className="w-8 h-8 text-green-500"/>, 
            unit: "%",
            description: "Your phone's battery is a scalar between 0 and 100."
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setPulseIndex((prev) => (prev + 1) % scalarExamples.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-8">
                <h2 className="text-4xl font-bold text-gray-800 text-center">
                    Scalar Values
                </h2>
                <Info className="w-6 h-6 text-blue-500 cursor-help" />
            </div>

            <div className="relative mb-16 bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center justify-center mb-8">
                    <div className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                        {activeValue}
                    </div>
                </div>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeValue}
                    onChange={(e) => setActiveValue(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                />

                <div className="flex justify-between mt-4 text-lg font-semibold text-gray-600">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {scalarExamples.map((example, index) => (
                    <div 
                        key={index}
                        onMouseEnter={() => setHoveredExample(index)}
                        onMouseLeave={() => setHoveredExample(null)}
                        className={`relative bg-white p-6 rounded-xl shadow-lg transition-all duration-300
                            ${pulseIndex === index ? 'scale-105 ring-2 ring-blue-400' : ''}
                            hover:shadow-xl hover:-translate-y-1`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                {example.icon}
                            </div>
                            <span className="text-xl font-bold text-gray-800">
                                {example.name}
                            </span>
                        </div>
                        <div className="text-center mb-4">
                            <span className="text-3xl font-bold text-blue-600">
                                {example.value}
                            </span>
                            <span className="text-xl text-gray-600 ml-2">
                                {example.unit}
                            </span>
                        </div>
                        {hoveredExample === index && (
                            <div className="absolute inset-x-0 -bottom-2 transform translate-y-full p-4 bg-blue-600 text-white rounded-lg shadow-lg z-10">
                                <p className="text-sm">{example.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                <p className="text-center text-lg font-medium">
                    Think of a scalar as a single powerful number that tells a complete story. 
                    Like a movie rating or your score in a game - one number says it all!
                </p>
            </div>
        </div>
    )
}

export default ScalarVisualizer