"use client"
import { useState, useEffect } from "react";
import { Music, Users, Graph, BookOpen, AlertCircle } from "lucide-react";

interface OrchestraState {
  size: number;
  complexity: number;
  isPlaying: boolean;
  predictionMode: boolean;
  userPrediction: number | null;
}

interface Milestone {
  size: number;
  description: string;
}

const MILESTONES: Milestone[] = [
  { size: 1, description: "Solo violinist - Basic melody" },
  { size: 5, description: "Small ensemble - Simple harmony" },
  { size: 25, description: "Chamber orchestra - Rich sound" },
  { size: 100, description: "Full orchestra - Complex symphony" },
];

const calculateComplexity = (size: number): number => {
  return Math.log2(size + 1) * 20;
};

export default function ScalingLawsOrchestra() {
  const [state, setState] = useState<OrchestraState>({
    size: 1,
    complexity: calculateComplexity(1),
    isPlaying: false,
    predictionMode: false,
    userPrediction: null,
  });

  useEffect(() => {
    let animationFrame: number;
    if (state.isPlaying) {
      const animate = () => {
        setState(prev => {
          const newSize = prev.size < 100 ? prev.size + 1 : 1;
          return {
            ...prev,
            size: newSize,
            complexity: calculateComplexity(newSize),
          };
        });
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [state.isPlaying]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setState(prev => ({
      ...prev,
      size: newSize,
      complexity: calculateComplexity(newSize),
    }));
  };

  const handlePredictionClick = (e: React.MouseEvent<SVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const prediction = 100 - (y / rect.height) * 100;
    setState(prev => ({ ...prev, userPrediction: prediction }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-4 mb-6">
        <Music className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">Orchestra Scaling Simulator</h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6" />
            <span className="font-medium">Orchestra Size: {state.size}</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={state.size}
            onChange={handleSliderChange}
            className="w-full"
            aria-label="Adjust orchestra size"
          />

          <div className="mt-4 grid grid-cols-4 gap-2">
            {Array.from({ length: Math.min(state.size, 12) }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"
                role="img"
                aria-label="Musician"
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Graph className="w-6 h-6" />
            <span className="font-medium">Complexity Growth</span>
          </div>
          <div
            className="h-48 relative border border-gray-200"
            onClick={handlePredictionClick}
            role="graphics-document"
          >
            <div
              className="absolute bottom-0 left-0 w-full h-full bg-blue-100 opacity-20"
              style={{
                clipPath: `polygon(0 100%, ${(state.size / 100) * 100}% ${
                  100 - state.complexity
                }%, ${(state.size / 100) * 100}% 100%)`,
              }}
            />
            {state.userPrediction && (
              <div
                className="absolute w-2 h-2 bg-green-500 rounded-full"
                style={{
                  left: `${state.size}%`,
                  bottom: `${state.userPrediction}%`,
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6" />
          <span className="font-medium">Current Milestone:</span>
        </div>
        <p className="text-gray-700">
          {MILESTONES.find(m => m.size <= state.size)?.description}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          <p className="text-sm text-gray-600">
            Notice how adding more musicians doesn't linearly increase complexity
          </p>
        </div>
      </div>
    </div>
  );
}