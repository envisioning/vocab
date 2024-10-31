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

    // Create grid lines
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
                stroke="#e5e7eb"
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
                stroke="#e5e7eb"
                strokeWidth="1"
            />
        )
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Waves className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                    Fourier Features Visualization
                </h2>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                    Press Play to animate the wave transformation. The blue wave will move 
                    continuously, showing how Fourier features transform data patterns 
                    using sine waves.
                </p>
            </div>

            <div className="mb-8">
                <div className="flex flex-col gap-6 mb-4">
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`px-6 py-3 rounded-lg ${
                                isPlaying ? 'bg-red-500' : 'bg-blue-500'
                            } text-white flex items-center gap-2 transition-colors duration-300`}
                        >
                            {isPlaying ? (
                                <>
                                    <Pause className="w-5 h-5" />
                                    Pause Wave Transform
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5" />
                                    Start Wave Transform
                                </>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                                <span className="text-gray-600 font-medium min-w-24">Frequency:</span>
                                <button
                                    onClick={() => setFrequency(prev => Math.max(0.5, prev - 0.5))}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-medium">
                                    {frequency.toFixed(1)}
                                </span>
                                <button
                                    onClick={() => setFrequency(prev => Math.min(5, prev + 0.5))}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    +
                                </button>
                                <button
                                    className="ml-2"
                                    onMouseEnter={() => setShowTooltip('frequency')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                >
                                    <Info className="w-5 h-5 text-blue-500" />
                                </button>
                                {showTooltip === 'frequency' && (
                                    <div className="absolute top-full left-0 mt-2 p-3 bg-blue-100 rounded-lg shadow-lg z-10 w-64">
                                        <p className="text-sm text-blue-800">
                                            Frequency controls how many cycles the wave completes. 
                                            Higher frequency means more oscillations, helping detect 
                                            finer patterns in data.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                                <span className="text-gray-600 font-medium min-w-24">Amplitude:</span>
                                <button
                                    onClick={() => setAmplitude(prev => Math.max(0.5, prev - 0.5))}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-medium">
                                    {amplitude.toFixed(1)}
                                </span>
                                <button
                                    onClick={() => setAmplitude(prev => Math.min(3, prev + 0.5))}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    +
                                </button>
                                <button
                                    className="ml-2"
                                    onMouseEnter={() => setShowTooltip('amplitude')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                >
                                    <Info className="w-5 h-5 text-blue-500" />
                                </button>
                                {showTooltip === 'amplitude' && (
                                    <div className="absolute top-full left-0 mt-2 p-3 bg-blue-100 rounded-lg shadow-lg z-10 w-64">
                                        <p className="text-sm text-blue-800">
                                            Amplitude controls the height of the wave. 
                                            This represents the strength of the feature, 
                                            showing how much influence it has in the transformed space.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg overflow-hidden">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${width} ${height}`}
                        preserveAspectRatio="xMidYMid meet"
                        className="bg-white"
                    >
                        {/* Grid */}
                        {gridLines}
                        
                        {/* Axis */}
                        <line
                            x1={padding}
                            y1={height / 2}
                            x2={width - padding}
                            y2={height / 2}
                            stroke="#94a3b8"
                            strokeWidth="2"
                        />
                        
                        {/* Original wave */}
                        <path
                            d={createPath(points, 'y1')}
                            fill="none"
                            stroke="#6B7280"
                            strokeWidth="2"
                        />
                        
                        {/* Transformed wave */}
                        <path
                            d={createPath(points, 'y2')}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="2"
                        />
                        
                        {/* Legend */}
                        <g transform={`translate(${width - padding - 150}, ${padding + 20})`}>
                            <line x1="0" y1="0" x2="20" y2="0" stroke="#6B7280" strokeWidth="2" />
                            <text x="25" y="5" className="text-sm" fill="#6B7280">Original Signal</text>
                            <line x1="0" y1="20" x2="20" y2="20" stroke="#3B82F6" strokeWidth="2" />
                            <text x="25" y="25" className="text-sm" fill="#3B82F6">Transformed Signal</text>
                        </g>
                    </svg>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
                <h3 className="font-medium text-gray-800 mb-2">What am I looking at?</h3>
                <p className="mb-2">
                    The gray line shows the original data pattern, while the blue line shows 
                    how Fourier features transform this pattern using sine waves. This 
                    transformation helps AI models recognize complex patterns by viewing data 
                    from different perspectives.
                </p>
                <p>
                    Try playing with frequency and amplitude to see how these parameters 
                    affect the transformation. In real AI applications, many such 
                    transformations are combined to help models learn sophisticated patterns.
                </p>
            </div>
        </div>
    )
}

export default FourierFeaturesDemo