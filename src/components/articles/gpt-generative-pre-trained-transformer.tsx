"use client"
import { useState, useEffect } from "react";
import { Book, Music, Brain, ArrowRight, Sparkles } from "lucide-react";

interface PredictionOption {
    text: string;
    probability: number;
    isCorrect: boolean;
}

interface Sequence {
    current: string[];
    options: PredictionOption[];
}

const INITIAL_TEXT_SEQUENCE: Sequence = {
    current: ["The", "cat", "sat", "on", "the"],
    options: [
        { text: "mat", probability: 0.7, isCorrect: true },
        { text: "dog", probability: 0.2, isCorrect: false },
        { text: "tree", probability: 0.1, isCorrect: false }
    ]
};

const INITIAL_MUSIC_SEQUENCE: Sequence = {
    current: ["Do", "Re", "Mi", "Fa"],
    options: [
        { text: "So", probability: 0.8, isCorrect: true },
        { text: "La", probability: 0.1, isCorrect: false },
        { text: "Ti", probability: 0.1, isCorrect: false }
    ]
};

export default function GPTPatternPredictor() {
    const [score, setScore] = useState<number>(0);
    const [textSequence, setTextSequence] = useState<Sequence>(INITIAL_TEXT_SEQUENCE);
    const [musicSequence, setMusicSequence] = useState<Sequence>(INITIAL_MUSIC_SEQUENCE);
    const [activeStream, setActiveStream] = useState<'text' | 'music'>('text');
    const [showFeedback, setShowFeedback] = useState<boolean>(false);

    const handlePrediction = (option: PredictionOption) => {
        if (option.isCorrect) {
            setScore(prev => prev + 10);
            setShowFeedback(true);
            const currentSequence = activeStream === 'text' ? textSequence : musicSequence;
            const updatedSequence = {
                ...currentSequence,
                current: [...currentSequence.current, option.text]
            };
            
            if (activeStream === 'text') {
                setTextSequence(updatedSequence);
            } else {
                setMusicSequence(updatedSequence);
            }
        }
    };

    useEffect(() => {
        if (showFeedback) {
            const timer = setTimeout(() => setShowFeedback(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showFeedback]);

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">GPT Pattern Predictor</h1>
                <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-lg">Score: {score}</p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="relative border-2 p-6 rounded-lg hover:border-blue-500 transition-colors duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <Book className="w-6 h-6" />
                        <h2 className="text-xl font-semibold">Text Stream</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {textSequence.current.map((word, idx) => (
                            <span key={idx} className="bg-gray-100 px-3 py-1 rounded">
                                {word}
                            </span>
                        ))}
                        <ArrowRight className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex gap-4">
                        {textSequence.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handlePrediction(option)}
                                className="px-4 py-2 bg-gray-100 rounded hover:bg-blue-100 transition-colors duration-300"
                                style={{
                                    opacity: 0.3 + option.probability * 0.7
                                }}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative border-2 p-6 rounded-lg hover:border-blue-500 transition-colors duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <Music className="w-6 h-6" />
                        <h2 className="text-xl font-semibold">Music Stream</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {musicSequence.current.map((note, idx) => (
                            <span key={idx} className="bg-gray-100 px-3 py-1 rounded">
                                {note}
                            </span>
                        ))}
                        <ArrowRight className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex gap-4">
                        {musicSequence.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handlePrediction(option)}
                                className="px-4 py-2 bg-gray-100 rounded hover:bg-blue-100 transition-colors duration-300"
                                style={{
                                    opacity: 0.3 + option.probability * 0.7
                                }}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {showFeedback && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Correct! GPT uses patterns to predict the next token.</span>
                </div>
            )}
        </div>
    );
}