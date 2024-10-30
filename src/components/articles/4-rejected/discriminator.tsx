"use client"
import { useState, useEffect } from "react";
import { Image, Eye, AlertCircle, Check, X, Brain, ChevronRight, BarChart } from "lucide-react";

interface ArtPiece {
    id: number;
    isReal: boolean;
    features: string[];
    confidence: number;
}

interface GameState {
    score: number;
    round: number;
    timeLeft: number;
}

const INITIAL_TIME = 30;
const FEATURES = ["brush strokes", "color palette", "composition", "texture"];

const ART_PIECES: ArtPiece[] = [
    { id: 1, isReal: true, features: ["consistent brush strokes", "harmonious colors"], confidence: 0.9 },
    { id: 2, isReal: false, features: ["irregular patterns", "artificial textures"], confidence: 0.3 },
];

export default function DiscriminatorGame() {
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        round: 0,
        timeLeft: INITIAL_TIME,
    });
    const [currentPiece, setCurrentPiece] = useState<ArtPiece>(ART_PIECES[0]);
    const [userConfidence, setUserConfidence] = useState<number>(50);
    const [feedback, setFeedback] = useState<string>("");
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (!isPlaying) return;
        
        const timer = setInterval(() => {
            setGameState(prev => ({
                ...prev,
                timeLeft: prev.timeLeft - 1
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [isPlaying]);

    useEffect(() => {
        if (gameState.timeLeft === 0) {
            endRound();
        }
    }, [gameState.timeLeft]);

    const startGame = () => {
        setIsPlaying(true);
        setGameState({
            score: 0,
            round: 0,
            timeLeft: INITIAL_TIME,
        });
    };

    const endRound = () => {
        const accuracy = Math.abs(userConfidence/100 - currentPiece.confidence);
        const points = Math.floor((1 - accuracy) * 100);
        
        setGameState(prev => ({
            ...prev,
            score: prev.score + points,
            round: prev.round + 1,
            timeLeft: INITIAL_TIME,
        }));
        
        if (gameState.round < ART_PIECES.length - 1) {
            setCurrentPiece(ART_PIECES[gameState.round + 1]);
            setUserConfidence(50);
        } else {
            setIsPlaying(false);
        }
    };

    const handleConfidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserConfidence(Number(e.target.value));
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Art Authentication Challenge</h1>
                <div className="flex items-center gap-4">
                    <Brain className="text-blue-500" />
                    <span>Score: {gameState.score}</span>
                    <AlertCircle className="text-gray-500" />
                    <span>Time: {gameState.timeLeft}s</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Analysis Area</h2>
                    <div className="flex items-center gap-2 mb-4">
                        {currentPiece.features.map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                                {feature}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-2">
                            <Eye className="text-blue-500" />
                            Confidence Slider
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={userConfidence}
                                onChange={handleConfidenceChange}
                                className="w-full"
                                aria-label="Set confidence level"
                            />
                            {userConfidence}%
                        </label>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Performance Metrics</h2>
                    <BarChart className="text-green-500 mb-2" />
                    <div className="flex justify-between items-center">
                        <span>Accuracy: {Math.round(gameState.score / (gameState.round || 1))}%</span>
                        <span>Round: {gameState.round + 1}/{ART_PIECES.length}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={isPlaying ? endRound : startGame}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                aria-label={isPlaying ? "Submit answer" : "Start game"}
            >
                {isPlaying ? (
                    <span className="flex items-center justify-center gap-2">
                        Submit <ChevronRight />
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        Start Challenge <Brain />
                    </span>
                )}
            </button>
        </div>
    );
}