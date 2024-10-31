"use client"
import { useState, useEffect } from "react";
import { Medal, Timer, Trophy, Flag, User, BarChart, AlertCircle, CheckCircle } from "lucide-react";

interface CompetitorType {
    id: number;
    name: string;
    score: number;
    progress: number;
}

interface BenchmarkProps {}

/**
 * BenchmarkVisualizer: Interactive component teaching benchmarking concepts
 * through an Olympic-style competition metaphor.
 */
const BenchmarkVisualizer: React.FC<BenchmarkProps> = () => {
    const [competitors, setCompetitors] = useState<CompetitorType[]>([
        { id: 1, name: "Model A", score: 0, progress: 0 },
        { id: 2, name: "Model B", score: 0, progress: 0 },
        { id: 3, name: "Model C", score: 0, progress: 0 }
    ]);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [currentTest, setCurrentTest] = useState<number>(0);

    const tests = ["Speed Test", "Accuracy Test", "Efficiency Test"];

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setCompetitors(prev => prev.map(comp => ({
                ...comp,
                progress: comp.progress + Math.random() * 5,
                score: comp.progress > 100 ? comp.score + 1 : comp.score
            })));
        }, 100);

        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        const allFinished = competitors.every(c => c.progress >= 100);
        if (allFinished) {
            setIsRunning(false);
            if (currentTest < tests.length - 1) {
                setTimeout(() => {
                    setCurrentTest(prev => prev + 1);
                    setCompetitors(prev => prev.map(c => ({ ...c, progress: 0 })));
                }, 1000);
            }
        }
    }, [competitors, currentTest]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handleReset = () => {
        setIsRunning(false);
        setCurrentTest(0);
        setCompetitors(prev => prev.map(c => ({ ...c, progress: 0, score: 0 })));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="text-blue-500" />
                    AI Benchmark Olympics
                </h2>
                <div className="flex gap-2">
                    <Timer className="text-gray-600" />
                    <span>Test {currentTest + 1}: {tests[currentTest]}</span>
                </div>
            </div>

            <div className="space-y-6">
                {competitors.map((competitor) => (
                    <div key={competitor.id} className="relative">
                        <div className="flex items-center gap-4 mb-2">
                            <User className="text-gray-600" />
                            <span className="font-medium">{competitor.name}</span>
                            <Medal className={`${competitor.score > 1 ? 'text-blue-500' : 'text-gray-400'}`} />
                            <span>Score: {competitor.score}</span>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${Math.min(competitor.progress, 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
                <div className="flex gap-4">
                    <button
                        onClick={handleStart}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                        aria-label="Start benchmark test"
                    >
                        <Flag /> Start Test
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
                        aria-label="Reset benchmark"
                    >
                        <AlertCircle /> Reset
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <BarChart className="text-gray-600" />
                    <span>Testing under identical conditions</span>
                    <CheckCircle className="text-green-500" />
                </div>
            </div>
        </div>
    );
};

export default BenchmarkVisualizer;