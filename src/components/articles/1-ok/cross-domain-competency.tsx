"use client"
import { useState, useEffect } from "react";
import { Brain, Music, Calculator, Palette, Code, Book, ArrowRight, Check, X } from "lucide-react";

interface Domain {
    id: string;
    name: string;
    icon: JSX.Element;
    color: string;
}

interface Challenge {
    id: string;
    description: string;
    requiredDomains: string[];
    feedback: string;
}

const DOMAINS: Domain[] = [
    { id: "music", name: "Music", icon: <Music className="w-6 h-6" />, color: "bg-blue-500" },
    { id: "math", name: "Mathematics", icon: <Calculator className="w-6 h-6" />, color: "bg-green-500" },
    { id: "art", name: "Art", icon: <Palette className="w-6 h-6" />, color: "bg-yellow-500" },
    { id: "programming", name: "Programming", icon: <Code className="w-6 h-6" />, color: "bg-purple-500" },
];

const CHALLENGES: Challenge[] = [
    {
        id: "1",
        description: "Create a visual algorithm that generates musical patterns",
        requiredDomains: ["programming", "music", "math"],
        feedback: "Perfect! Programming helps automate, math provides structure, and music gives artistic direction.",
    },
    {
        id: "2",
        description: "Design an interactive art piece that responds to musical rhythm",
        requiredDomains: ["art", "music", "programming"],
        feedback: "Excellent! Art provides visuals, music drives rhythm, and programming enables interactivity.",
    },
];

export default function CrossDomainLab() {
    const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
    const [currentChallenge, setCurrentChallenge] = useState<Challenge>(CHALLENGES[0]);
    const [feedback, setFeedback] = useState<string>("");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFeedback("");
            setIsCorrect(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [feedback]);

    const handleDomainClick = (domainId: string) => {
        setSelectedDomains(prev => {
            if (prev.includes(domainId)) {
                return prev.filter(id => id !== domainId);
            }
            return [...prev, domainId];
        });
    };

    const checkSolution = () => {
        const isCorrect = currentChallenge.requiredDomains.every(domain => 
            selectedDomains.includes(domain)) && 
            selectedDomains.length === currentChallenge.requiredDomains.length;
        
        setIsCorrect(isCorrect);
        setFeedback(isCorrect ? currentChallenge.feedback : "Try again! Think about which domains work together.");
    };

    const nextChallenge = () => {
        const currentIndex = CHALLENGES.findIndex(c => c.id === currentChallenge.id);
        const nextIndex = (currentIndex + 1) % CHALLENGES.length;
        setCurrentChallenge(CHALLENGES[nextIndex]);
        setSelectedDomains([]);
        setFeedback("");
        setIsCorrect(null);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-8 h-8 text-blue-500" />
                <h1 className="text-2xl font-bold">Cross-Domain Competency Lab</h1>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="font-semibold mb-2">Current Challenge:</h2>
                <p className="text-lg">{currentChallenge.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {DOMAINS.map(domain => (
                    <button
                        key={domain.id}
                        onClick={() => handleDomainClick(domain.id)}
                        className={`p-4 rounded-lg flex flex-col items-center transition-all duration-300 ${
                            selectedDomains.includes(domain.id)
                                ? `${domain.color} text-white`
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        aria-pressed={selectedDomains.includes(domain.id)}
                    >
                        {domain.icon}
                        <span className="mt-2">{domain.name}</span>
                    </button>
                ))}
            </div>

            {feedback && (
                <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                    isCorrect ? 'bg-green-100' : 'bg-red-100'
                }`}>
                    {isCorrect ? (
                        <Check className="w-6 h-6 text-green-500" />
                    ) : (
                        <X className="w-6 h-6 text-red-500" />
                    )}
                    <p>{feedback}</p>
                </div>
            )}

            <div className="flex space-x-4">
                <button
                    onClick={checkSolution}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    Check Solution
                </button>
                <button
                    onClick={nextChallenge}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                    <span>Next Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}