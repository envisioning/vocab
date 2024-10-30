"use client"
import { useState, useEffect } from "react";
import { Camera, Image as ImageIcon, Maximize2, Minimize2, RefreshCcw } from "lucide-react";

interface Point {
  x: number;
  y: number;
  importance: number;
}

interface SparseAutoencoderState {
  sparsityLevel: number;
  points: Point[];
  isAnimating: boolean;
  currentStep: number;
}

const SAMPLE_POINTS: Point[] = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  importance: Math.random(),
}));

const ANIMATION_STEPS = 4;

export default function SparseAutoencoder() {
  const [state, setState] = useState<SparseAutoencoderState>({
    sparsityLevel: 50,
    points: SAMPLE_POINTS,
    isAnimating: false,
    currentStep: 0,
  });

  useEffect(() => {
    if (!state.isAnimating) return;

    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        currentStep: (prev.currentStep + 1) % ANIMATION_STEPS,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [state.isAnimating]);

  const handleSparsityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      sparsityLevel: Number(e.target.value),
    }));
  };

  const toggleAnimation = () => {
    setState(prev => ({
      ...prev,
      isAnimating: !prev.isAnimating,
    }));
  };

  const getVisiblePoints = () => {
    const threshold = (100 - state.sparsityLevel) / 100;
    return state.points.filter(point => point.importance > threshold);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        The Minimalist Photographer
      </h1>

      <div className="relative h-96 bg-white rounded-lg border-2 border-gray-200 mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          {state.currentStep === 0 && (
            <div className="flex items-center gap-4">
              <Camera className="w-12 h-12 text-blue-500" />
              <span className="text-lg">Original Scene</span>
            </div>
          )}
          
          {state.currentStep === 1 && (
            <div className="grid grid-cols-10 gap-1 p-4">
              {getVisiblePoints().map((point, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                  style={{
                    transform: `translate(${point.x}%, ${point.y}%)`,
                  }}
                />
              ))}
            </div>
          )}

          {state.currentStep === 2 && (
            <div className="flex items-center gap-4">
              <Minimize2 className="w-12 h-12 text-green-500" />
              <span className="text-lg">Sparse Representation</span>
            </div>
          )}

          {state.currentStep === 3 && (
            <div className="flex items-center gap-4">
              <Maximize2 className="w-12 h-12 text-blue-500" />
              <span className="text-lg">Reconstructed Image</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="flex-1">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Sparsity Level
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={state.sparsityLevel}
            onChange={handleSparsityChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </label>
        <button
          onClick={toggleAnimation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label={state.isAnimating ? "Pause Animation" : "Start Animation"}
        >
          <RefreshCcw className={`w-5 h-5 ${state.isAnimating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Active Features: {getVisiblePoints().length} / {state.points.length}
      </div>
    </div>
  );
}