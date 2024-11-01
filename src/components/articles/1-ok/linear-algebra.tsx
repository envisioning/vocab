"use client"
import { useState, useEffect } from "react"
import { Vector, Move, Grid, ArrowRight, ArrowDown, Play, Pause, Info, RefreshCw, HelpCircle } from "lucide-react"

interface VectorState {
  x: number
  y: number
  color: string
  label: string
}

interface ComponentProps {}

const TOOLTIPS = {
  rotation: "Rotation transforms vectors by moving them around the origin while preserving their length",
  vectors: "Vectors are quantities with both direction and magnitude",
  grid: "The coordinate system helps us track vector positions",
  linear: "Linear transformations maintain proportional relationships between vectors"
}

const LinearAlgebraVisualizer: React.FC<ComponentProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<string>("")
  const [vectors, setVectors] = useState<VectorState[]>([
    { x: 2, y: 1, color: "#3B82F6", label: "v₁" },
    { x: 1, y: 2, color: "#22C55E", label: "v₂" }
  ])
  const [frame, setFrame] = useState<number>(0)

  useEffect(() => {
    let animationFrame: number

    const animate = () => {
      if (isPlaying) {
        setFrame((prev) => (prev + 1) % 360)
        animationFrame = requestAnimationFrame(animate)
      }
    }

    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isPlaying])

  const transformVectors = (frame: number) => {
    const angle = (frame * Math.PI) / 180
    return vectors.map((vector) => ({
      ...vector,
      x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
      y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
    }))
  }

  const gridSize = 400
  const scale = 40
  const center = gridSize / 2
  const transformedVectors = transformVectors(frame)

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl space-y-6 shadow-xl">
      <div className="flex items-center space-x-3">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
          Vector Transformation Studio
        </h2>
        <HelpCircle 
          className="w-6 h-6 text-gray-400 hover:text-blue-500 cursor-help transition-colors duration-300"
          onMouseEnter={() => setShowTooltip("linear")}
          onMouseLeave={() => setShowTooltip("")}
        />
      </div>

      <div className="relative w-[400px] h-[400px] border-2 border-gray-200 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/30" />
        
        {/* Grid lines */}
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={`grid-${i}`} className="grid-lines">
            <div className="absolute border-gray-100 h-full" style={{left: `${i * scale}px`, width: '1px'}} />
            <div className="absolute border-gray-100 w-full" style={{top: `${i * scale}px`, height: '1px'}} />
          </div>
        ))}

        {/* Axes */}
        <div className="absolute top-0 left-1/2 h-full w-[2px] bg-gray-300" />
        <div className="absolute left-0 top-1/2 w-full h-[2px] bg-gray-300" />

        {/* Vectors with Labels */}
        {transformedVectors.map((vector, index) => (
          <div key={index} className="absolute" style={{
            left: `${center + vector.x * scale}px`,
            top: `${center - vector.y * scale}px`
          }}>
            <div className="absolute h-[3px] origin-left transform shadow-sm"
              style={{
                width: `${Math.sqrt(Math.pow(vector.x * scale, 2) + Math.pow(vector.y * scale, 2))}px`,
                background: vector.color,
                transform: `rotate(${Math.atan2(-vector.y, vector.x)}rad)`
              }}
            />
            <span className="absolute -translate-y-6 text-sm font-semibold" style={{color: vector.color}}>
              {vector.label}
            </span>
          </div>
        ))}

        {showTooltip && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-3 rounded-lg shadow-lg text-sm text-gray-700 border border-gray-200">
            {TOOLTIPS[showTooltip as keyof typeof TOOLTIPS]}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span className="ml-2 font-medium">{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <div className="flex items-center space-x-2 text-gray-600">
          <RefreshCw className="w-5 h-5" />
          <span className="font-medium">{frame}°</span>
        </div>
      </div>

      <div className="flex space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
          <span>First Vector</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
          <span>Second Vector</span>
        </div>
      </div>
    </div>
  )
}

export default LinearAlgebraVisualizer