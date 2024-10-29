"use client"
import { useState, useEffect } from "react"
import { Pin, Link2, Search, Lightbulb, Brain, Eye, EyeOff } from 'lucide-react'

interface Clue {
  id: number
  text: string
  timestamp: number
  connected: boolean
}

interface Connection {
  from: number
  to: number
}

const ContextDetective = () => {
  const [clues, setClues] = useState<Clue[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [contextLength, setContextLength] = useState<number>(3)
  const [selectedClue, setSelectedClue] = useState<number | null>(null)
  const [score, setScore] = useState<number>(0)

  const CLUE_DATA = [
    "Suspicious footprints found near bank",
    "Security camera shows tall figure",
    "Witness reports blue car",
    "Bank robbery occurs",
    "Blue car spotted at gas station",
    "Tall suspect withdraws money",
    "Security footage shows same footprints"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      if (clues.length < CLUE_DATA.length) {
        setClues(prev => [...prev, {
          id: prev.length,
          text: CLUE_DATA[prev.length],
          timestamp: Date.now(),
          connected: false
        }])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [clues.length])

  const handleClueClick = (id: number) => {
    if (selectedClue === null) {
      setSelectedClue(id)
    } else if (selectedClue !== id) {
      const timeDiff = Math.abs(
        clues[id].timestamp - clues[selectedClue].timestamp
      )
      
      if (timeDiff <= contextLength * 2000) {
        setConnections(prev => [...prev, {
          from: Math.min(selectedClue, id),
          to: Math.max(selectedClue, id)
        }])
        setScore(prev => prev + 1)
        
        setClues(prev => prev.map(clue => 
          clue.id === id || clue.id === selectedClue 
            ? {...clue, connected: true}
            : clue
        ))
      }
      setSelectedClue(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">The Context Detective</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <span>Context Length: {contextLength}</span>
          </div>
          <input
            type="range"
            min="1"
            max="7"
            value={contextLength}
            onChange={(e) => setContextLength(parseInt(e.target.value))}
            className="w-32"
            aria-label="Adjust context length"
          />
        </div>
      </div>

      <div className="relative min-h-[400px] bg-white p-4 rounded-lg border-2 border-gray-200">
        <div className="flex flex-wrap gap-4">
          {clues.map((clue) => (
            <button
              key={clue.id}
              onClick={() => handleClueClick(clue.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300
                ${selectedClue === clue.id ? 'border-blue-500 bg-blue-50' : 
                  clue.connected ? 'border-green-500 bg-green-50' : 'border-gray-200'}
                ${clue.connected ? 'cursor-default' : 'hover:border-blue-300'}
              `}
              disabled={clue.connected}
              aria-pressed={selectedClue === clue.id}
            >
              <Pin className="w-4 h-4 text-gray-400 absolute -top-2 -left-2" />
              <p className="text-sm">{clue.text}</p>
              {connections.map((conn, i) => {
                if (conn.from === clue.id || conn.to === clue.id) {
                  return (
                    <Link2 
                      key={i}
                      className="w-4 h-4 text-green-500 absolute -bottom-2 -right-2"
                    />
                  )
                }
                return null
              })}
            </button>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-500" />
          <span className="font-medium">Connections: {score}</span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-500" />
          <p className="text-sm text-gray-600">
            Connect related clues within your context window to solve the case. 
            Longer context lets you see more connections!
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContextDetective