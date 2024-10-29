"use client"
import { useState, useEffect } from "react";
import { Copy, MessageCircle, Brain, RotateCcw, Play, Pause } from "lucide-react";

interface Message {
    text: string;
    quality: number;
    generation: number;
}

interface ComponentProps {}

const INITIAL_MESSAGE = "AI models can generate amazing content!";
const DEGRADATION_RATE = 0.15;
const MAX_GENERATIONS = 10;

const getDistortedText = (text: string, quality: number): string => {
    const words = text.split(' ');
    return words
        .map(word => {
            if (Math.random() > quality) {
                return '*'.repeat(word.length);
            }
            return word;
        })
        .join(' ');
};

/**
 * Interactive component demonstrating AI Silent Collapse through message degradation
 */
export default function SilentCollapseSimulator({}: ComponentProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentMode, setCurrentMode] = useState<'copy' | 'whisper'>('copy');
    const [prediction, setPrediction] = useState<number | null>(null);

    useEffect(() => {
        setMessages([{ text: INITIAL_MESSAGE, quality: 1, generation: 0 }]);
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isPlaying && messages.length < MAX_GENERATIONS) {
            intervalId = setInterval(() => {
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    const newQuality = lastMessage.quality * (1 - DEGRADATION_RATE);
                    const newText = getDistortedText(INITIAL_MESSAGE, newQuality);
                    
                    return [...prev, {
                        text: newText,
                        quality: newQuality,
                        generation: prev.length
                    }];
                });
            }, 2000);
        }

        return () => clearInterval(intervalId);
    }, [isPlaying, messages.length]);

    const handleReset = () => {
        setMessages([{ text: INITIAL_MESSAGE, quality: 1, generation: 0 }]);
        setIsPlaying(false);
        setPrediction(null);
    };

    const handleModeToggle = () => {
        setCurrentMode(prev => prev === 'copy' ? 'whisper' : 'copy');
        handleReset();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Silent Collapse Simulator</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        aria-label={isPlaying ? "Pause simulation" : "Start simulation"}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        <RotateCcw size={20} />
                        Reset
                    </button>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleModeToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        currentMode === 'copy' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    <Copy size={20} /> Photocopier Mode
                </button>
                <button
                    onClick={handleModeToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        currentMode === 'whisper' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    <MessageCircle size={20} /> Telephone Game
                </button>
            </div>

            <div className="space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-white rounded-lg"
                    >
                        <Brain
                            size={24}
                            className={`text-blue-500 opacity-${Math.round(msg.quality * 100)}`}
                        />
                        <div className="flex-1">
                            <div className="text-lg">{msg.text}</div>
                            <div className="text-sm text-gray-500">
                                Generation {msg.generation} | Quality: {Math.round(msg.quality * 100)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}