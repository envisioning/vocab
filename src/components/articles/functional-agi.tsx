"use client"
import { useState, useEffect } from "react";
import { Brain, Calculator, Palette, Headphones, Robot, Zap, X } from "lucide-react";

interface Challenge {
    id: number;
    task: string;
    domain: string;
    icon: JSX.Element;
}

interface AGIState {
    currentTask: string;
    learningProgress: number;
    adaptationPhase: boolean;
}

const DOMAINS: Challenge[] = [
    { id: 1, task: "Calculate complex equations", domain: "Mathematics", icon: <Calculator /> },
    { id: 2, task: "Create digital artwork", domain: "Art", icon: <Palette /> },
    { id: 3, task: "Compose music", domain: "Music", icon: <Headphones /> },
];

export default function AGISimulator() {
    const [agiState, setAgiState] = useState<AGIState>({
        currentTask: "",
        learningProgress: 0,
        adaptationPhase: false
    });
    const [customChallenge, setCustomChallenge] = useState<string>("");
    const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
    const [narrowAIProgress, setNarrowAIProgress] = useState<number>(0);

    useEffect(() => {
        if (activeChallenge && agiState.adaptationPhase) {
            const progressInterval = setInterval(() => {
                setAgiState(prev => ({
                    ...prev,
                    learningProgress: Math.min(prev.learningProgress + 10, 100)
                }));
                setNarrowAIProgress(prev => 
                    activeChallenge.domain === "Mathematics" ? Math.min(prev + 20, 90) : Math.min(prev + 5, 30)
                );
            }, 500);

            return () => clearInterval(progressInterval);
        }
    }, [activeChallenge, agiState.adaptationPhase]);

    const handleChallengeStart = (challenge: Challenge) => {
        setActiveChallenge(challenge);
        setAgiState({
            currentTask: challenge.task,
            learningProgress: 0,
            adaptationPhase: true
        });
        setNarrowAIProgress(0);
    };

    const handleCustomChallenge = (e: React.FormEvent) => {
        e.preventDefault();
        const newChallenge: Challenge = {
            id: Date.now(),
            task: customChallenge,
            domain: "Custom",
            icon: <Brain />
        };
        handleChallengeStart(newChallenge);
        setCustomChallenge("");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Robot className="text-blue-500" />
                    AGI Evolution Simulator
                </h1>
                {activeChallenge && (
                    <button
                        onClick={() => {
                            setActiveChallenge(null);
                            setAgiState({ currentTask: "", learningProgress: 0, adaptationPhase: false });
                        }}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-300"
                        aria-label="Reset simulation"
                    >
                        <X />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Predefined Challenges</h2>
                    {DOMAINS.map(domain => (
                        <button
                            key={domain.id}
                            onClick={() => handleChallengeStart(domain)}
                            className="w-full p-4 flex items-center gap-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
                            disabled={agiState.adaptationPhase}
                        >
                            {domain.icon}
                            <span>{domain.task}</span>
                        </button>
                    ))}

                    <form onSubmit={handleCustomChallenge} className="mt-4">
                        <input
                            type="text"
                            value={customChallenge}
                            onChange={(e) => setCustomChallenge(e.target.value)}
                            placeholder="Create your own challenge..."
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            disabled={agiState.adaptationPhase}
                        />
                    </form>
                </div>

                {activeChallenge && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">AGI Approach</h3>
                                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-500"
                                        style={{ width: `${agiState.learningProgress}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Narrow AI Approach</h3>
                                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gray-500 transition-all duration-500"
                                        style={{ width: `${narrowAIProgress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-green-500">
                                <Zap />
                                <span>AGI adapts to any task through universal learning</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}