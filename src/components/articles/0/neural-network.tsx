"use client";

import { useState, useEffect } from "react";
import { Brain, Circle, ArrowRight, Info } from "lucide-react";

type Neuron = {
  id: number;
  x: number;
  y: number;
  active: boolean;
  label: string;
};

type Connection = {
  from: number;
  to: number;
  weight: number;
  active: boolean;
};

const initialNeurons: Neuron[] = [
  { id: 1, x: 100, y: 100, active: false, label: "Input 1" },
  { id: 2, x: 100, y: 200, active: false, label: "Input 2" },
  { id: 3, x: 100, y: 300, active: false, label: "Input 3" },
  { id: 4, x: 300, y: 150, active: false, label: "Reasoning" },
  { id: 5, x: 300, y: 250, active: false, label: "Learning" },
  { id: 6, x: 500, y: 200, active: false, label: "Output" }
];

const initialConnections: Connection[] = [
  { from: 1, to: 4, weight: 0.5, active: false },
  { from: 1, to: 5, weight: 0.3, active: false },
  { from: 2, to: 4, weight: 0.6, active: false },
  { from: 2, to: 5, weight: 0.4, active: false },
  { from: 3, to: 4, weight: 0.2, active: false },
  { from: 3, to: 5, weight: 0.7, active: false },
  { from: 4, to: 6, weight: 0.8, active: false },
  { from: 5, to: 6, weight: 0.5, active: false }
];

const NeuralNetworkDemo = () => {
  const [neurons, setNeurons] = useState<Neuron[]>(initialNeurons);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const timer = setInterval(() => {
        setStep(prev => (prev + 1) % 8);
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [isAnimating]);

  useEffect(() => {
    const updateNetwork = () => {
      setNeurons(prevNeurons => {
        const newNeurons = [...prevNeurons];
        newNeurons.forEach(n => n.active = false);
        
        switch(step) {
          case 0:
            newNeurons.forEach(n => {
              if (n.id <= 3) n.active = true;
            });
            break;
          case 1:
          case 2:
            newNeurons.forEach(n => {
              if (n.id <= 5) n.active = true;
            });
            break;
          case 3:
          case 4:
            newNeurons.forEach(n => n.active = true);
            break;
        }
        return newNeurons;
      });

      setConnections(prevConnections => {
        const newConnections = [...prevConnections];
        newConnections.forEach(c => c.active = false);
        
        switch(step) {
          case 1:
            newConnections.slice(0, 6).forEach(c => c.active = true);
            break;
          case 2:
          case 3:
            newConnections.forEach(c => c.active = true);
            break;
        }
        return newConnections;
      });
    };

    updateNetwork();
  }, [step]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-blue-500" />
          Functional AGI Visualization
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Observe how AGI systems process information
        </p>
      </div>

      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-inner">
        <svg width="600" height="400" viewBox="0 0 600 400" className="max-w-full h-auto">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {connections.map((conn, i) => {
            const from = neurons.find(n => n.id === conn.from);
            const to = neurons.find(n => n.id === conn.to);
            if (!from || !to) return null;
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={conn.active ? "#3B82F6" : "#CBD5E1"}
                strokeWidth={conn.active ? 4 : 2}
                className="transition-all duration-500"
                filter={conn.active ? "url(#glow)" : ""}
              />
            )
          })}

          {neurons.map((neuron) => (
            <g key={neuron.id}>
              <circle
                cx={neuron.x}
                cy={neuron.y}
                r={25}
                className={`
                  ${neuron.active 
                    ? "fill-blue-500 dark:fill-blue-400" 
                    : "fill-gray-200 dark:fill-gray-600"}
                  transition-all duration-500
                `}
                filter={neuron.active ? "url(#glow)" : ""}
              />
              <text
                x={neuron.x}
                y={neuron.y + 45}
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-300"
              >
                {neuron.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute top-2 left-2 flex gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
          >
            <Info className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-500" />
          </button>
        </div>

        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`
            absolute bottom-2 right-2 px-4 py-2 rounded-lg
            ${isAnimating 
              ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700" 
              : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"}
            text-white font-semibold transition-colors
            flex items-center gap-2 text-sm
          `}
        >
          {isAnimating ? "Stop" : "Start"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {showInfo && (
        <div className="mt-4 mb-4 p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg border border-blue-100 dark:border-gray-600">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              <p>
                This network demonstrates the core cognitive functions of an AGI system:
              </p>
              <ul className="mt-2 space-y-1">
                <li>• <span className="font-medium">Inputs (1-3)</span>: Raw data from various sources</li>
                <li>• <span className="font-medium">Reasoning</span>: Pattern analysis and logical processing</li>
                <li>• <span className="font-medium">Learning</span>: Experience-based adaptation and improvement</li>
                <li>• <span className="font-medium">Output</span>: Final processed result or decision</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <details className="group">
          <summary className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Understanding the AI Connection</span>
            <span className="text-blue-500 group-open:rotate-180 transition-transform duration-200">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </summary>
          <div className="p-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>
              This visualization represents a simplified version of how modern AI systems process information:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">Input Nodes (1-3):</span> Represent raw data input, similar to how AI systems receive data from various sources (text, images, sensors).
              </li>
              <li>
                <span className="font-medium">Reasoning Node:</span> Simulates how AI analyzes patterns and applies logical rules to understand relationships in data.
              </li>
              <li>
                <span className="font-medium">Learning Node:</span> Represents the system's ability to adapt and improve from experience, similar to how neural networks adjust their weights during training.
              </li>
              <li>
                <span className="font-medium">Output Node:</span> Shows the final result after processing, which could be a decision, prediction, or generated content.
              </li>
            </ul>
            <p>
              The glowing connections show how information flows through the system, similar to how neural networks propagate and transform data through multiple layers to arrive at meaningful outputs.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default NeuralNetworkDemo;