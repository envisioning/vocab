"use client"
import { useState, useEffect } from "react";
import { Brain, Sparkles, Network, Binary, Info, Zap, CircleOff } from "lucide-react";

interface NeuronPosition {
    x: number;
    y: number;
    active: boolean;
}

interface TooltipState {
    show: boolean;
    x: number;
    y: number;
    content: string;
}

export default function SubsymbolicAI() {
    const [neurons, setNeurons] = useState<NeuronPosition[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [activePattern, setActivePattern] = useState<number>(0);
    const [tooltip, setTooltip] = useState<TooltipState>({ show: false, x: 0, y: 0, content: '' });

    useEffect(() => {
        const generateNeurons = () => {
            const newNeurons = Array.from({ length: 32 }, (_, i) => ({
                x: 150 + Math.cos(i * (Math.PI / 16)) * 180,
                y: 200 + Math.sin(i * (Math.PI / 16)) * 180,
                active: false
            }));
            setNeurons(newNeurons);
        };

        generateNeurons();
        return () => setNeurons([]);
    }, []);

    const activatePattern = () => {
        setIsProcessing(true);
        const patterns = [
            [0, 4, 8, 12, 16, 20],
            [2, 6, 10, 14, 18, 22],
            [1, 5, 9, 13, 17, 21],
            [3, 7, 11, 15, 19, 23]
        ];

        const newNeurons = neurons.map((n, i) => ({
            ...n,
            active: patterns[activePattern].includes(i)
        }));

        setNeurons(newNeurons);
        setActivePattern((prev) => (prev + 1) % 4);

        const timer = setTimeout(() => setIsProcessing(false), 800);
        return () => clearTimeout(timer);
    };

    return (
        <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Subsymbolic AI Neural Network</h2>
                </div>
                <button
                    onMouseEnter={(e) => setTooltip({
                        show: true,
                        x: e.clientX,
                        y: e.clientY,
                        content: "Subsymbolic AI processes information through patterns of neural activation rather than explicit symbols, similar to how our brains work!"
                    })}
                    onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, content: '' })}
                    className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors duration-300"
                >
                    <Info className="w-5 h-5 text-blue-400" />
                </button>
            </div>

            <svg className="w-full h-full">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                {neurons.map((neuron, i) => (
                    <g key={i}>
                        {neurons.map((target, j) => (
                            <line
                                key={`${i}-${j}`}
                                x1={neuron.x}
                                y1={neuron.y}
                                x2={target.x}
                                y2={target.y}
                                className={`${
                                    neuron.active && target.active
                                        ? "stroke-blue-400 stroke-2 opacity-40"
                                        : "stroke-slate-700 opacity-10"
                                } transition-all duration-500`}
                            />
                        ))}
                        <circle
                            cx={neuron.x}
                            cy={neuron.y}
                            r={8}
                            filter="url(#glow)"
                            className={`${
                                neuron.active
                                    ? "fill-blue-400 shadow-lg"
                                    : "fill-slate-600"
                            } transition-all duration-300`}
                        />
                    </g>
                ))}
            </svg>

            {tooltip.show && (
                <div 
                    style={{ left: tooltip.x, top: tooltip.y }}
                    className="absolute z-10 max-w-xs bg-slate-800 p-4 rounded-lg shadow-xl text-white text-sm"
                >
                    {tooltip.content}
                </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={activatePattern}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 
                                 hover:from-blue-700 hover:to-blue-600 text-white rounded-full transition-all 
                                 duration-300 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                    >
                        {isProcessing ? (
                            <>
                                <Sparkles className="w-5 h-5 animate-spin" />
                                Processing Pattern
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                Activate Neural Pattern
                            </>
                        )}
                    </button>
                </div>
                <p className="text-slate-300 text-sm bg-slate-800/50 px-4 py-2 rounded-full">
                    Watch how neural networks distribute and process information through activation patterns
                </p>
            </div>
        </div>
    );
}