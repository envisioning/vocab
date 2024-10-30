'use client'
import { useState, useEffect } from 'react'
import { Cpu, Microchip, Play, Pause, RotateCcw } from 'lucide-react'

interface ProcessingUnit {
    id: number
    tasks: number[]
}

const GPUPoorComponent: React.FC = () => {
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [cpuUnits, setCpuUnits] = useState<ProcessingUnit[]>([
        { id: 1, tasks: [1, 2, 3, 4] }
    ])
    const [gpuUnits, setGpuUnits] = useState<ProcessingUnit[]>([
        { id: 1, tasks: [1, 2, 3, 4] },
        { id: 2, tasks: [5, 6, 7, 8] },
        { id: 3, tasks: [9, 10, 11, 12] },
        { id: 4, tasks: [13, 14, 15, 16] }
    ])
    const [progress, setProgress] = useState<number>(0)

    useEffect(() => {
        let animationFrame: number
        let startTime: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const elapsed = timestamp - startTime
            const newProgress = Math.min((elapsed / 3000) * 100, 100)
            
            setProgress(newProgress)
            
            if (isRunning && newProgress < 100) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        if (isRunning) {
            animationFrame = requestAnimationFrame(animate)
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
        }
    }, [isRunning])

    const handleReset = () => {
        setIsRunning(false)
        setProgress(0)
    }

    const handlePlayPause = () => {
        setIsRunning(!isRunning)
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Processing Power Comparison</h2>
            
            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <Cpu className="w-6 h-6 text-blue-500 mr-2" />
                    <span className="font-semibold">CPU Processing</span>
                    <span className="ml-2 text-sm text-gray-600">(Single-core processing, like doing tasks one at a time)</span>
                </div>
                <div className="grid grid-cols-1 gap-2 bg-gray-100 p-4 rounded-lg">
                    {cpuUnits.map(unit => (
                        <div key={unit.id} className="flex space-x-2">
                            {unit.tasks.map(task => (
                                <div
                                    key={task}
                                    className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm"
                                    style={{
                                        opacity: progress >= (task * 6.25) ? 0.3 : 1
                                    }}
                                >
                                    {task}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <Microchip className="w-6 h-6 text-green-500 mr-2" />
                    <span className="font-semibold">GPU Processing</span>
                    <span className="ml-2 text-sm text-gray-600">(Parallel processing, like having many helpers working together)</span>
                </div>
                <div className="grid grid-cols-4 gap-2 bg-gray-100 p-4 rounded-lg">
                    {gpuUnits.map(unit => (
                        <div key={unit.id} className="flex space-x-1">
                            {unit.tasks.map(task => (
                                <div
                                    key={task}
                                    className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs"
                                    style={{
                                        opacity: progress >= (task * 6.25) ? 0.3 : 1
                                    }}
                                >
                                    {task}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center space-x-4">
                <button
                    onClick={handlePlayPause}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    aria-label={isRunning ? 'Pause animation' : 'Start animation'}
                >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span className="ml-2">{isRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                    onClick={handleReset}
                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
                    aria-label="Reset animation"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span className="ml-2">Reset</span>
                </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
                Watch how GPU processes tasks in parallel (4x faster!) while CPU handles them one by one.
                {progress >= 100 && (
                    <div className="mt-2 text-green-500 font-semibold">
                        Processing complete! GPU wins the race! 🏆
                    </div>
                )}
            </div>
        </div>
    )
}

export default GPUPoorComponent