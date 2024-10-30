"use client"
import { useState, useEffect } from "react";
import { Brain, Book, Memory, Zap, AlertCircle } from "lucide-react";

interface Memory {
    id: number;
    text: string;
    timestamp: number;
}

interface ComponentProps {}

type ViewMode = "infinite" | "limited";

const WINDOW_SIZE = 3;
const SAMPLE_MEMORIES = [
    "Started learning guitar",
    "Won school debate",
    "First coding project",
    "Family vacation to beach",
    "Made the soccer team"
];

/**
 * MemoryPalace: Interactive component demonstrating infinite context windows
 */
export default function MemoryPalace({}: ComponentProps) {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [newMemory, setNewMemory] = useState<string>("");
    const [viewMode, setViewMode] = useState<ViewMode>("infinite");
    const [prediction, setPrediction] = useState<string>("");

    useEffect(() => {
        const cleanup = setTimeout(() => {
            if (memories.length === 0) {
                const initialMemories = SAMPLE_MEMORIES.map((text, index) => ({
                    id: index,
                    text,
                    timestamp: Date.now() - (SAMPLE_MEMORIES.length - index) * 1000
                }));
                setMemories(initialMemories);
            }
        }, 1000);
        return () => clearTimeout(cleanup);
    }, []);

    const handleAddMemory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemory.trim()) return;
        
        setMemories(prev => [...prev, {
            id: Date.now(),
            text: newMemory,
            timestamp: Date.now()
        }]);
        setNewMemory("");
    };

    const getVisibleMemories = () => {
        if (viewMode === "infinite") return memories;
        return memories.slice(-WINDOW_SIZE);
    };

    const makePrediction = () => {
        const visibleMemories = getVisibleMemories();
        setPrediction(
            viewMode === "infinite" 
                ? `Based on all ${memories.length} memories, you seem interested in personal growth and achievements!`
                : `Based on the last ${WINDOW_SIZE} memories only, you've been focusing on recent activities.`
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Brain className="text-blue-500" />
                    Memory Palace
                </h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setViewMode("infinite")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            viewMode === "infinite" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                        aria-pressed={viewMode === "infinite"}
                    >
                        <Memory /> Infinite
                    </button>
                    <button
                        onClick={() => setViewMode("limited")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            viewMode === "limited" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                        aria-pressed={viewMode === "limited"}
                    >
                        <Book /> Limited
                    </button>
                </div>
            </div>

            <form onSubmit={handleAddMemory} className="flex gap-2">
                <input
                    type="text"
                    value={newMemory}
                    onChange={(e) => setNewMemory(e.target.value)}
                    placeholder="Add a new memory..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="New memory input"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Add Memory
                </button>
            </form>

            <div className="space-y-4 min-h-[300px]">
                {getVisibleMemories().map((memory) => (
                    <div
                        key={memory.id}
                        className="p-4 bg-white rounded-lg shadow-sm border transition-all duration-300 hover:shadow-md"
                    >
                        {memory.text}
                    </div>
                ))}
            </div>

            <button
                onClick={makePrediction}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 mx-auto"
            >
                <Zap /> Analyze Memories
            </button>

            {prediction && (
                <div className="bg-gray-100 p-4 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-blue-500 flex-shrink-0 mt-1" />
                    <p>{prediction}</p>
                </div>
            )}
        </div>
    );
}