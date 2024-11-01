"use client"
import { useState, useEffect } from "react"
import { Key, Lock, ArrowRight, Hash, Book, Sparkles, InfoIcon } from "lucide-react"

interface HashTableProps {}

type HashItem = {
    key: string
    value: string
    position: number
    isAnimating: boolean
}

const SAMPLE_ITEMS = [
    { key: "book", value: "📚 Library" },
    { key: "music", value: "🎵 Playlist" },
    { key: "game", value: "🎮 Minecraft" },
    { key: "food", value: "🍕 Pizza" }
]

const HashTableVisualizer: React.FC<HashTableProps> = () => {
    const [items, setItems] = useState<HashItem[]>([])
    const [activeItem, setActiveItem] = useState<number | null>(null)
    const [searchKey, setSearchKey] = useState<string>("")
    const [foundIndex, setFoundIndex] = useState<number | null>(null)
    const [showTooltip, setShowTooltip] = useState<string>("")

    const hashFunction = (key: string): number => {
        return Math.abs(key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 8)
    }

    useEffect(() => {
        const initialItems = SAMPLE_ITEMS.map((item) => ({
            ...item,
            position: hashFunction(item.key),
            isAnimating: false
        }))
        setItems(initialItems)
        return () => setItems([])
    }, [])

    const handleItemSelect = (key: string) => {
        setSearchKey(key)
        const hashedPosition = hashFunction(key)
        setActiveItem(hashedPosition)

        const itemIndex = items.findIndex(item => item.key === key)
        if (itemIndex !== -1) {
            setFoundIndex(itemIndex)
            const newItems = [...items]
            newItems[itemIndex].isAnimating = true
            setItems(newItems)

            const timer = setTimeout(() => {
                const resetItems = [...items]
                resetItems[itemIndex].isAnimating = false
                setItems(resetItems)
                setActiveItem(null)
                setFoundIndex(null)
            }, 2000)

            return () => clearTimeout(timer)
        }
    }

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-8">
                <Hash className="text-blue-500 w-8 h-8" />
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
                    Hash Table Explorer
                </h2>
                <button
                    onMouseEnter={() => setShowTooltip("info")}
                    onMouseLeave={() => setShowTooltip("")}
                    className="relative"
                >
                    <InfoIcon className="text-blue-500 w-5 h-5" />
                    {showTooltip === "info" && (
                        <div className="absolute z-10 w-64 p-3 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg -left-28 top-8">
                            A hash table transforms keys into array indices using a hash function, enabling fast data retrieval.
                        </div>
                    )}
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-12 justify-center">
                {SAMPLE_ITEMS.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => handleItemSelect(item.key)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-xl flex items-center gap-3 hover:scale-105 hover:bg-blue-600 transform transition-all duration-300 shadow-md"
                    >
                        <Key className="w-5 h-5" />
                        <span className="font-medium">{item.key}</span>
                    </button>
                ))}
            </div>

            <div className="relative mb-12">
                {searchKey && (
                    <div className="flex items-center justify-center gap-6 mb-8 animate-pulse">
                        <div className="flex flex-col items-center">
                            <Key className="text-blue-500 w-8 h-8" />
                            <span className="text-sm mt-1">Input Key</span>
                        </div>
                        <ArrowRight className="text-gray-500 w-8 h-8" />
                        <div className="flex flex-col items-center">
                            <Sparkles className="text-yellow-500 w-8 h-8" />
                            <span className="text-sm mt-1">Hash Function</span>
                        </div>
                        <ArrowRight className="text-gray-500 w-8 h-8" />
                        <div className="flex flex-col items-center">
                            <Lock className="text-green-500 w-8 h-8" />
                            <span className="text-lg font-mono font-bold">
                                Index: {hashFunction(searchKey)}
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-8 gap-3">
                    {[...Array(8)].map((_, index) => (
                        <div
                            key={index}
                            className={`h-28 rounded-xl border-3 transition-all duration-500 flex items-center justify-center backdrop-blur-sm
                                ${activeItem === index ? 'border-blue-500 bg-blue-100/50 dark:bg-blue-900/50 shadow-lg' : 'border-gray-200 dark:border-gray-700'}
                            `}
                        >
                            <div className="absolute -top-3 left-3 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                                {index}
                            </div>
                            {items.map((item, itemIndex) => (
                                item.position === index && (
                                    <div
                                        key={item.key}
                                        className={`p-3 rounded-lg transition-all duration-300 transform
                                            ${item.isAnimating ? 'animate-bounce bg-green-100 dark:bg-green-900 scale-110' : 'bg-white dark:bg-gray-700'}
                                            ${foundIndex === itemIndex ? 'ring-4 ring-green-500 shadow-xl' : ''}
                                        `}
                                    >
                                        <div className="text-sm font-mono">
                                            {item.value}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-inner">
                <Book className="inline-block mr-2 w-5 h-5" />
                <p className="inline-block text-sm">
                    Select a key above to see how it's magically transformed into an array index! ✨
                </p>
            </div>
        </div>
    )
}

export default HashTableVisualizer