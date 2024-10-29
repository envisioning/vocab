"use client"
import { useState, useEffect } from "react";
import { Mountain, Building, TreeDeciduous, ArrowRight, Flag, Clock, Brain } from "lucide-react";

interface DomainProgress {
    name: string;
    progress: number;
    description: string;
    icon: JSX.Element;
}

interface Prediction {
    domain: string;
    predictedGrowth: number;
}

const AI_DOMAINS: DomainProgress[] = [
    { name: "Language Models", progress: 85, description: "Natural language processing and generation", icon: <Brain /> },
    { name: "Computer Vision", progress: 70, description: "Image and video understanding", icon: <Mountain /> },
    { name: "Robotics", progress: 45, description: "Physical world interaction", icon: <Building /> },
    { name: "Ethics & Safety", progress: 30, description: "AI safety and ethical frameworks", icon: <TreeDeciduous /> }
];

/**
 * JaggedFrontierExplorer: Interactive component teaching the concept of uneven AI progress
 */
export default function JaggedFrontierExplorer() {
    const [selectedDomain, setSelectedDomain] = useState<string>("");
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [timeScale, setTimeScale] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        if (!isAnimating) return;

        const interval = setInterval(() => {
            setTimeScale(prev => (prev + 1) % 100);
        }, 1000);

        return () => clearInterval(interval);
    }, [isAnimating]);

    const handleDomainClick = (domain: string) => {
        setSelectedDomain(domain);
        setIsAnimating(false);
    };

    const handlePrediction = (domain: string) => {
        if (predictions.find(p => p.domain === domain)) return;
        
        setPredictions([...predictions, {
            domain,
            predictedGrowth: Math.random() * 30 + 10
        }]);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Progress Explorer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {AI_DOMAINS.map(domain => (
                    <div
                        key={domain.name}
                        className={`p-4 rounded-lg transition-all duration-300 cursor-pointer
                            ${selectedDomain === domain.name ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => handleDomainClick(domain.name)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${domain.name} domain`}
                    >
                        <div className="flex items-center gap-3">
                            {domain.icon}
                            <span className="font-semibold">{domain.name}</span>
                        </div>
                        
                        <div className="mt-3 bg-gray-200 h-4 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${domain.progress}%` }}
                                role="progressbar"
                                aria-valuenow={domain.progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                        
                        <p className="mt-2 text-sm">{domain.description}</p>
                        
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrediction(domain.name);
                            }}
                            className="mt-3 flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                            aria-label={`Make prediction for ${domain.name}`}
                        >
                            <Flag size={16} />
                            <span>Predict Growth</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4 mt-4">
                <Clock size={20} />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={timeScale}
                    onChange={(e) => setTimeScale(parseInt(e.target.value))}
                    className="w-full"
                    aria-label="Time scale slider"
                />
            </div>
        </div>
    );
}