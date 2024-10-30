"use client"
import { useState, useEffect } from "react";
import { Building2, Users, ArrowRight, Brain, ZoomIn, ZoomOut, Play, Pause, RotateCcw } from "lucide-react";

interface NeuronNode {
  id: string;
  x: number;
  y: number;
  active: boolean;
  connections: string[];
}

interface Signal {
  id: string;
  sourceId: string;
  targetId: string;
  progress: number;
}

interface BioNetCityProps {
  initialSpeed?: number;
}

/**
 * BioNetCity: An interactive visualization of biological neural networks
 * using a city metaphor where buildings represent neurons and signals
 * flow through streets like information through synapses.
 */
const BioNetCity = ({ initialSpeed = 1 }: BioNetCityProps) => {
  const [neurons, setNeurons] = useState<NeuronNode[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [speed, setSpeed] = useState(initialSpeed);

  useEffect(() => {
    // Initialize network
    const initialNeurons: NeuronNode[] = Array.from({ length: 6 }, (_, i) => ({
      id: `n${i}`,
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 400,
      active: false,
      connections: [`n${(i + 1) % 6}`],
    }));
    setNeurons(initialNeurons);

    return () => {
      setNeurons([]);
      setSignals([]);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSignals(prev => {
        const updated = prev.map(signal => ({
          ...signal,
          progress: signal.progress + 0.1 * speed,
        }));

        // Activate neurons when signals reach them
        updated.forEach(signal => {
          if (signal.progress >= 1) {
            setNeurons(prev => 
              prev.map(n => 
                n.id === signal.targetId ? { ...n, active: true } : n
              )
            );
          }
        });

        return updated.filter(s => s.progress < 1);
      });

      // Generate new signals from active neurons
      setNeurons(prev => {
        const newSignals: Signal[] = [];
        prev.forEach(neuron => {
          if (neuron.active) {
            neuron.connections.forEach(targetId => {
              const signalId = `s${Date.now()}-${Math.random()}`;
              newSignals.push({
                id: signalId,
                sourceId: neuron.id,
                targetId,
                progress: 0,
              });
            });
          }
        });
        setSignals(s => [...s, ...newSignals]);
        return prev.map(n => ({ ...n, active: false }));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handleReset = () => {
    setSignals([]);
    setNeurons(prev => prev.map(n => ({ ...n, active: false })));
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
          aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
          aria-label="Reset simulation"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      <div 
        className="relative w-full h-full transform"
        style={{ transform: `scale(${zoom})` }}
      >
        {neurons.map(neuron => (
          <div
            key={neuron.id}
            className={`absolute transition-colors duration-300 ${
              neuron.active ? 'text-green-500' : 'text-gray-600'
            }`}
            style={{ left: neuron.x, top: neuron.y }}
          >
            <Building2 size={32} />
          </div>
        ))}

        {signals.map(signal => (
          <div
            key={signal.id}
            className="absolute w-4 h-4 bg-blue-500 rounded-full transition-all duration-300"
            style={{
              left: neurons.find(n => n.id === signal.sourceId)?.x,
              top: neurons.find(n => n.id === signal.sourceId)?.y,
              transform: `translate(${signal.progress * 100}%, ${signal.progress * 100}%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BioNetCity;