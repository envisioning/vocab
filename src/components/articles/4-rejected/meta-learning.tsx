"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Sparkles, Flower2, Circle, TreePine, Leaf, Wind, Orbit } from 'lucide-react';

const NeuralParticle = ({ x, y, color, size, rotation }) => (
    <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
        style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        }}
    >
        <Circle
            className={`${color} opacity-40`}
            size={size}
        />
    </div>
);

const MetaLearningGarden = () => {
    const [isLearning, setIsLearning] = useState(false);
    const [particles, setParticles] = useState([]);
    const [learningStage, setLearningStage] = useState(0);
    const [bloomCount, setBloomCount] = useState(0);

    // Generate random particles
    const generateParticles = useCallback(() => {
        const newParticles = Array(15).fill(null).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 20 + 10,
            rotation: Math.random() * 360,
            color: `text-${['purple', 'blue', 'indigo'][Math.floor(Math.random() * 3)]}-${Math.floor(Math.random() * 3 + 3)}00`
        }));
        setParticles(newParticles);
    }, []);

    useEffect(() => {
        if (isLearning) {
            const interval = setInterval(() => {
                generateParticles();
                setLearningStage(prev => (prev + 1) % 4);
                setBloomCount(prev => Math.min(prev + 1, 12));
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [isLearning, generateParticles]);

    const renderBloom = (index) => {
        const angle = (index / 12) * 2 * Math.PI;
        const radius = 120;
        const x = Math.cos(angle) * radius + 150;
        const y = Math.sin(angle) * radius + 150;

        return (
            <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
                style={{
                    left: x,
                    top: y,
                    opacity: index < bloomCount ? 1 : 0,
                    transform: `translate(-50%, -50%) rotate(${angle * (180 / Math.PI)}deg)`,
                }}
            >
                <Flower2
                    className={`w-8 h-8 ${index % 3 === 0 ? 'text-purple-400' :
                            index % 3 === 1 ? 'text-blue-400' : 'text-indigo-400'
                        }`}
                />
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="relative h-[600px] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden shadow-2xl">
                {/* Particle field */}
                <div className="absolute inset-0">
                    {particles.map((particle) => (
                        <NeuralParticle key={particle.id} {...particle} />
                    ))}
                </div>

                {/* Central learning core */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`relative transition-all duration-1000 ${isLearning ? 'scale-110' : 'scale-100'
                        }`}>
                        {/* Neural bloom pattern */}
                        {Array(12).fill(null).map((_, i) => renderBloom(i))}

                        {/* Central brain */}
                        <div className="relative z-10 transform-gpu">
                            <div className={`transition-transform duration-1000 ${isLearning ? 'animate-pulse' : ''
                                }`}>
                                <Brain
                                    className={`w-24 h-24 transition-colors duration-500 ${isLearning ? 'text-purple-400' : 'text-slate-400'
                                        }`}
                                />
                            </div>

                            {/* Orbiting elements */}
                            <div className={`absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 ${isLearning ? 'animate-spin-slow' : ''
                                }`}>
                                <Orbit className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-blue-400 w-6 h-6" />
                                <Wind className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-indigo-400 w-6 h-6" />
                                <Leaf className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-green-400 w-6 h-6" />
                                <TreePine className="absolute top-1/2 -left-4 transform -translate-y-1/2 text-emerald-400 w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning stage indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                    {Array(4).fill(null).map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${i === learningStage && isLearning
                                    ? 'bg-purple-400 scale-125'
                                    : 'bg-slate-600'
                                }`}
                        />
                    ))}
                </div>

                {/* Sparkles */}
                <div className={`absolute top-8 right-8 transition-opacity duration-500 ${isLearning ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <Sparkles className="text-yellow-400 w-6 h-6 animate-pulse" />
                </div>
            </div>

            {/* Control button */}
            <div className="text-center mt-8">
                <button
                    onClick={() => setIsLearning(!isLearning)}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full 
                     font-semibold tracking-wide shadow-lg hover:from-purple-600 hover:to-indigo-600 
                     transition-all duration-300 transform hover:scale-105"
                >
                    {isLearning ? 'Pause Learning' : 'Start Meta-Learning'}
                </button>
            </div>
        </div>
    );
};

export default MetaLearningGarden;

// Add this to your CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes spin-slow {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
`;
document.head.appendChild(style);