"use client"
import { useState, useEffect } from "react"
import { Grid, Play, Pause, RotateCw, HelpCircle, ArrowRight } from "lucide-react"

interface MatrixCell {
  value: number
  highlighted: boolean
  result: boolean
}

interface ComponentProps {}

const MatrixMultiplication: React.FC<ComponentProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [step, setStep] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [matrixA, setMatrixA] = useState<MatrixCell[][]>([
    [{ value: 1, highlighted: false, result: false }, { value: 2, highlighted: false, result: false }],
    [{ value: 3, highlighted: false, result: false }, { value: 4, highlighted: false, result: false }]
  ])
  const [matrixB, setMatrixB] = useState<MatrixCell[][]>([
    [{ value: 5, highlighted: false, result: false }, { value: 6, highlighted: false, result: false }],
    [{ value: 7, highlighted: false, result: false }, { value: 8, highlighted: false, result: false }]
  ])
  const [result, setResult] = useState<MatrixCell[][]>([
    [{ value: 0, highlighted: false, result: true }, { value: 0, highlighted: false, result: true }],
    [{ value: 0, highlighted: false, result: true }, { value: 0, highlighted: false, result: true }]
  ])

  const resetHighlights = () => {
    const resetMatrix = (matrix: MatrixCell[][]) =>
      matrix.map(row => row.map(cell => ({ ...cell, highlighted: false })))
    setMatrixA(resetMatrix(matrixA))
    setMatrixB(resetMatrix(matrixB))
    setResult(resetMatrix(result))
  }

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      resetHighlights()
      const row = Math.floor(step / 2)
      const col = step % 2
      
      const newMatrixA = [...matrixA]
      const newMatrixB = [...matrixB]
      const newResult = [...result]

      newMatrixA[row][0].highlighted = true
      newMatrixA[row][1].highlighted = true
      newMatrixB[0][col].highlighted = true
      newMatrixB[1][col].highlighted = true
      
      const sum = matrixA[row][0].value * matrixB[0][col].value + matrixA[row][1].value * matrixB[1][col].value
      
      newResult[row][col] = { value: sum, highlighted: true, result: true }

      setMatrixA(newMatrixA)
      setMatrixB(newMatrixB)
      setResult(newResult)

      if (step >= 3) {
        setIsPlaying(false)
        setStep(0)
      } else {
        setStep(prev => prev + 1)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [isPlaying, step])

  const renderMatrix = (matrix: MatrixCell[][], label: string) => (
    <div className="relative group">
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-700">
        {label}
      </div>
      <div className="grid grid-rows-2 gap-3 p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg">
        {matrix.map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`
                  flex items-center justify-center w-16 h-16 text-xl font-bold
                  rounded-xl transition-all duration-500 transform
                  ${cell.highlighted ? 'bg-blue-500 text-white scale-110 shadow-lg' : 
                    cell.result ? 'bg-green-500 text-white' : 'bg-white shadow-md'}
                  hover:scale-105
                `}
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="relative">
        <h1 className="text-4xl font-bold mb-12 text-gray-800 text-center">
          Matrix Multiplication in Neural Networks
          <button
            className="ml-4 text-gray-500 hover:text-gray-700 transition-colors duration-300"
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </h1>
        {showTooltip && (
          <div className="absolute top-12 right-0 w-64 p-4 bg-white rounded-xl shadow-lg text-sm text-gray-600 z-10">
            Watch how matrices multiply! Highlighted cells show the current calculation step.
            The result combines row elements from Matrix A with column elements from Matrix B.
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
        {renderMatrix(matrixA, "Matrix A")}
        <div className="flex flex-col items-center gap-2">
          <Grid className="w-8 h-8 text-blue-500" />
          <ArrowRight className="w-8 h-8 text-gray-400" />
        </div>
        {renderMatrix(matrixB, "Matrix B")}
        <span className="text-3xl font-bold text-gray-600">=</span>
        {renderMatrix(result, "Result")}
      </div>

      <div className="flex gap-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600
            text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition duration-300
            shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {isPlaying ? (
            <>
              <Pause className="w-6 h-6" /> Pause Animation
            </>
          ) : (
            <>
              <Play className="w-6 h-6" /> Start Animation
            </>
          )}
        </button>
        
        <button
          onClick={() => {
            setStep(0)
            setIsPlaying(false)
            resetHighlights()
          }}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600
            text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition duration-300
            shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <RotateCw className="w-6 h-6" /> Reset
        </button>
      </div>
    </div>
  )
}

export default MatrixMultiplication