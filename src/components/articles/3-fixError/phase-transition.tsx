"use client"
import { useState, useEffect } from "react"
import { Droplets, Flame, ThermometerSun, Waves, Info, Brain } from "lucide-react"

interface ComponentProps {}

type ParticleState = "solid" | "liquid" | "gas"

type TooltipContent = {
    [key in ParticleState]: string
}

const STATE_TOOLTIPS: TooltipContent = {
    solid: "Like a neural network with fixed weights - structured but rigid",
    liquid: "Balanced flexibility - like an AI system in optimal learning state",
    gas: "High entropy state - like an overheated model showing chaotic behavior"
}

export default function PhaseTransitionDemo({}: ComponentProps) {
    const [temperature, setTemperature] = useState<number>(0)
    const [state, setState] = useState<ParticleState>("solid")
    const [particles, setParticles] = useState<{x: number, y: number, rotation: number}[]>([])
    const [showTooltip, setShowTooltip] = useState<boolean>(false)

    useEffect(() => {
        const initialParticles = Array.from({ length: 30 }, (_, i) => ({
            x: (i % 6) * 50 + 25,
            y: Math.floor(i / 6) * 50 + 25,
            rotation: 0
        }))
        setParticles(initialParticles)
        return () => setParticles([])
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prev => prev.map(p => {
                const movement = {
                    x: state === "solid" ? 2 : state === "liquid" ? 8 : 15,
                    y: state === "solid" ? 2 : state === "liquid" ? 8 : 15,
                    rotation: state === "solid" ? 5 : state === "liquid" ? 15 : 30
                }

                return {
                    x: Math.max(0, Math.min(300, p.x + (Math.random() * movement.x - movement.x/2))),
                    y: Math.max(0, Math.min(300, p.y + (Math.random() * movement.y - movement.y/2))),
                    rotation: (p.rotation + Math.random() * movement.rotation) % 360
                }
            }))
        }, 100)

        return () => clearInterval(interval)
    }, [state])

    useEffect(() => {
        if (temperature < 33) setState("solid")
        else if (temperature < 66) setState("liquid")
        else setState("gas")
    }, [temperature])

    const getStateIcon = () => {
        const iconClass = "w-8 h-8 transition-all duration-300"
        switch(state) {
            case "solid": return <ThermometerSun className={`${iconClass} text-blue-600`} />
            case "liquid": return <Droplets className={`${iconClass} text-blue-400`} />
            case "gas": return <Waves className={`${iconClass} text-blue-200`} />
        }
    }

    return (
        <div className="flex flex-col items-center p-8 max-w-3xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl">
            <div className="flex items-center gap-4 mb-6">
                <Brain className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Phase Transitions in AI Systems
                </h2>
                <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="relative"
                >
                    <Info className="w-6 h-6 text-blue-400 hover:text-blue-500 transition-colors duration-300" />
                    {showTooltip && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-200">
                            {STATE_TOOLTIPS[state]}
                        </div>
                    )}
                </button>
            </div>

            <div className="relative w-[300px] h-[300px] mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden shadow-inner">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className={`absolute w-4 h-4 transform transition-all duration-300
                            ${state === "solid" ? "bg-blue-600 shadow-lg" : ""}
                            ${state === "liquid" ? "bg-blue-400 shadow-md" : ""}
                            ${state === "gas" ? "bg-blue-200 shadow-sm" : ""}`}
                        style={{
                            left: p.x,
                            top: p.y,
                            transform: `rotate(${p.rotation}deg)`,
                            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                        }}
                    />
                ))}
            </div>

            <div className="flex items-center gap-6 mb-6 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md">
                <Flame className="w-6 h-6 text-red-500" />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-64 h-3 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                {getStateIcon()}
            </div>

            <div className="text-center space-y-3 bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md w-full">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    Current State: {state.charAt(0).toUpperCase() + state.slice(1)}
                </p>
                <p className="text-base text-gray-600 dark:text-gray-300">
                    Observe how small temperature changes trigger dramatic transitions in particle behavior,
                    mirroring how AI systems can suddenly shift their performance patterns!
                </p>
            </div>
        </div>
    )
}