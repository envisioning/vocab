"use client"
import { useState, useEffect } from 'react'
import {
    Car, Radar, Camera, Brain, Eye, Trees, User,
    StopCircle, PlayCircle, RefreshCw, AlertCircle,
    Zap, MapPin, Shield, Info
} from 'lucide-react'

interface Obstacle {
    id: number
    type: 'user' | 'tree'
    position: { x: number; y: number }
}

interface TooltipProps {
    children: React.ReactNode
    content: string
    position?: 'top' | 'bottom' | 'left' | 'right'
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
    const positionClasses = {
        top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
        bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
        left: 'left-0 top-1/2 -translate-x-full -translate-y-1/2 -ml-2',
        right: 'right-0 top-1/2 translate-x-full -translate-y-1/2 ml-2'
    }

    const arrowClasses = {
        top: 'bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 rotate-45',
        bottom: 'top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45',
        left: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45',
        right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45'
    }

    return (
        <div className="relative inline-flex group">
            {children}
            <div className="absolute inset-0 z-40">
                <div className={`
          invisible opacity-0 group-hover:visible group-hover:opacity-100
          absolute ${positionClasses[position]} z-50
          transition-all duration-200 transform
        `}>
                    <div className="relative">
                        <div className="px-2 py-1 bg-gray-800 rounded text-xs text-white max-w-[140px] text-center">
                            {content}
                            <div className={`
                absolute w-2 h-2 bg-gray-800
                ${arrowClasses[position]}
              `} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AVLearning: React.FC = () => {
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [carPosition, setCarPosition] = useState<number>(0)
    const [detectedObjects, setDetectedObjects] = useState<number[]>([])
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [showIntro, setShowIntro] = useState<boolean>(true)

    const INITIAL_OBSTACLES: Obstacle[] = [
        // Pedestrians
        { id: 1, type: 'user', position: { x: 70, y: 40 } },
        { id: 2, type: 'user', position: { x: 20, y: 45 } },
        { id: 3, type: 'user', position: { x: 45, y: 42 } },
        { id: 4, type: 'user', position: { x: 85, y: 38 } },
        { id: 5, type: 'user', position: { x: 15, y: 35 } },
        // Trees along the scene
        { id: 6, type: 'tree', position: { x: 5, y: 25 } },
        { id: 7, type: 'tree', position: { x: 25, y: 28 } },
        { id: 8, type: 'tree', position: { x: 40, y: 30 } },
        { id: 9, type: 'tree', position: { x: 60, y: 32 } },
        { id: 10, type: 'tree', position: { x: 75, y: 35 } },
        { id: 11, type: 'tree', position: { x: 90, y: 30 } },
        { id: 12, type: 'tree', position: { x: 95, y: 28 } }
    ]

    useEffect(() => {
        if (!isRunning) {
            setCarPosition(0)
            setDetectedObjects([])
            setCurrentStep(0)
            return
        }

        const interval = setInterval(() => {
            setCarPosition(prev => {
                if (prev >= 100) {
                    setIsRunning(false)
                    return 0
                }
                return prev + 0.5
            })

            const detected = INITIAL_OBSTACLES.filter(obstacle => {
                const distance = Math.abs(obstacle.position.x - carPosition)
                return distance < 20
            }).map(o => o.id)

            setDetectedObjects(detected)
            // Change steps less frequently
            if (carPosition % 10 === 0) {
                setCurrentStep(prev => (prev + 1) % 4)
            }
        }, 50)

        return () => clearInterval(interval)
    }, [isRunning, carPosition])

    const steps = [
        {
            icon: Eye,
            text: "Perceive",
            description: "Multiple sensors scan the environment",
            color: "text-purple-500"
        },
        {
            icon: Brain,
            text: "Process",
            description: "AI analyzes sensor data",
            color: "text-blue-500"
        },
        {
            icon: MapPin,
            text: "Plan",
            description: "System calculates optimal path",
            color: "text-green-500"
        },
        {
            icon: Zap,
            text: "Act",
            description: "Vehicle executes planned actions",
            color: "text-amber-500"
        }
    ]

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            {/* Header Section */}
            <div className="relative rounded-xl p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">AV Simulation</h2>
                    <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
                        Experience how self-driving cars perceive and navigate their environment using advanced AI and sensor systems.
                    </p>
                </div>
            </div>

            {/* Main Simulation Area */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 p-4 flex gap-3">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                            } text-white transition-colors duration-300`}
                    >
                        {isRunning ?
                            <StopCircle className="w-5 h-5" /> :
                            <PlayCircle className="w-5 h-5" />
                        }
                        {isRunning ? "Stop" : "Start"}
                    </button>

                    <button
                        onClick={() => {
                            setIsRunning(false)
                            setCarPosition(0)
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Reset
                    </button>
                </div>

                {/* Simulation Viewport */}
                <div className="relative h-80 bg-gradient-to-b from-blue-50 to-gray-100 overflow-hidden">
                    {/* Sky */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-100" />

                    {/* Road */}
                    <div className="absolute bottom-0 w-full h-32">
                        <div className="absolute bottom-0 w-full h-24 bg-gray-700">
                            <div className="absolute top-1/2 w-full h-2 flex justify-around">
                                <div className="w-16 h-full bg-yellow-400" />
                                <div className="w-16 h-full bg-yellow-400" />
                                <div className="w-16 h-full bg-yellow-400" />
                                <div className="w-16 h-full bg-yellow-400" />
                                <div className="w-16 h-full bg-yellow-400" />
                            </div>
                        </div>
                    </div>

                    {/* Car */}
                    <div
                        className="absolute bottom-16 transition-all duration-300 transform"
                        style={{ left: `${carPosition}%` }}
                    >
                        <Tooltip content="Autonomous Vehicle" position="right">
                            <div>
                                <Car
                                    className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600"
                                    fill={detectedObjects.length > 0 ? "#93C5FD" : "#EFF6FF"}
                                />

                                {/* Sensor visualization */}
                                <div className={`absolute -inset-6 sm:-inset-8 border-2 rounded-full transition-colors duration-300 ${detectedObjects.length > 0 ? 'border-blue-400 bg-blue-50/20' : 'border-gray-300'
                                    }`} />
                            </div>
                        </Tooltip>
                    </div>

                    {/* Obstacles */}
                    {INITIAL_OBSTACLES.map((obstacle) => (
                        <div
                            key={obstacle.id}
                            className="absolute transition-all duration-300"
                            style={{
                                left: `${obstacle.position.x}%`,
                                top: `${obstacle.position.y}%`,
                                transform: `scale(${detectedObjects.includes(obstacle.id) ? 1.1 : 1})`,
                                opacity: detectedObjects.includes(obstacle.id) ? 1 : 0.7
                            }}
                        >
                            <Tooltip content={`${obstacle.type === 'user' ? 'Pedestrian' : 'Tree'}`} position="bottom">
                                {obstacle.type === 'user' ? (
                                    <User className={`w-8 h-8 sm:w-10 sm:h-10 ${detectedObjects.includes(obstacle.id) ? 'text-red-500' : 'text-gray-600'
                                        }`} />
                                ) : (
                                    <Trees className={`w-8 h-8 sm:w-10 sm:h-10 ${detectedObjects.includes(obstacle.id) ? 'text-green-600' : 'text-green-500'
                                        }`} />
                                )}
                            </Tooltip>
                        </div>
                    ))}
                </div>

                {/* Process Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-white">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon
                        return (
                            <div
                                key={index}
                                className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-700 ${currentStep === index && isRunning
                                        ? 'border-blue-500 bg-blue-50/80'
                                        : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <StepIcon className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${step.color}`} />
                                <h3 className="text-sm sm:text-base font-semibold text-gray-800">{step.text}</h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {step.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default AVLearning