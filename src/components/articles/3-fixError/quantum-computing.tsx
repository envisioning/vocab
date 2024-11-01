"use client"
import { useState, useEffect } from "react"
import { Atom, Binary, Brain, Cpu, Maximize2, Minimize2, RotateCcw, Sparkles, Info } from "lucide-react"

interface QuantumBit {
  id: number
  state: "0" | "1" | "superposition"
  position: { x: number; y: number }
}

interface TooltipState {
  visible: boolean
  content: string
  position: { x: number; y: number }
}

const INITIAL_QUBITS: QuantumBit[] = [
  { id: 1, state: "0", position: { x: 0, y: 0 } },
  { id: 2, state: "1", position: { x: 0, y: 0 } },
  { id: 3, state: "superposition", position: { x: 0, y: 0 } }
]

export default function QuantumComputingDemo() {
  const [qubits, setQubits] = useState<QuantumBit[]>(INITIAL_QUBITS)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [superpositionActive, setSuperpositionActive] = useState<boolean>(false)
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, content: "", position: { x: 0, y: 0 } })

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating) {
        setQubits(prev => prev.map(qubit => ({
          ...qubit,
          position: {
            x: Math.sin(Date.now() / 1000 + qubit.id) * 30,
            y: Math.cos(Date.now() / 800 + qubit.id) * 30
          }
        })))
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isAnimating])

  const showTooltip = (content: string, e: React.MouseEvent) => {
    setTooltip({
      visible: true,
      content,
      position: { x: e.clientX, y: e.clientY }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-purple-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Cpu className="w-12 h-12 text-blue-400 animate-pulse" />
            Quantum Computing Explorer
          </h1>
          <p className="text-xl text-blue-200">Journey into the Quantum Realm of Computing</p>
          <div className="flex justify-center space-x-2">
            <Brain className="w-6 h-6 text-purple-400" />
            <span className="text-purple-200">Visualize quantum superposition in action</span>
          </div>
        </div>

        <div className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 overflow-hidden shadow-2xl border border-blue-500/30">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          
          {qubits.map((qubit) => (
            <div
              key={qubit.id}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{
                transform: `translate(${qubit.position.x * 2}px, ${qubit.position.y * 2}px)`
              }}
              onMouseEnter={(e) => showTooltip(`Qubit ${qubit.id}: ${qubit.state}`, e)}
              onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
            >
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center
                ${superpositionActive ? 'bg-blue-500/50 animate-pulse shadow-lg shadow-blue-500/50' : 'bg-gray-800'}
                transition-all duration-500 backdrop-blur-sm
              `}>
                {qubit.state === "superposition" ? (
                  <Atom className="w-10 h-10 text-blue-300 animate-spin" />
                ) : (
                  <Binary className="w-10 h-10 text-gray-300" />
                )}
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <button
            onClick={() => {
              setSuperpositionActive(!superpositionActive)
              setIsAnimating(!isAnimating)
            }}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
          >
            {superpositionActive ? (
              <>
                <Minimize2 className="w-6 h-6" />
                Collapse Quantum State
              </>
            ) : (
              <>
                <Maximize2 className="w-6 h-6" />
                Enter Superposition
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              setIsAnimating(false)
              setSuperpositionActive(false)
              setQubits(INITIAL_QUBITS)
            }}
            className="flex items-center gap-2 px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {tooltip.visible && (
          <div 
            className="fixed bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 pointer-events-none"
            style={{ left: tooltip.position.x + 10, top: tooltip.position.y + 10 }}
          >
            {tooltip.content}
          </div>
        )}

        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-blue-500/30 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Info className="w-6 h-6 text-blue-400" />
            Understanding Quantum Computing
          </h2>
          <div className="grid grid-cols-2 gap-6 text-lg">
            <div className="space-y-3 text-blue-200">
              <p>• Classical bits are limited to 0 or 1</p>
              <p>• Quantum bits exist in multiple states</p>
            </div>
            <div className="space-y-3 text-purple-200">
              <p>• Superposition enables parallel processing</p>
              <p>• Measurement affects quantum states</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}