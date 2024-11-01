"use client"
import { useState, useEffect } from "react"
import { Grid, Play, Pause, RotateCw, Sparkles, HelpCircle, ArrowRight } from "lucide-react"

interface MatrixProps {}

type Cell = {
  value: number
  highlighted: boolean
  result: boolean
}

type TooltipState = {
  show: boolean
  text: string
  position: { x: number; y: number }
}

const MatrixMultiplication: React.FC<MatrixProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [step, setStep] = useState<number>(0)
  const [tooltip, setTooltip] = useState<TooltipState>({ show: false, text: "", position: { x: 0, y: 0 } })
  const [matrix1] = useState<Cell[][]>([
    [{ value: 2, highlighted: false, result: false }, { value: 3, highlighted: false, result: false }],
    [{ value: 1, highlighted: false, result: false }, { value: 4, highlighted: false, result: false }]
  ])
  const [matrix2] = useState<Cell[][]>([
    [{ value: 1, highlighted: false, result: false }, { value: 2, highlighted: false, result: false }],
    [{ value: 3, highlighted: false, result: false }, { value: 1, highlighted: false, result: false }]
  ])
  const [resultMatrix, setResultMatrix] = useState<Cell[][]>([
    [{ value: 0, highlighted: false, result: true }, { value: 0, highlighted: false, result: true }],
    [{ value: 0, highlighted: false, result: true }, { value: 0, highlighted: false, result: true }]
  ])

  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      const totalSteps = 4
      if (step >= totalSteps) {
        setStep(0)
        setIsPlaying(false)
        return
      }

      const row = Math.floor(step / 2)
      const col = step % 2
      const result = matrix1[row].reduce((sum, cell, i) => sum + cell.value * matrix2[i][col].value, 0)
      
      setResultMatrix(prev => prev.map((r, i) => r.map((c, j) => 
        i === row && j === col ? { ...c, value: result, highlighted: true } : { ...c, highlighted: false }
      )))
      
      setStep(prev => prev + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [isPlaying, step])

  const renderMatrix = (matrix: Cell[][], label: string) => (
    <div className="relative group">
      <div className="absolute -top-8 left-0 right-0 text-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </div>
      <div className="grid gap-3 p-4 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-3">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-16 h-16 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-500
                  ${cell.highlighted ? 'bg-blue-500 text-white scale-110 shadow-lg' : 
                    cell.result ? 'bg-green-500 text-white' : 'bg-gray-100'}
                  transform hover:rotate-3`}
              >
                {cell.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8 flex flex-col items-center gap-12">
      <div className="text-4xl font-bold text-gray-800 flex items-center gap-3 relative">
        <Grid className="w-10 h-10 text-blue-500" />
        Matrix Multiplication Visualizer
        <HelpCircle
          className="w-6 h-6 text-blue-400 cursor-help transition-colors duration-300 hover:text-blue-600"
          onMouseEnter={(e) => setTooltip({
            show: true,
            text: "Matrix multiplication combines rows and columns to create new values!",
            position: { x: e.clientX, y: e.clientY }
          })}
          onMouseLeave={() => setTooltip({ show: false, text: "", position: { x: 0, y: 0 } })}
        />
      </div>

      <div className="flex items-center gap-8">
        {renderMatrix(matrix1, "Matrix A")}
        <div className="flex flex-col items-center gap-2">
          <ArrowRight className="w-8 h-8 text-blue-500" />
          <span className="text-4xl text-blue-500">×</span>
        </div>
        {renderMatrix(matrix2, "Matrix B")}
        <div className="flex flex-col items-center gap-2">
          <ArrowRight className="w-8 h-8 text-blue-500" />
          <span className="text-4xl text-blue-500">=</span>
        </div>
        {renderMatrix(resultMatrix, "Result")}
      </div>

      <div className="flex gap-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-3 px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {isPlaying ? 'Pause Animation' : 'Start Animation'}
        </button>
        
        <button
          onClick={() => {
            setStep(0)
            setIsPlaying(false)
            setResultMatrix([
              [{ value: 0, highlighted: false, result: true }, { value: 0, highlighted: false, result: true }],
              [{ value: 0, highlighted: false, result: true }, { value: 0, highlighted: false, result: true }]
            ])
          }}
          className="flex items-center gap-3 px-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <RotateCw className="w-6 h-6" />
          Reset
        </button>
      </div>

      {tooltip.show && (
        <div className="fixed bg-white p-4 rounded-lg shadow-xl text-gray-700 max-w-xs z-50 transition-all duration-300"
             style={{ left: tooltip.position.x + 10, top: tooltip.position.y - 10 }}>
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

export default MatrixMultiplication