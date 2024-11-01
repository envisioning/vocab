"use client"
import { useState, useEffect } from "react"
import { Database, FileJson, FileCog, FileText, CheckCircle2, Info } from "lucide-react"

interface DataItem {
  id: number
  type: 'structured' | 'unstructured'
  icon: JSX.Element
  content: string
  explanation: string
}

export default function StructuredDataVisualizer() {
  const [items, setItems] = useState<DataItem[]>([
    {
      id: 1,
      type: 'unstructured',
      icon: <FileText className="w-8 h-8" />,
      content: "Dear John, hope you're well! Meeting at 3pm?",
      explanation: "Regular text - hard for computers to understand time and person"
    },
    {
      id: 2, 
      type: 'structured',
      icon: <FileJson className="w-8 h-8" />,
      content: '{"meeting": {"time": "15:00", "attendee": "John"}}',
      explanation: "JSON format - time and attendee are clearly labeled and machine-readable"
    },
    {
      id: 3,
      type: 'unstructured',
      icon: <FileText className="w-8 h-8" />,
      content: "Remember to buy milk and cookies",
      explanation: "Plain text - computer can't easily identify this is a shopping list"
    },
    {
      id: 4,
      type: 'structured',
      icon: <FileJson className="w-8 h-8" />,
      content: '{"shopping": {"items": ["milk", "cookies"]}}',
      explanation: "Structured array - items are in a clear, searchable list format"
    }
  ])

  const [isOrganizing, setIsOrganizing] = useState(false)
  const [organized, setOrganized] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isOrganizing) {
      timer = setTimeout(() => {
        const sortedItems = [...items].sort((a, b) => {
          if (a.type === 'structured' && b.type === 'unstructured') return -1
          if (a.type === 'unstructured' && b.type === 'structured') return 1
          return 0
        })
        setItems(sortedItems)
        setOrganized(true)
        setIsOrganizing(false)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [isOrganizing, items])

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Structured vs Unstructured Data
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover how computers make sense of different data formats
        </p>
      </div>

      <div className="relative space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative p-6 rounded-xl border-2 transition-all duration-500 transform hover:shadow-lg
              ${isOrganizing ? 'scale-95' : 'scale-100'}
              ${item.type === 'structured' 
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600' 
                : 'bg-gray-50 dark:bg-gray-800/30 border-gray-300 dark:border-gray-600'}
            `}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex items-center space-x-4">
              {item.icon}
              <div className="font-mono text-sm flex-grow">{item.content}</div>
              <Info className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors duration-300" />
            </div>
            {hoveredId === item.id && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm py-2 px-4 rounded-lg shadow-xl z-10 w-64">
                {item.explanation}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setIsOrganizing(true)}
          disabled={organized}
          className={`
            flex items-center space-x-3 px-8 py-4 rounded-full text-lg font-semibold
            transition-all duration-300 transform hover:scale-105 hover:shadow-lg
            ${organized 
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
            }
          `}
        >
          {organized ? (
            <>
              <CheckCircle2 className="w-6 h-6" />
              <span>Data Organized!</span>
            </>
          ) : (
            <>
              <FileCog className="w-6 h-6" />
              <span>Organize Data</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}