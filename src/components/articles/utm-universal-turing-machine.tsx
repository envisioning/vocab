"use client"
import { useState, useEffect } from "react"
import { Play, Pause, RotateCw, Code2, HardDrive, Binary, Cpu, Info, ArrowRight, Brain } from "lucide-react"

interface TuringState {
    position: number
    currentState: string
    tape: string[]
    isRunning: boolean
    speed: number
}

export default function UTMSimulator() {
    const [machine, setMachine] = useState<TuringState>({
        position: 5,
        currentState: "start",
        tape: Array(15).fill("0"),
        isRunning: false,
        speed: 800
    })

    const [showTooltip, setShowTooltip] = useState<number | null>(null)
    const [animation, setAnimation] = useState<number>(0)

    useEffect(() => {
        let animationFrame: number
        const animate = () => {
            setAnimation(prev => (prev + 1) % 360)
            animationFrame = requestAnimationFrame(animate)
        }
        animate()
        return () => cancelAnimationFrame(animationFrame)
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (machine.isRunning) {
            interval = setInterval(() => {
                setMachine(prev => ({
                    ...prev,
                    position: (prev.position + 1) % prev.tape.length,
                    tape: prev.tape.map((cell, idx) => 
                        idx === prev.position ? (cell === "0" ? "1" : "0") : cell
                    )
                }))
            }, machine.speed)
        }
        return () => clearInterval(interval)
    }, [machine.isRunning, machine.speed])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-8 space-y-8">
            <div className="flex items-center space-x-4 text-blue-400">
                <Brain className="w-10 h-10 animate-pulse text-blue-300" />
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
                    Universal Turing Machine
                </h1>
                <Code2 className="w-10 h-10 text-blue-300" style={{ transform: `rotate(${animation}deg)` }} />
            </div>

            <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-blue-500/20">
                <div className="flex space-x-1">
                    {machine.tape.map((cell, idx) => (
                        <div
                            key={idx}
                            className={`w-14 h-14 flex items-center justify-center text-2xl font-mono relative
                                ${idx === machine.position 
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' 
                                    : 'bg-gray-700 text-gray-300'}
                                transition-all duration-300 rounded-lg
                                ${cell === "1" ? 'border-2 border-green-400/50 shadow-green-400/20' : 'border-2 border-gray-600'}
                                hover:scale-110 cursor-pointer`}
                            onMouseEnter={() => setShowTooltip(idx)}
                            onMouseLeave={() => setShowTooltip(null)}
                        >
                            {cell}
                            {showTooltip === idx && (
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-xs text-white p-2 rounded whitespace-nowrap">
                                    Cell {idx}: Binary {cell}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                    <HardDrive className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setMachine(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                        className="flex items-center space-x-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 
                            text-white rounded-lg transition duration-300 shadow-lg hover:shadow-blue-500/50"
                    >
                        {machine.isRunning ? (
                            <><Pause className="w-6 h-6" /> <span>Pause Simulation</span></>
                        ) : (
                            <><Play className="w-6 h-6" /> <span>Start Simulation</span></>
                        )}
                    </button>

                    <button
                        onClick={() => setMachine({
                            position: 5,
                            currentState: "start",
                            tape: Array(15).fill("0"),
                            isRunning: false,
                            speed: 800
                        })}
                        className="flex items-center space-x-2 px-8 py-4 bg-gray-600 hover:bg-gray-700 
                            text-white rounded-lg transition duration-300 shadow-lg"
                    >
                        <RotateCw className="w-6 h-6" />
                        <span>Reset Tape</span>
                    </button>
                </div>

                <div className="max-w-lg text-center space-y-3 bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 text-lg text-blue-300">
                        <Info className="w-5 h-5" />
                        <span>Understanding the Universal Turing Machine</span>
                    </div>
                    <p className="text-gray-300">
                        Watch as our UTM processes information by reading and writing binary data (0s and 1s),
                        demonstrating how computers fundamentally work at their core.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                        <ArrowRight className="w-4 h-4" />
                        <span>The blue cell shows the current position of the read/write head</span>
                    </div>
                </div>
            </div>
        </div>
    )
}