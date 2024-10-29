"use client"
import { useState, useEffect } from "react";
import { Plant, Globe, MessageCircle, Sprout, Tree, Wind } from "lucide-react";

interface WordEvolution {
    id: string;
    word: string;
    stage: number;
    context: string;
    origin: string;
}

interface GardenState {
    words: WordEvolution[];
    activeWord: string | null;
    growthStage: number;
}

/**
 * LanguageGarden: Interactive component teaching natural language evolution
 * through a garden metaphor where words grow and evolve.
 */
const LanguageGarden = () => {
    const [gardenState, setGardenState] = useState<GardenState>({
        words: [
            { id: "1", word: "selfie", stage: 0, context: "social", origin: "self-portrait" },
            { id: "2", word: "google", stage: 0, context: "search", origin: "googol" },
            { id: "3", word: "emoji", stage: 0, context: "digital", origin: "emotion-icon" }
        ],
        activeWord: null,
        growthStage: 0
    });

    useEffect(() => {
        const growthInterval = setInterval(() => {
            setGardenState(prev => ({
                ...prev,
                words: prev.words.map(word => ({
                    ...word,
                    stage: word.stage < 3 ? word.stage + 1 : word.stage
                }))
            }));
        }, 2000);

        return () => clearInterval(growthInterval);
    }, []);

    const handleWordSelect = (wordId: string) => {
        setGardenState(prev => ({
            ...prev,
            activeWord: wordId
        }));
    };

    const getGrowthIcon = (stage: number) => {
        switch (stage) {
            case 0: return <Sprout className="text-green-500" />;
            case 1: return <Plant className="text-green-500" />;
            case 2: return <Tree className="text-green-500" />;
            default: return <Wind className="text-blue-500" />;
        }
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg" role="region" aria-label="Language Garden">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Language Garden</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
                {gardenState.words.map(word => (
                    <button
                        key={word.id}
                        onClick={() => handleWordSelect(word.id)}
                        className={`p-4 rounded-lg transition-all duration-300 ${
                            gardenState.activeWord === word.id
                                ? 'bg-blue-100 border-blue-500'
                                : 'bg-white border-gray-200'
                        } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        aria-pressed={gardenState.activeWord === word.id}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium">{word.word}</span>
                            {getGrowthIcon(word.stage)}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Origin: {word.origin}
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex gap-4 justify-center mt-4">
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="View global impact"
                >
                    <Globe className="w-5 h-5" />
                    Global Impact
                </button>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Explore contexts"
                >
                    <MessageCircle className="w-5 h-5" />
                    Contexts
                </button>
            </div>
        </div>
    );
};

export default LanguageGarden;