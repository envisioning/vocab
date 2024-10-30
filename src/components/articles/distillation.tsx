"use client"
import { useState, useEffect } from "react";
import { Book, ChefHat, Slider, Brain, Zap, MemoryStick } from "lucide-react";

interface ScenarioType {
    id: number;
    title: string;
    original: string;
    compressed: string;
    icon: JSX.Element;
    performance: number[];
    resources: number[];
}

interface ComponentProps {}

const SCENARIOS: ScenarioType[] = [
    {
        id: 1,
        title: "Book Knowledge",
        original: "400-page novel",
        compressed: "40-page summary",
        icon: <Book className="w-8 h-8" />,
        performance: [100, 95, 85, 70, 50],
        resources: [100, 40, 20, 10, 5]
    },
    {
        id: 2,
        title: "Cooking Skills",
        original: "Professional Kitchen",
        compressed: "Home Kitchen",
        icon: <ChefHat className="w-8 h-8" />,
        performance: [100, 90, 80, 65, 45],
        resources: [100, 35, 15, 8, 4]
    }
];

const DistillationLearner = ({}: ComponentProps) => {
    const [currentScenario, setCurrentScenario] = useState<number>(0);
    const [compressionLevel, setCompressionLevel] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState<boolean>(true);

    useEffect(() => {
        if (isAnimating) {
            const interval = setInterval(() => {
                setCompressionLevel(prev => (prev < 4 ? prev + 1 : 0));
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [isAnimating]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAnimating(false);
        setCompressionLevel(Number(e.target.value));
    };

    const handleScenarioChange = (id: number) => {
        setCurrentScenario(id);
        setCompressionLevel(0);
    };

    const scenario = SCENARIOS[currentScenario];
    const performanceValue = scenario.performance[compressionLevel];
    const resourceValue = scenario.resources[compressionLevel];

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Brain /> Knowledge Shrink Ray
            </h2>

            <div className="flex gap-4 mb-6">
                {SCENARIOS.map((s, idx) => (
                    <button
                        key={s.id}
                        onClick={() => handleScenarioChange(idx)}
                        className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-300
                            ${currentScenario === idx ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        aria-pressed={currentScenario === idx}
                    >
                        {s.icon} {s.title}
                    </button>
                ))}
            </div>

            <div className="relative mb-8 p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between mb-4">
                    <div className="text-lg font-semibold">{scenario.original}</div>
                    <div className="text-lg font-semibold">{scenario.compressed}</div>
                </div>

                <input
                    type="range"
                    min="0"
                    max="4"
                    value={compressionLevel}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    aria-label="Compression level"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="text-blue-500" />
                        <span className="font-semibold">Performance</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${performanceValue}%` }}
                            aria-label={`Performance: ${performanceValue}%`}
                        />
                    </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-2">
                        <MemoryStick className="text-blue-500" />
                        <span className="font-semibold">Resources</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${resourceValue}%` }}
                            aria-label={`Resources: ${resourceValue}%`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistillationLearner;