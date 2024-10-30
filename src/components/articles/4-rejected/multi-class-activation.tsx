"use client"
import { useState, useEffect } from "react";
import { Music, Volume2, Zap, Radio, Mic2, Activity } from "lucide-react";

interface Stage {
  id: number;
  name: string;
  icon: JSX.Element;
  baseFrequency: number;
}

interface StageActivation {
  id: number;
  activation: number;
}

const STAGES: Stage[] = [
  { id: 1, name: "Rock", icon: <Zap size={24} />, baseFrequency: 150 },
  { id: 2, name: "Jazz", icon: <Radio size={24} />, baseFrequency: 300 },
  { id: 3, name: "Pop", icon: <Mic2 size={24} />, baseFrequency: 450 },
  { id: 4, name: "Electronic", icon: <Activity size={24} />, baseFrequency: 600 },
];

export default function MultiClassActivation() {
  const [frequency, setFrequency] = useState<number>(300);
  const [activations, setActivations] = useState<StageActivation[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [challenge, setChallenge] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    calculateActivations();
    return () => {
      setActivations([]);
    };
  }, [frequency]);

  useEffect(() => {
    if (!challenge) {
      const timer = setTimeout(() => {
        setChallenge(Math.floor(Math.random() * STAGES.length) + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [score]);

  const calculateActivations = () => {
    const newActivations = STAGES.map(stage => ({
      id: stage.id,
      activation: Math.exp(-(Math.pow(frequency - stage.baseFrequency, 2) / 20000))
    }));
    setActivations(newActivations);
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrequency(Number(e.target.value));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => {
    setIsDragging(false);
    checkChallenge();
  };

  const checkChallenge = () => {
    const maxActivation = Math.max(...activations.map(a => a.activation));
    const winningStage = activations.find(a => a.activation === maxActivation);
    
    if (winningStage && challenge === winningStage.id) {
      setScore(prev => prev + 1);
      setChallenge(null);
    }
  };

  const getStageClass = (stageId: number, activation: number) => {
    const baseClass = "transition-all duration-300 p-4 rounded-lg flex flex-col items-center";
    const isWinner = activation === Math.max(...activations.map(a => a.activation));
    const isChallenge = challenge === stageId;
    
    if (isWinner) return `${baseClass} bg-blue-500 text-white`;
    if (isChallenge) return `${baseClass} bg-green-500 text-white`;
    return `${baseClass} bg-gray-200`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Festival Stage Selector</h2>
        <p className="text-gray-600">Score: {score}</p>
        {challenge && (
          <p className="text-green-600 font-semibold">
            Activate the {STAGES.find(s => s.id === challenge)?.name} stage!
          </p>
        )}
      </div>

      <div className="relative py-8">
        <input
          type="range"
          min="0"
          max="800"
          value={frequency}
          onChange={handleFrequencyChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          aria-label="Frequency control"
        />
        <div className="flex items-center justify-between mt-2">
          <Volume2 size={20} />
          <Music size={20} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const activation = activations.find(a => a.id === stage.id)?.activation || 0;
          return (
            <div
              key={stage.id}
              className={getStageClass(stage.id, activation)}
              style={{ opacity: 0.3 + activation * 0.7 }}
              role="button"
              tabIndex={0}
            >
              {stage.icon}
              <span className="mt-2">{stage.name}</span>
              <span className="text-sm">
                {(activation * 100).toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}