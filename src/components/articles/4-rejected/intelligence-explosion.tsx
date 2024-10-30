"use client"
import { useState, useEffect } from "react";
import { Brain, Zap, Lock, Rocket, AlertTriangle, BookOpen, Cpu, LineChart } from "lucide-react";

interface SimulationState {
  intelligence: number;
  learningRate: number;
  resources: number;
  stage: number;
  isRunning: boolean;
}

const MILESTONES = [
  { level: 10, description: "Basic AI", icon: Brain },
  { level: 50, description: "Human-Level AI", icon: BookOpen },
  { level: 100, description: "Superintelligence", icon: Zap },
];

const BOTTLENECKS = [
  { name: "Computational Limits", icon: Cpu },
  { name: "Ethical Boundaries", icon: Lock },
  { name: "Resource Constraints", icon: AlertTriangle },
];

/**
 * Interactive Intelligence Explosion Simulator for students
 * Demonstrates exponential growth of AI capabilities
 */
const IntelligenceExplosionSimulator = () => {
  const [simulation, setSimulation] = useState<SimulationState>({
    intelligence: 1,
    learningRate: 1.2,
    resources: 100,
    stage: 0,
    isRunning: false,
  });

  const [activeBottlenecks, setActiveBottlenecks] = useState<string[]>([]);

  useEffect(() => {
    let animationFrame: number;
    
    const updateSimulation = () => {
      if (simulation.isRunning) {
        setSimulation(prev => {
          const bottleneckFactor = 1 - (activeBottlenecks.length * 0.2);
          const growthRate = prev.learningRate * bottleneckFactor;
          return {
            ...prev,
            intelligence: prev.intelligence * growthRate,
            stage: Math.min(2, Math.floor(prev.intelligence / 40))
          };
        });
        animationFrame = requestAnimationFrame(updateSimulation);
      }
    };

    if (simulation.isRunning) {
      animationFrame = requestAnimationFrame(updateSimulation);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [simulation.isRunning, activeBottlenecks]);

  const toggleBottleneck = (name: string) => {
    setActiveBottlenecks(prev =>
      prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name]
    );
  };

  const resetSimulation = () => {
    setSimulation({
      intelligence: 1,
      learningRate: 1.2,
      resources: 100,
      stage: 0,
      isRunning: false,
    });
    setActiveBottlenecks([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Intelligence Explosion Simulator</h2>
        <Rocket className={`w-6 h-6 ${simulation.isRunning ? 'text-blue-500' : 'text-gray-400'}`} />
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <LineChart className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-semibold">
            Intelligence Level: {Math.round(simulation.intelligence)}
          </span>
        </div>
        
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${Math.min((simulation.intelligence / 100) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {BOTTLENECKS.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => toggleBottleneck(name)}
            className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300
              ${activeBottlenecks.includes(name) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            aria-pressed={activeBottlenecks.includes(name)}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{name}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setSimulation(prev => ({ ...prev, isRunning: !prev.isRunning }))}
          className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
        >
          {simulation.isRunning ? 'Pause' : 'Start'} Simulation
        </button>
        <button
          onClick={resetSimulation}
          className="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default IntelligenceExplosionSimulator;