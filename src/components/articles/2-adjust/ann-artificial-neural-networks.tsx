"use client"
import { useState, useEffect } from "react";
import { Brain, Circle, ArrowRight, Zap, Info } from "lucide-react";

interface NeuronType {
  id: number;
  active: boolean;
  x: number;
  y: number;
  label: string;
  description: string;
}

interface Connection {
  from: number;
  to: number;
  weight: number;
}

export default function ANNVisualizer() {
  const [neurons, setNeurons] = useState<NeuronType[]>([
    { id: 1, active: false, x: 100, y: 100, label: "Input 1", description: "Receives raw data from the environment" },
    { id: 2, active: false, x: 100, y: 200, label: "Input 2", description: "Processes visual patterns" },
    { id: 3, active: false, x: 100, y: 300, label: "Input 3", description: "Analyzes numerical features" },
    { id: 4, active: false, x: 300, y: 150, label: "Hidden 1", description: "Extracts higher-level patterns" },
    { id: 5, active: false, x: 300, y: 250, label: "Hidden 2", description: "Combines learned features" },
    { id: 6, active: false, x: 500, y: 200, label: "Output", description: "Makes final prediction" },
  ]);

  const [hoveredNeuron, setHoveredNeuron] = useState<NeuronType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0);

  const connections: Connection[] = [
    { from: 1, to: 4, weight: 0.8 },
    { from: 2, to: 4, weight: 0.6 },
    { from: 2, to: 5, weight: 0.7 },
    { from: 3, to: 5, weight: 0.9 },
    { from: 4, to: 6, weight: 0.8 },
    { from: 5, to: 6, weight: 0.7 },
  ];

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= 6) {
          setIsProcessing(false);
          return 0;
        }
        return prev + 1;
      });

      setNeurons(prev => 
        prev.map(neuron => ({
          ...neuron,
          active: step >= neuron.id - 1
        }))
      );
    }, 800);

    return () => clearInterval(interval);
  }, [isProcessing, step]);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 overflow-hidden shadow-xl">
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Neural Network Visualization
        </h2>
      </div>

      <button
        onClick={() => setIsProcessing(true)}
        disabled={isProcessing}
        className="absolute top-4 right-4 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
      >
        <Zap className="w-5 h-5" />
        <span className="font-semibold">Activate Network</span>
      </button>

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

        {connections.map(({ from, to, weight }) => {
          const fromNeuron = neurons.find(n => n.id === from)!;
          const toNeuron = neurons.find(n => n.id === to)!;
          return (
            <g key={`${from}-${to}`}>
              <line
                x1={fromNeuron.x}
                y1={fromNeuron.y}
                x2={toNeuron.x}
                y2={toNeuron.y}
                className={`${
                  fromNeuron.active && toNeuron.active
                    ? "stroke-blue-500 filter"
                    : "stroke-gray-300 dark:stroke-gray-600"
                } transition-all duration-500`}
                strokeWidth={weight * 4}
                filter={fromNeuron.active && toNeuron.active ? "url(#glow)" : ""}
              />
            </g>
          );
        })}

        {neurons.map(neuron => (
          <g key={neuron.id}
             onMouseEnter={() => setHoveredNeuron(neuron)}
             onMouseLeave={() => setHoveredNeuron(null)}>
            <circle
              cx={neuron.x}
              cy={neuron.y}
              r={20}
              className={`${
                neuron.active
                  ? "fill-blue-500 stroke-blue-600"
                  : "fill-gray-200 stroke-gray-300 dark:fill-gray-700 dark:stroke-gray-600"
              } transition-all duration-500 cursor-pointer hover:scale-110`}
              filter={neuron.active ? "url(#glow)" : ""}
            />
            <text
              x={neuron.x}
              y={neuron.y + 40}
              className="text-sm text-gray-600 dark:text-gray-300 font-medium"
              textAnchor="middle"
            >
              {neuron.label}
            </text>
          </g>
        ))}
      </svg>

      {hoveredNeuron && (
        <div className="absolute p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xs transition-opacity duration-300"
             style={{ left: hoveredNeuron.x + 30, top: hoveredNeuron.y - 30 }}>
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-gray-800 dark:text-white">{hoveredNeuron.label}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{hoveredNeuron.description}</p>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
          {isProcessing ? (
            <span className="animate-pulse">Processing neural network layers...</span>
          ) : (
            <span>Hover over neurons to learn more about each layer's function</span>
          )}
        </p>
      </div>
    </div>
  );
}