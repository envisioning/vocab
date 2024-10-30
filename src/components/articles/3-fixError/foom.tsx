"use client"
import { useState, useEffect } from "react";
import { Brain, Zap, Virus, TrendingUp, AlertTriangle } from "lucide-react";

interface FoomState {
  stage: number;
  capabilities: number;
  speed: number;
  isRunning: boolean;
  showAnalogy: string | null;
}

const ANALOGIES = [
  { id: "compound", icon: TrendingUp, text: "Like compound interest, each improvement builds on the last" },
  { id: "chain", icon: Zap, text: "Similar to a chain reaction, one advance triggers many more" },
  { id: "viral", icon: Virus, text: "Just as content goes viral, AI capabilities can spread rapidly" }
];

const calculateGrowth = (capabilities: number, stage: number): number => {
  return capabilities * Math.pow(1.5, stage);
};

export default function FoomSimulator() {
  const [state, setState] = useState<FoomState>({
    stage: 0,
    capabilities: 1,
    speed: 1000,
    isRunning: false,
    showAnalogy: null
  });

  useEffect(() => {
    let growthTimer: NodeJS.Timeout;
    
    if (state.isRunning && state.stage < 10) {
      growthTimer = setInterval(() => {
        setState(prev => ({
          ...prev,
          stage: prev.stage + 1,
          capabilities: calculateGrowth(prev.capabilities, prev.stage + 1)
        }));
      }, state.speed);
    }

    return () => clearInterval(growthTimer);
  }, [state.isRunning, state.speed, state.stage]);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, speed: parseInt(e.target.value) }));
  };

  const toggleSimulation = () => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const showAnalogyDetail = (analogyId: string) => {
    setState(prev => ({ ...prev, showAnalogy: analogyId }));
  };

  const resetSimulation = () => {
    setState({
      stage: 0,
      capabilities: 1,
      speed: 1000,
      isRunning: false,
      showAnalogy: null
    });
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">AI Foom Simulator</h1>
      
      <div className="relative mb-8">
        <div className="flex justify-center items-center">
          <Brain 
            className={`transition-all duration-500 text-blue-500`}
            size={24 + state.stage * 20}
          />
        </div>
        
        {state.stage >= 8 && (
          <div className="absolute top-0 right-0 flex items-center text-red-500">
            <AlertTriangle className="mr-2" />
            <span>Critical threshold reached!</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span>Simulation Speed</span>
          <span>{state.speed}ms</span>
        </div>
        <input
          type="range"
          min="200"
          max="2000"
          step="100"
          value={state.speed}
          onChange={handleSpeedChange}
          className="w-full"
          aria-label="Simulation speed control"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {ANALOGIES.map(analogy => (
          <button
            key={analogy.id}
            onClick={() => showAnalogyDetail(analogy.id)}
            className={`p-4 rounded-lg transition-colors duration-300 
              ${state.showAnalogy === analogy.id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            aria-pressed={state.showAnalogy === analogy.id}
          >
            <analogy.icon className="mx-auto mb-2" />
            {state.showAnalogy === analogy.id && (
              <p className="text-sm">{analogy.text}</p>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={toggleSimulation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          aria-label={state.isRunning ? 'Pause simulation' : 'Start simulation'}
        >
          {state.isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}