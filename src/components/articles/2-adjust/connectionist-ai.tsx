"use client"
import { useState, useEffect } from "react";
import { BrainCog, Zap, Info, Network, ArrowRight } from "lucide-react";

interface NeuronType {
  id: number;
  x: number;
  y: number;
  activated: boolean;
  label: string;
}

interface ConnectionType {
  from: number;
  to: number;
  strength: number;
}

const INITIAL_NEURONS: NeuronType[] = [
  { id: 1, x: 20, y: 30, activated: false, label: "Input" },
  { id: 2, x: 40, y: 20, activated: false, label: "Hidden" },
  { id: 3, x: 60, y: 30, activated: false, label: "Hidden" },
  { id: 4, x: 80, y: 20, activated: false, label: "Output" },
  { id: 5, x: 50, y: 70, activated: false, label: "Context" },
];

const CONNECTIONS: ConnectionType[] = [
  { from: 1, to: 2, strength: 0.8 },
  { from: 2, to: 3, strength: 0.6 },
  { from: 3, to: 4, strength: 0.7 },
  { from: 5, to: 3, strength: 0.9 },
];

export default function Connectionist() {
  const [neurons, setNeurons] = useState<NeuronType[]>(INITIAL_NEURONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  const activateNetwork = () => {
    setIsProcessing(true);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      if (currentStep >= CONNECTIONS.length) {
        setIsProcessing(false);
        setNeurons(INITIAL_NEURONS);
        setCurrentStep(0);
        return;
      }

      setNeurons(prev => {
        const newNeurons = [...prev];
        const connection = CONNECTIONS[currentStep];
        newNeurons[connection.from - 1].activated = true;
        newNeurons[connection.to - 1].activated = true;
        return newNeurons;
      });

      setCurrentStep(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing, currentStep]);

  return (
    <div className="relative w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-xl overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BrainCog className="w-10 h-10 text-blue-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Connectionist AI</h2>
            <p className="text-sm text-gray-600">Inspired by Neural Networks</p>
          </div>
        </div>
        <button
          onClick={activateNetwork}
          disabled={isProcessing}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
        >
          <Zap className="w-5 h-5" />
          Simulate Network
        </button>
      </div>

      <div className="relative h-96 bg-white rounded-xl p-6 shadow-inner">
        <svg className="w-full h-full">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
            </marker>
          </defs>
          {CONNECTIONS.map((conn, idx) => {
            const from = neurons[conn.from - 1];
            const to = neurons[conn.to - 1];
            return (
              <line
                key={`${conn.from}-${conn.to}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={currentStep > idx ? "#3B82F6" : "#CBD5E1"}
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
                className="transition-all duration-500"
              />
            );
          })}
          {neurons.map(neuron => (
            <g key={neuron.id} 
               onMouseEnter={() => setShowTooltip(neuron.id)}
               onMouseLeave={() => setShowTooltip(null)}>
              <circle
                cx={`${neuron.x}%`}
                cy={`${neuron.y}%`}
                r="25"
                fill={neuron.activated ? "#3B82F6" : "#CBD5E1"}
                className="transition-all duration-500 hover:filter hover:brightness-110 cursor-pointer"
              />
              <text
                x={`${neuron.x}%`}
                y={`${neuron.y}%`}
                textAnchor="middle"
                dy=".3em"
                fill="white"
                className="text-sm font-bold"
              >
                {neuron.id}
              </text>
              {showTooltip === neuron.id && (
                <g>
                  <rect
                    x={`${neuron.x + 5}%`}
                    y={`${neuron.y - 10}%`}
                    width="80"
                    height="25"
                    rx="4"
                    fill="white"
                    stroke="#3B82F6"
                  />
                  <text
                    x={`${neuron.x + 45}%`}
                    y={`${neuron.y}%`}
                    textAnchor="middle"
                    dy=".3em"
                    fill="#3B82F6"
                    className="text-xs"
                  >
                    {neuron.label}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-700 leading-relaxed">
            This visualization demonstrates how Connectionist AI processes information through interconnected nodes, similar to neurons in your brain. Each node receives, processes, and transmits signals, creating a network that can learn and adapt. Hover over nodes to see their roles!
          </p>
        </div>
      </div>
    </div>
  );
}