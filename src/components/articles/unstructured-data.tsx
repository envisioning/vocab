"use client"
import { useState, useEffect } from "react"
import { File, Image, Mail, MessageSquare, Music, Video, FileText, ArrowRight, RefreshCw, Info } from "lucide-react"

interface DataItem {
  id: number
  type: string
  icon: JSX.Element
  description: string
  position: number
}

const INITIAL_ITEMS: DataItem[] = [
  { id: 1, type: "email", icon: <Mail className="w-8 h-8" />, description: "Unformatted email content", position: 0 },
  { id: 2, type: "image", icon: <Image className="w-8 h-8" />, description: "Raw image data", position: 1 },
  { id: 3, type: "chat", icon: <MessageSquare className="w-8 h-8" />, description: "Chat conversations", position: 2 },
  { id: 4, type: "video", icon: <Video className="w-8 h-8" />, description: "Video streams", position: 3 },
  { id: 5, type: "music", icon: <Music className="w-8 h-8" />, description: "Audio files", position: 4 },
  { id: 6, type: "document", icon: <FileText className="w-8 h-8" />, description: "Text documents", position: 5 },
]

const UnstructuredDataVisualizer = () => {
  const [items, setItems] = useState<DataItem[]>(INITIAL_ITEMS)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isOrganized, setIsOrganized] = useState<boolean>(false)
  const [hoveredItem, setHoveredItem] = useState<DataItem | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isProcessing && !isOrganized) {
        setItems(prev => prev.map(item => ({
          ...item,
          position: Math.random() * 360,
        })))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isProcessing, isOrganized])

  const handleProcess = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setItems(prev => prev.sort((a, b) => a.id - b.id))
      setIsProcessing(false)
      setIsOrganized(true)
    }, 1500)
  }

  const handleReset = () => {
    setIsOrganized(false)
    setItems(prev => prev.map(item => ({
      ...item,
      position: Math.random() * 360,
    })))
  }

  return (
    <div className="relative w-full min-h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 md:p-8 overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Understanding Unstructured Data
        </h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Observe how different types of unstructured data float chaotically in their natural state.
          <br />
          Watch AI transform this chaos into organized, structured information!
        </p>
      </div>

      <div className="relative w-full h-[300px] md:h-[400px]">
        {items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredItem(item)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 
              ${isProcessing ? "animate-pulse" : ""}`}
            style={{
              left: `${isOrganized ? (item.id * 12) + 20 : 50 + Math.cos(item.position) * 35}%`,
              top: `${isOrganized ? "50%" : 50 + Math.sin(item.position) * 35}%`,
            }}
          >
            <div className={`relative p-3 md:p-4 rounded-lg bg-white dark:bg-gray-700 shadow-lg
              transform hover:scale-110 transition-transform duration-300
              ${isOrganized ? "border-2 border-green-500" : "border-2 border-blue-500"}`}>
              {item.icon}
              {hoveredItem?.id === item.id && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs md:text-sm
                  p-2 rounded-lg shadow-lg whitespace-nowrap z-10">
                  {item.description}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 
                    border-8 border-transparent border-t-gray-800"/>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Info className="w-4 h-4" />
          <span>{isOrganized ? "Data is now structured and organized" : "Hover over items to learn more"}</span>
        </div>
        {!isOrganized ? (
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 
              text-white rounded-full transition-colors duration-300 disabled:opacity-50"
          >
            <ArrowRight className="w-5 h-5" />
            Process Data
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 
              text-white rounded-full transition-colors duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Visualization
          </button>
        )}
      </div>
    </div>
  )
}

export default UnstructuredDataVisualizer