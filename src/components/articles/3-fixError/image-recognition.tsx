"use client"
import { useState, useEffect } from "react"
import { Camera, Eye, BrainCircuit, Info, Image as ImageIcon, Scan, Sparkles } from 'lucide-react'

interface ImageRecognitionProps {}

type DetectionBox = {
  id: number
  label: string
  confidence: number
  x: number
  y: number
  description: string
}

const SAMPLE_OBJECTS: DetectionBox[] = [
  { id: 1, label: "Cat", confidence: 0.98, x: 20, y: 25, description: "AI can detect various animal species with high accuracy" },
  { id: 2, label: "Book", confidence: 0.95, x: 65, y: 40, description: "Text and objects in images can be identified and read" },
  { id: 3, label: "Person", confidence: 0.99, x: 45, y: 70, description: "Facial recognition and pose estimation are key features" }
]

export default function ImageRecognition({}: ImageRecognitionProps) {
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [detectedObjects, setDetectedObjects] = useState<DetectionBox[]>([])
  const [scanProgress, setScanProgress] = useState<number>(0)
  const [selectedObject, setSelectedObject] = useState<DetectionBox | null>(null)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false)
            setDetectedObjects(SAMPLE_OBJECTS)
            return 0
          }
          return prev + 1
        })
      }, 30)

      return () => {
        clearInterval(interval)
        setScanProgress(0)
      }
    }
  }, [isScanning])

  const handleScan = () => {
    setIsScanning(true)
    setDetectedObjects([])
    setSelectedObject(null)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-4 sm:p-8">
      <div className="max-w-4xl w-full space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Vision Recognition
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <p>Experience how AI perceives and understands visual information</p>
          </div>
        </div>

        <div className="relative aspect-video bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl overflow-hidden border border-blue-100 dark:border-blue-900">
          <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-3 gap-3 p-4 h-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/20 dark:bg-gray-600/30 rounded-xl backdrop-blur-md" />
              ))}
            </div>
          </div>

          {isScanning && (
            <div className="absolute inset-0">
              <div className="absolute top-0 w-full h-1.5 bg-blue-500/50">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg animate-pulse">
                  <BrainCircuit className="w-12 h-12 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {detectedObjects.map(obj => (
            <div
              key={obj.id}
              className="absolute group"
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setSelectedObject(obj)}
              onMouseLeave={() => setSelectedObject(null)}
            >
              <div className="relative border-2 border-green-500 rounded-xl p-3 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30">
                <div className="flex items-center space-x-2 text-sm font-medium text-green-700 dark:text-green-300">
                  <Eye className="w-4 h-4" />
                  <span>{obj.label}</span>
                  <span className="text-xs">({(obj.confidence * 100).toFixed(0)}%)</span>
                </div>
                
                {selectedObject?.id === obj.id && (
                  <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 w-48 text-sm">
                    {obj.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            <Scan className="w-5 h-5" />
            <span>{isScanning ? 'Analyzing Image...' : 'Start Analysis'}</span>
          </button>

          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl shadow-md hover:shadow-lg transition duration-300"
          >
            <Info className="w-5 h-5" />
            <span>How it works</span>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 w-64 text-sm">
                AI analyzes images pixel by pixel, identifying patterns and features to recognize objects and their characteristics.
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}