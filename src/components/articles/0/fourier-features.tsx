'use client'
import { useState, useEffect } from 'react'
import { Waves, Play, Pause, Info } from 'lucide-react'

interface Point {
    x: number
    y1: number
    y2: number
}

const FourierFeaturesDemo = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [showTooltip, setShowTooltip] = useState<string | null>(null)
    const [points, setPoints] = useState<Point[]>([])
    const [phase, setPhase] = useState(0)
    const [frequency, setFrequency] = useState(2)
    const [amplitude, setAmplitude] = useState(1.5)

    // SVG dimensions and scaling
    const width = 800
    const height = 400
    const padding = 40
    const xScale = (width - 2 * padding) / (2 * Math.PI)
    const yScale = height / 6

    useEffect(() => {
        let frameId: number
        
        const animate = () => {
            setPhase(prev => (prev + 0.1) % (2 * Math.PI))
            frameId = requestAnimationFrame(animate)
        }
        
        if (isPlaying) {
            frameId = requestAnimationFrame(animate)
        }
        
        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId)
            }
        }
    }, [isPlaying])

    useEffect(() => {
        const newPoints: Point[] = []
        for (let i = 0; i <= 100; i++) {
            const x = (i / 100) * 2 * Math.PI
            const y1 = Math.sin(x)
            const y2 = Math.sin(frequency * x + phase) * amplitude
            newPoints.push({ x, y1, y2 })
        }
        setPoints(newPoints)
    }, [phase, frequency, amplitude])

    const createPath = (points: Point[], key: 'y1' | 'y2') => {
        return points.map((point, i) => {
            const x = point.x * xScale + padding
            const y = height / 2 - point[key] * yScale
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
        }).join(' ')
    }

    const gridLines = []
    for (let i = -3; i <= 3; i++) {
        const y = height / 2 - i * yScale
        gridLines.push(
            <line
                key={`h-${i}`}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="1"
            />
        )
    }
    for (let i = 0; i <= 6; i++) {
        const x = padding + i * (width - 2 * padding) / 6
        gridLines.push(
            <line
                key={`v-${i}`}
                x1={x}
                y1={padding}
                x2={x}
                y2={height - padding}
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="1"
            />
        )
    }

    return (
        <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto transition-colors duration-300">
            <div className="flex items-center gap-4 mb-6">
                <Waves className="w-6 md:w-8 h-6 md:h-8 text-blue-500" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Fourier Features Visualization
                </h2>
            </div>

            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm md:text-base text-blue-800 dark:text-blue-200">
                    The gray wave is your data. The blue wave shows how AI "sees" it differently.
                    Play with the controls to explore how AI learns from different perspectives.
                </p>
            </div>

            <div className="mb-8">
                <div className="flex flex-col gap-6 mb-4">
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`w-48 px-6 py-3 rounded-lg ${
                                isPlaying 
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } text-white flex items-center justify-center gap-2 transition-colors duration-300`}
                        >
                            {isPlaying ? (
                                <>
                                    <Pause className="w-4 md:w-5 h-4 md:h-5" />
                                    <span className="text-sm md:text-base">Pause Transform</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 md:w-5 h-4 md:h-5" />
                                    <span className="text-sm md:text-base">Start Transform</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['frequency', 'amplitude'].map((control) => (
                            <div key={control} className="relative">
                                <div className="flex flex-wrap items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                                        <span className="text-gray-600 dark:text-gray-300 font-medium text-sm md:text-base capitalize">
                                            {control}:
                                        </span>
                                        <button
                                            onClick={() => control === 'frequency' 
                                                ? setFrequency(prev => Math.max(0.5, prev - 0.5))
                                                : setAmplitude(prev => Math.max(0.5, prev - 0.5))
                                            }
                                            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 
                                                dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-medium text-gray-800 dark:text-gray-200">
                                            {(control === 'frequency' ? frequency : amplitude).toFixed(1)}
                                        </span>
                                        <button
                                            onClick={() => control === 'frequency'
                                                ? setFrequency(prev => Math.min(5, prev + 0.5))
                                                : setAmplitude(prev => Math.min(3, prev + 0.5))
                                            }
                                            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 
                                                dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <button
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                                            onMouseEnter={() => setShowTooltip(control)}
                                            onMouseLeave={() => setShowTooltip(null)}
                                        >
                                            <Info className="w-4 md:w-5 h-4 md:h-5 text-blue-500" />
                                        </button>
                                        {showTooltip === control && (
                                            <div className="absolute bottom-full right-0 mb-2 p-2 bg-blue-100 dark:bg-blue-900 
                                                rounded-lg shadow-lg z-10 w-48">
                                                <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200">
                                                    {control === 'frequency' 
                                                        ? 'Controls wave cycles - like zooming in/out'
                                                        : 'Controls wave height - like signal strength'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${width} ${height}`}
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {gridLines}
                        
                        <line
                            x1={padding}
                            y1={height / 2}
                            x2={width - padding}
                            y2={height / 2}
                            className="stroke-gray-400 dark:stroke-gray-500"
                            strokeWidth="2"
                        />
                        
                        <path
                            d={createPath(points, 'y1')}
                            fill="none"
                            className="stroke-gray-500 dark:stroke-gray-400"
                            strokeWidth="2"
                        />
                        
                        <path
                            d={createPath(points, 'y2')}
                            fill="none"
                            className="stroke-blue-500 dark:stroke-blue-400"
                            strokeWidth="2"
                        />
                        
                        <g transform={`translate(${width - padding - 150}, ${padding + 20})`}>
                            <line x1="0" y1="0" x2="20" y2="0" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
                            <text x="25" y="5" className="text-sm fill-gray-500 dark:fill-gray-400">Original Signal</text>
                            <line x1="0" y1="20" x2="20" y2="20" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
                            <text x="25" y="25" className="text-sm fill-blue-500 dark:fill-blue-400">Transformed Signal</text>
                        </g>
                    </svg>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    In real AI systems, multiple wave transformations combine to help models 
                    recognize complex patterns in data.
                </p>
            </div>
        </div>
    )
}

export default FourierFeaturesDemo