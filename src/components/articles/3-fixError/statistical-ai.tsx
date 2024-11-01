"use client"
import { useState, useEffect } from "react";
import { Brain, ChartBar, Database, Calculator, Sparkles, ArrowRight, Info, Zap, Target } from "lucide-react";

interface DataPoint {
    id: number;
    value: number;
    probability: number;
    color: string;
}

interface TooltipState {
    show: boolean;
    x: number;
    y: number;
    content: string;
}

const StatisticalAIVisualizer = () => {
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [tooltip, setTooltip] = useState<TooltipState>({ show: false, x: 0, y: 0, content: '' });
    const [confidence, setConfidence] = useState(0);

    useEffect(() => {
        const initialData = Array.from({ length: 8 }, (_, i) => ({
            id: i,
            value: Math.random() * 80 + 20,
            probability: Math.random(),
            color: '#3B82F6'
        }));
        setDataPoints(initialData);
        return () => setDataPoints([]);
    }, []);

    useEffect(() => {
        if (isAnimating) {
            const interval = setInterval(() => {
                setDataPoints(prev => prev.map(point => ({
                    ...point,
                    value: Math.min(100, Math.max(20, point.value + (Math.random() - 0.5) * 15)),
                    probability: Math.random()
                })));
                setConfidence(prev => Math.min(100, prev + 5));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isAnimating]);

    const handlePointHover = (e: React.MouseEvent, point: DataPoint) => {
        setTooltip({
            show: true,
            x: e.clientX,
            y: e.clientY,
            content: `Data Point ${point.id + 1}\nValue: ${point.value.toFixed(1)}\nProbability: ${(point.probability * 100).toFixed(1)}%`
        });
    };

    const handlePointLeave = () => {
        setTooltip(prev => ({ ...prev, show: false }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-center space-x-4 text-blue-400">
                    <Brain className="w-10 h-10 animate-pulse" />
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Statistical AI Explorer
                    </h1>
                </div>

                <div className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-4">
                            <Database className="w-6 h-6 text-blue-400" />
                            <div className="flex flex-col">
                                <span className="text-xl font-semibold text-blue-400">Probability Distribution</span>
                                <span className="text-sm text-gray-400">Statistical Pattern Analysis</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAnimating(!isAnimating)}
                            className={`px-6 py-3 rounded-lg transition duration-500 flex items-center space-x-2 ${
                                isAnimating ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                            } text-white font-semibold`}
                        >
                            <Zap className="w-5 h-5" />
                            <span>{isAnimating ? 'Pause Learning' : 'Start Learning'}</span>
                        </button>
                    </div>

                    <div className="relative h-80 flex items-end justify-around bg-gray-900 rounded-lg p-4">
                        {dataPoints.map((point) => (
                            <div
                                key={point.id}
                                onMouseEnter={(e) => handlePointHover(e, point)}
                                onMouseLeave={handlePointLeave}
                                className="relative w-12 rounded-t-lg cursor-pointer transition-all duration-500 hover:opacity-80 flex flex-col items-center"
                            >
                                <div
                                    className="w-full rounded-t-lg transition-all duration-500"
                                    style={{
                                        height: `${point.value}%`,
                                        background: `linear-gradient(180deg, ${point.color} 0%, rgba(59, 130, 246, 0.5) 100%)`
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex items-center justify-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Calculator className="w-6 h-6 text-purple-400" />
                            <span className="text-gray-300">Processing</span>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-500" />
                        <div className="flex items-center space-x-2">
                            <Target className="w-6 h-6 text-green-400" />
                            <span className="text-gray-300">Confidence: {confidence}%</span>
                        </div>
                    </div>
                </div>

                {tooltip.show && (
                    <div
                        className="fixed bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-blue-500 text-sm z-50 pointer-events-none"
                        style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
                    >
                        <pre className="whitespace-pre-line">{tooltip.content}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatisticalAIVisualizer;