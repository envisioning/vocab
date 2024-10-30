"use client"
import { useState, useEffect } from "react";
import { SlidersHorizontal, Book, ChevronRight, Award, RefreshCcw } from "lucide-react";

interface NgramGameProps {}

type WordSequence = {
    sequence: string[];
    nextWord: string;
    options: string[];
}

const SAMPLE_SEQUENCES: WordSequence[] = [
    {
        sequence: ["the", "quick", "brown"],
        nextWord: "fox",
        options: ["fox", "cat", "dog", "bird"]
    },
    {
        sequence: ["once", "upon", "a"],
        nextWord: "time",
        options: ["time", "day", "place", "year"]
    },
    {
        sequence: ["thank", "you", "very"],
        nextWord: "much",
        options: ["much", "well", "kindly", "nice"]
    }
];

const NgramGame: React.FC<NgramGameProps> = () => {
    const [nValue, setNValue] = useState<number>(3);
    const [score, setScore] = useState<number>(0);
    const [currentSequenceIndex, setCurrentSequenceIndex] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState<boolean>(true);
    const [selectedWord, setSelectedWord] = useState<string>("");

    useEffect(() => {
        let animationTimer: NodeJS.Timeout;
        if (isAnimating) {
            animationTimer = setInterval(() => {
                setCurrentSequenceIndex((prev) => 
                    prev === SAMPLE_SEQUENCES.length - 1 ? 0 : prev + 1
                );
            }, 3000);
        }
        return () => clearInterval(animationTimer);
    }, [isAnimating]);

    const handleWordSelect = (word: string) => {
        setSelectedWord(word);
        setIsAnimating(false);
        if (word === SAMPLE_SEQUENCES[currentSequenceIndex].nextWord) {
            setScore((prev) => prev + 1);
        }
    };

    const handleReset = () => {
        setScore(0);
        setCurrentSequenceIndex(0);
        setSelectedWord("");
        setIsAnimating(true);
    };

    const currentSequence = SAMPLE_SEQUENCES[currentSequenceIndex];

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Book className="text-blue-500 w-6 h-6" />
                    <h2 className="text-xl font-bold">Ngram Word Predictor</h2>
                </div>
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="text-gray-600 w-5 h-5" />
                    <select
                        value={nValue}
                        onChange={(e) => setNValue(parseInt(e.target.value))}
                        className="border rounded p-1"
                        aria-label="Select N-gram size"
                    >
                        {[2, 3, 4].map((n) => (
                            <option key={n} value={n}>{n}-gram</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                    {currentSequence.sequence.map((word, idx) => (
                        <div
                            key={idx}
                            className="bg-blue-100 px-3 py-2 rounded-lg font-medium"
                        >
                            {word}
                        </div>
                    ))}
                    <ChevronRight className="text-gray-400 w-6 h-6" />
                    <div className="w-20 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        {selectedWord || "?"}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {currentSequence.options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleWordSelect(option)}
                            className={`p-2 rounded-lg transition-colors duration-300
                                ${selectedWord === option 
                                    ? (option === currentSequence.nextWord 
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white')
                                    : 'bg-gray-100 hover:bg-blue-100'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Award className="text-blue-500 w-6 h-6" />
                    <span className="font-bold">Score: {score}</span>
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Reset
                </button>
            </div>
        </div>
    );
};

export default NgramGame;