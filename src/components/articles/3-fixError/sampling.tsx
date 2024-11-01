"use client"
import { useState, useEffect } from "react";
import { CloudRain, CloudLightning, CloudSnow, Cloud, Info, RefreshCw } from "lucide-react";

interface WeatherParticle {
  id: number;
  x: number;
  y: number;
  type: "rain" | "lightning" | "snow" | "cloud";
}

const PARTICLE_COUNT = 100;
const SAMPLE_SIZE = 10;

export default function SamplingVisualizer() {
  const [particles, setParticles] = useState<WeatherParticle[]>([]);
  const [sampledParticles, setSampledParticles] = useState<WeatherParticle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    generateParticles();
    return () => {
      setParticles([]);
      setSampledParticles([]);
    };
  }, []);

  const generateParticles = () => {
    const types: ("rain" | "lightning" | "snow" | "cloud")[] = ["rain", "lightning", "snow", "cloud"];
    const initialParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: types[Math.floor(Math.random() * types.length)]
    }));
    setParticles(initialParticles);
  };

  const handleSample = () => {
    setIsAnimating(true);
    const sampled = [];
    const indices = new Set<number>();
    
    while (indices.size < SAMPLE_SIZE) {
      const randomIndex = Math.floor(Math.random() * particles.length);
      if (!indices.has(randomIndex)) {
        indices.add(randomIndex);
        sampled.push(particles[randomIndex]);
      }
    }
    
    setSampledParticles(sampled);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const getIcon = (type: string, size: number = 24) => {
    switch (type) {
      case "rain": return <CloudRain size={size} className="text-blue-500" />;
      case "lightning": return <CloudLightning size={size} className="text-yellow-500" />;
      case "snow": return <CloudSnow size={size} className="text-purple-500" />;
      default: return <Cloud size={size} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-indigo-900 dark:text-white">
            Sampling in AI
          </h1>
          <div className="relative inline-block">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
            >
              <Info size={24} />
            </button>
            {showTooltip && (
              <div className="absolute z-10 w-64 p-4 mt-2 text-sm text-white bg-gray-800 rounded-lg shadow-xl">
                Sampling is like taking a small taste to understand the whole dish. In AI, we use it to work with manageable portions of data while maintaining accuracy.
              </div>
            )}
          </div>
        </div>
        
        <div className="relative h-96 bg-white/80 dark:bg-gray-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/20">
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className={`absolute transform transition-all duration-500 ${
                  isAnimating ? 'scale-90 opacity-50 blur-sm' : 'scale-100 opacity-100'
                }`}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {getIcon(particle.type)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="flex gap-4">
            <button
              onClick={handleSample}
              disabled={isAnimating}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg
                       shadow-lg transition-all duration-300 transform hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className={`${isAnimating ? 'animate-spin' : ''}`} />
              Take Random Sample
            </button>
          </div>

          <div className="w-full p-6 bg-white/90 dark:bg-gray-700 rounded-xl shadow-lg">
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
              Selected Sample ({sampledParticles.length} of {PARTICLE_COUNT}):
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {sampledParticles.map((particle) => (
                <div
                  key={particle.id}
                  className="p-3 bg-indigo-50 dark:bg-gray-600 rounded-lg
                           transform transition-all duration-300 hover:scale-110
                           hover:shadow-xl"
                >
                  {getIcon(particle.type, 32)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}