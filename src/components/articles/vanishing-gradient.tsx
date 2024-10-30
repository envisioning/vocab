"use client"
import { useState, useEffect } from "react";
import { Volume2, VolumeX, Mountain, Users, RefreshCw, HelpCircle } from "lucide-react";

interface GradientWhispersProps {}

type Layer = {
  id: number;
  strength: number;
};

const calculateSignalStrength = (initial: number, layerIndex: number): number => {
  return Math.round(initial * Math.pow(0.7, layerIndex));
};

const VanishingGradientDemo: React.FC<GradientWhispersProps> = () => {
  const [initialSignal, setInitialSignal] = useState<number>(100);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [mode, setMode] = useState<'echo' | 'whispers'>('echo');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const newLayers = Array.from({ length: 7 }, (_, index) => ({
      id: index,
      strength: calculateSignalStrength(initialSignal, index)
    }));
    setLayers(newLayers);
  }, [initialSignal]);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setInitialSignal(prev => (prev === 100 ? 20 : 100));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const handleSignalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialSignal(Number(e.target.value));
    setIsAnimating(false);
  };

  const getLayerColor = (strength: number): string => {
    if (strength > 70) return "bg-green-500";
    if (strength > 40) return "bg-yellow-500";
    return "bg-red-400";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setMode(mode === 'echo' ? 'whispers' : 'echo')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          aria-label="Toggle metaphor mode"
        >
          {mode === 'echo' ? <Mountain size={20} /> : <Users size={20} />}
          {mode === 'echo' ? 'Mountain Echo' : 'Whispers Game'}
        </button>
        
        <div className="flex gap-4">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
            aria-label={isAnimating ? 'Stop animation' : 'Start animation'}
          >
            <RefreshCw size={20} className={isAnimating ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setInitialSignal(100)}
            className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
            aria-label="Help"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Initial Signal Strength: {initialSignal}%
        </label>
        <input
          type="range"
          min="20"
          max="100"
          value={initialSignal}
          onChange={handleSignalChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="space-y-4">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="flex items-center gap-4 transition-all duration-300"
          >
            <div className="w-8">
              {layer.strength > 50 ? (
                <Volume2 size={20} />
              ) : (
                <VolumeX size={20} />
              )}
            </div>
            <div className="flex-1 h-8 bg-gray-200 rounded-lg overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getLayerColor(layer.strength)}`}
                style={{ width: `${layer.strength}%` }}
                role="progressbar"
                aria-valuenow={layer.strength}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="w-16 text-right">{layer.strength}%</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">
          {mode === 'echo'
            ? "Like a mountain echo getting weaker, neural network signals fade through layers."
            : "Similar to the telephone game, information gets weaker as it passes through more people."}
        </p>
      </div>
    </div>
  );
};

export default VanishingGradientDemo;