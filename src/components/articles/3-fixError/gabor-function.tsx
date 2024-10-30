"use client"
import { useState, useEffect } from "react";
import { Wave, Eye, Move, ZoomIn, ZoomOut } from "lucide-react";

interface WavePoint {
  x: number;
  y: number;
  frequency: number;
}

interface GaborState {
  points: WavePoint[];
  lensPosition: { x: number; y: number };
  lensSize: number;
  frequency: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const INITIAL_LENS_SIZE = 100;

const GaborVisualizer = () => {
  const [state, setState] = useState<GaborState>({
    points: [],
    lensPosition: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    lensSize: INITIAL_LENS_SIZE,
    frequency: 1,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const generateWavePoints = () => {
      const points: WavePoint[] = [];
      for (let x = 0; x < CANVAS_WIDTH; x += 5) {
        const baseY = Math.sin(x * 0.02) * 50;
        const highFreqY = Math.sin(x * 0.1) * 20;
        points.push({
          x,
          y: CANVAS_HEIGHT / 2 + baseY + highFreqY,
          frequency: Math.abs(baseY + highFreqY) / 50,
        });
      }
      setState(prev => ({ ...prev, points }));
    };

    generateWavePoints();
    const interval = setInterval(generateWavePoints, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setState(prev => ({
      ...prev,
      lensPosition: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setState(prev => ({
      ...prev,
      lensPosition: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const adjustLensSize = (increase: boolean) => {
    setState(prev => ({
      ...prev,
      lensSize: increase
        ? Math.min(prev.lensSize + 20, 200)
        : Math.max(prev.lensSize - 20, 60),
    }));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Wave Detective</h2>
      
      <div
        className="relative bg-white border-2 border-gray-200 rounded-lg cursor-move"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        role="application"
        aria-label="Gabor Function Visualizer"
      >
        <svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <path
            d={`M ${state.points.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          <circle
            cx={state.lensPosition.x}
            cy={state.lensPosition.y}
            r={state.lensSize / 2}
            fill="rgba(34, 197, 94, 0.2)"
            stroke="#22C55E"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => adjustLensSize(false)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300"
          aria-label="Decrease lens size"
        >
          <ZoomOut className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={() => adjustLensSize(true)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300"
          aria-label="Increase lens size"
        >
          <ZoomIn className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Drag the lens to analyze different parts of the wave pattern
      </div>
    </div>
  );
};

export default GaborVisualizer;