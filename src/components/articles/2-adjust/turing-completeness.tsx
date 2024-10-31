"use client"
import { useState, useEffect } from 'react'
import {
  Binary,
  Infinity,
  Brain,
  Sparkles,
  Play,
  PauseCircle,
  RefreshCcw,
  Zap
} from 'lucide-react'

interface Cell {
  value: string;
  active: boolean;
  processing: boolean;
  highlight: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const COLORS = {
  primary: 'rgba(59, 130, 246, 0.8)',
  secondary: 'rgba(139, 92, 246, 0.8)',
  accent: 'rgba(236, 72, 153, 0.8)'
}

const ArtisticTuringMachine = () => {
  const [cells, setCells] = useState<Cell[]>(Array(15).fill(null).map(() => ({
    value: Math.random() > 0.5 ? '1' : '0',
    active: false,
    processing: false,
    highlight: false
  })));

  const [headPosition, setHeadPosition] = useState(7);
  const [isRunning, setIsRunning] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mode, setMode] = useState<'compute' | 'transform' | 'create'>('compute');
  const [cycleCount, setCycleCount] = useState(0);

  const createParticle = (x: number, y: number) => ({
    id: Math.random(),
    x,
    y,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    life: 1
  });

  const spawnParticles = (x: number, y: number, count: number) => {
    const newParticles = Array(count).fill(null).map(() => createParticle(x, y));
    setParticles(prev => [...prev, ...newParticles]);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCells(prev => {
        const next = [...prev];
        const current = next[headPosition];

        if (mode === 'compute') {
          next[headPosition] = {
            ...current,
            value: current.value === '1' ? '0' : '1',
            processing: true,
            highlight: true
          };
        } else if (mode === 'transform') {
          const target = (headPosition + 2) % next.length;
          next[target] = { ...next[headPosition], highlight: true };
          next[headPosition] = { ...current, value: '0', processing: true };
        } else {
          next[headPosition] = {
            ...current,
            value: Math.random() > 0.7 ? '1' : '0',
            processing: true,
            highlight: true
          };
        }

        return next;
      });

      setHeadPosition(prev => (prev + 1) % cells.length);
      setCycleCount(prev => prev + 1);

      // Spawn particles at the current head position
      const cellElement = document.getElementById(`cell-${headPosition}`);
      if (cellElement) {
        const rect = cellElement.getBoundingClientRect();
        spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 3);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isRunning, headPosition, mode, cells.length]);

  // Particle animation effect
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02,
            vy: p.vy + 0.1 // Gravity effect
          }))
          .filter(p => p.life > 0)
      );
    };

    const animation = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animation);
  }, [particles]);

  const toggleSimulation = () => setIsRunning(prev => !prev);

  const changeMode = () => {
    setMode(prev => {
      if (prev === 'compute') return 'transform';
      if (prev === 'transform') return 'create';
      return 'compute';
    });
    setCells(prev => prev.map(cell => ({ ...cell, highlight: false, processing: false })));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-4xl">
        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: mode === 'compute' ? COLORS.primary :
                mode === 'transform' ? COLORS.secondary : COLORS.accent,
              opacity: particle.life,
              transform: `scale(${particle.life})`,
              transition: 'all 0.05s linear'
            }}
          />
        ))}

        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Brain className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Universal Computation
            </h1>
            <Infinity className="w-12 h-12 text-pink-400" />
          </div>
          <p className="text-gray-400 text-lg">
            Witness the elegance of Turing completeness through symbolic manipulation
          </p>
        </div>

        {/* Turing Machine Visualization */}
        <div className="relative mb-12">
          <div className="flex justify-center items-center gap-1">
            {cells.map((cell, index) => (
              <div
                id={`cell-${index}`}
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-lg
                  transition-all duration-500 transform
                  ${cell.highlight ? 'scale-110' : 'scale-100'}
                  ${cell.processing ? 'bg-opacity-30' : 'bg-opacity-10'}
                  ${index === headPosition ? 'ring-2 ring-offset-2 ring-offset-gray-900' : ''}
                  ${mode === 'compute' ? 'ring-blue-400 bg-blue-900' :
                    mode === 'transform' ? 'ring-purple-400 bg-purple-900' :
                      'ring-pink-400 bg-pink-900'}`}
              >
                <span className={`text-2xl font-mono transition-all duration-300
                  ${cell.highlight ? 'opacity-100' : 'opacity-70'}`}>
                  {cell.value}
                </span>
              </div>
            ))}
          </div>

          {/* Reading Head */}
          <div
            className="absolute top-full mt-2 w-12 h-6 transition-all duration-500 flex justify-center"
            style={{
              left: `${(headPosition * 3.25) + 50}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <Sparkles className={`w-6 h-6
              ${mode === 'compute' ? 'text-blue-400' :
                mode === 'transform' ? 'text-purple-400' :
                  'text-pink-400'}`}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6">
          <button
            onClick={toggleSimulation}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700
              transition-all duration-300 transform hover:scale-105"
          >
            {isRunning ?
              <PauseCircle className="w-5 h-5 text-red-400" /> :
              <Play className="w-5 h-5 text-green-400" />
            }
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={changeMode}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700
              transition-all duration-300 transform hover:scale-105"
          >
            <Zap className={`w-5 h-5
              ${mode === 'compute' ? 'text-blue-400' :
                mode === 'transform' ? 'text-purple-400' :
                  'text-pink-400'}`}
            />
            <span>Change Mode</span>
          </button>
        </div>

        {/* Mode Description and Helper Text */}
        <div className="mt-8 text-center">
          <div className={`p-6 rounded-xl backdrop-blur-sm transition-all duration-500
            ${mode === 'compute' ? 'bg-blue-900/20' :
              mode === 'transform' ? 'bg-purple-900/20' :
                'bg-pink-900/20'}`}>
            <h3 className={`text-xl font-semibold mb-3
              ${mode === 'compute' ? 'text-blue-300' :
                mode === 'transform' ? 'text-purple-300' :
                  'text-pink-300'}`}>
              {mode === 'compute' ? '🔄 Computing Mode' :
                mode === 'transform' ? '🔀 Transforming Mode' :
                  '✨ Creating Mode'}
            </h3>

            <p className="text-gray-300 mb-4 leading-relaxed">
              {mode === 'compute' ?
                "Watch as our Turing machine performs binary computations! Just like a computer's CPU, it reads each cell, processes the value, and writes back a result. This demonstrates how simple binary operations form the foundation of all computer calculations." :
                mode === 'transform' ?
                  "In this mode, the machine demonstrates symbol manipulation - the heart of computation. It reads symbols from one position and writes them to another, showing how computers can reorganize and transform data." :
                  "Now we're exploring pattern generation! The machine creates new symbols based on simple rules, showing how complex patterns can emerge from basic instructions - a key concept in artificial intelligence."}
            </p>

            <div className="flex justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Binary className={`w-4 h-4 mr-1
                  ${mode === 'compute' ? 'text-blue-400' :
                    mode === 'transform' ? 'text-purple-400' :
                      'text-pink-400'}`} />
                <span>Current cell: {cells[headPosition]?.value}</span>
              </div>
              <div className="flex items-center">
                <RefreshCcw className={`w-4 h-4 mr-1
                  ${mode === 'compute' ? 'text-blue-400' :
                    mode === 'transform' ? 'text-purple-400' :
                      'text-pink-400'}`} />
                <span>Cycles: {cycleCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 italic">
            Pro tip: Watch how the patterns evolve over time and try to predict the next state!
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisticTuringMachine;