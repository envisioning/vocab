"use client"
import { useState, useEffect } from "react"
import { Brain, Database, ArrowRight, Check, X, Image, Music, MessageSquare, FileText, HelpCircle, AlertCircle } from "lucide-react"

interface DataItem {
    id: number
    type: "image" | "text" | "audio" | "chat"
    isLabeled: boolean
    icon: JSX.Element
    description: string
    examples: string[]
}

const INITIAL_DATA: DataItem[] = [
    { 
        id: 1, 
        type: "image", 
        isLabeled: false, 
        icon: <Image className="w-6 h-6" />,
        description: "Visual data like photos and diagrams",
        examples: ["Cat photos", "X-ray scans", "Street signs"]
    },
    { 
        id: 2, 
        type: "text", 
        isLabeled: false, 
        icon: <FileText className="w-6 h-6" />,
        description: "Written content and documents",
        examples: ["News articles", "Tweets", "Book chapters"]
    },
    { 
        id: 3, 
        type: "audio", 
        isLabeled: false, 
        icon: <Music className="w-6 h-6" />,
        description: "Sound recordings and speech",
        examples: ["Voice commands", "Music genres", "Bird songs"]
    },
    { 
        id: 4, 
        type: "chat", 
        isLabeled: false, 
        icon: <MessageSquare className="w-6 h-6" />,
        description: "Conversation and dialogue",
        examples: ["Customer service", "Chat messages", "Movie scripts"]
    }
]

export default function TrainingDataVisualizer() {
    const [data, setData] = useState<DataItem[]>(INITIAL_DATA)
    const [isTraining, setIsTraining] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [hoveredItem, setHoveredItem] = useState<number | null>(null)

    useEffect(() => {
        if (isTraining) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        setIsTraining(false)
                        return 100
                    }
                    return prev + 2
                })
            }, 50)
            return () => clearInterval(interval)
        }
    }, [isTraining])

    return (
        <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50 rounded-xl shadow-xl">
            <div className="flex items-center gap-3 mb-8">
                <Database className="w-8 h-8 text-blue-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-gray-800">AI Training Data Explorer</h2>
                <div className="ml-auto flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <HelpCircle className="w-5 h-5" />
                    <span className="text-sm">Click items to label them for training</span>
                </div>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                    {data.map(item => (
                        <div
                            key={item.id}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="relative"
                        >
                            <div
                                onClick={() => setData(prev => prev.map(d => 
                                    d.id === item.id ? {...d, isLabeled: !d.isLabeled} : d
                                ))}
                                className={`p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer
                                    ${item.isLabeled 
                                        ? 'border-green-500 bg-green-50 shadow-green-100' 
                                        : 'border-gray-300 bg-white hover:border-blue-400 shadow-lg hover:shadow-xl'}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span className="text-lg font-semibold text-gray-700 capitalize">{item.type}</span>
                                    </div>
                                    {item.isLabeled ? (
                                        <Check className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-blue-400" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </div>

                            {hoveredItem === item.id && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl p-4 z-10 border border-gray-200">
                                    <h4 className="font-semibold mb-2 text-gray-700">Examples:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        {item.examples.map((example, idx) => (
                                            <li key={idx}>{example}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <button
                        onClick={() => {setIsTraining(true); setProgress(0)}}
                        disabled={!data.some(item => item.isLabeled) || isTraining}
                        className={`w-full py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg font-semibold
                            ${!data.some(item => item.isLabeled) || isTraining
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'}`}
                    >
                        {isTraining ? (
                            <>
                                <Brain className="w-6 h-6 animate-bounce" />
                                Training Model...
                            </>
                        ) : (
                            <>
                                <ArrowRight className="w-6 h-6" />
                                Begin AI Training
                            </>
                        )}
                    </button>

                    {isTraining && (
                        <div className="mt-6">
                            <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                    style={{ width: `${progress}%` }}
                                    className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                                />
                            </div>
                            <p className="text-center mt-3 text-gray-700 font-medium">{progress}% Complete</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}