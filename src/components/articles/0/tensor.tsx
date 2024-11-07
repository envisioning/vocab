"use client"
import { useState, useEffect } from "react"
import { 
  Bot, 
  BrainCircuit,
  Minus,
  Square,
  Box,
  Sparkles
} from "lucide-react"

interface TensorDemoProps {}

type CellType = {
  value: number
  highlighted: boolean
}

const TensorDemo: React.FC<TensorDemoProps> = () => {
  const [dimension, setDimension] = useState<1 | 2 | 3>(1)
  const [cells, setCells] = useState<CellType[][][]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const generate3DTensor = () => {
      const newCells: CellType[][][] = Array(3)
        .fill(null)
        .map(() =>
          Array(3)
            .fill(null)
            .map(() =>
              Array(3)
                .fill(null)
                .map(() => ({
                  value: Math.floor(Math.random() * 9) + 1,
                  highlighted: false,
                }))
            )
        )
      setCells(newCells)
    }

    generate3DTensor()
    return () => setCells([])
  }, [])

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setCells(prev =>
          prev.map(layer =>
            layer.map(row =>
              row.map(cell => ({
                ...cell,
                highlighted: Math.random() > 0.7,
              }))
            )
          )
        )
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isAnimating])

  const dimensionInfo = {
    1: {
      title: "Vector (1D Tensor)",
      icon: Minus,
      description: "Like a line of numbers in a sequence, similar to a shopping list or a playlist of songs.",
    },
    2: {
      title: "Matrix (2D Tensor)",
      icon: Square,
      description: "Like a spreadsheet or a chessboard, organizing data in rows and columns.",
    },
    3: {
      title: "Cube (3D Tensor)",
      icon: Box,
      description: "Like a Rubik's cube, stacking 2D layers to represent complex data patterns.",
    },
  }

  const renderCell = (cell: CellType, key: string) => (
    <div
      key={key}
      className={`
        w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14
        flex items-center justify-center
        rounded-lg shadow-lg
        text-base md:text-lg lg:text-xl font-semibold
        transform transition-all duration-300
        ${cell.highlighted 
          ? "bg-blue-500 text-white scale-110 rotate-3"
          : "bg-white dark:bg-gray-700 hover:rotate-2"}
      `}
    >
      {cell.value}
    </div>
  )

  const renderTensor = () => {
    const info = dimensionInfo[dimension]

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 text-blue-500">
          <info.icon className="w-6 h-6 md:w-8 md:h-8" />
          <h2 className="text-xl md:text-2xl font-bold">{info.title}</h2>
        </div>

        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          {info.description}
        </p>

        <div className="relative">
          {dimension === 1 && (
            <div className="flex flex-wrap gap-3 justify-center p-4">
              {cells[0]?.[0]?.map((cell, i) => renderCell(cell, `1d-${i}`))}
            </div>
          )}

          {dimension === 2 && (
            <div className="grid gap-3 p-4">
              {cells[0]?.map((row, i) => (
                <div key={i} className="flex flex-wrap gap-3 justify-center">
                  {row.map((cell, j) => renderCell(cell, `2d-${i}-${j}`))}
                </div>
              ))}
            </div>
          )}

          {dimension === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cells.map((layer, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50
                    backdrop-blur-sm transition-transform duration-300
                    hover:scale-105 hover:rotate-1"
                >
                  {layer.map((row, j) => (
                    <div key={j} className="flex flex-wrap gap-2 justify-center mb-2">
                      {row.map((cell, k) => renderCell(cell, `3d-${i}-${j}-${k}`))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Understanding Tensors
          </h1>
        </div>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Explore how AI organizes and processes information using tensors
        </p>
      </header>

      <div className="flex flex-wrap gap-3 justify-center">
        {[1, 2, 3].map((dim) => (
          <button
            key={dim}
            onClick={() => setDimension(dim as 1 | 2 | 3)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              transition-all duration-300 transform
              ${dimension === dim
                ? "bg-blue-500 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-700 hover:scale-105"}
            `}
          >
            {(() => {
              const Icon = dimensionInfo[dim as 1 | 2 | 3].icon
              return <Icon size={20} />
            })()}
            <span className="hidden sm:inline">{dim}D Tensor</span>
          </button>
        ))}

        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            transition-all duration-300 transform
            ${isAnimating
              ? "bg-green-500 text-white"
              : "bg-white dark:bg-gray-700"}
            hover:scale-105
          `}
        >
          <Sparkles size={20} />
          <span className="hidden sm:inline">
            {isAnimating ? "Stop" : "Animate"}
          </span>
        </button>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
        {renderTensor()}
      </div>

      <footer className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-gray-800/50 rounded-lg">
        <Bot className="w-6 h-6 md:w-8 md:h-8 text-blue-500 shrink-0" />
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Think of tensors as the building blocks of artificial intelligence. 
          Just like your brain processes information in multiple dimensions 
          (combining sight, sound, and memory), AI uses tensors to understand 
          complex patterns in data. Each additional dimension allows for richer 
          and more sophisticated data representation!
        </p>
      </footer>
    </div>
  )
}

export default TensorDemo