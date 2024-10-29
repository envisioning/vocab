"use client"
import { useState, useEffect } from "react";
import { Gamepad2, ChefHat, UserCircle2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Maximize2, Minimize2, RotateCcw } from "lucide-react";

interface Point {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
}

interface DimensionCraftProps {}

const COLORS = ["#3B82F6", "#22C55E", "#6B7280"];
const SIZES = [20, 30, 40];

/**
 * DimensionCraft: Interactive component teaching dimensions through game character creation
 */
const DimensionCraft: React.FC<DimensionCraftProps> = () => {
  const [dimensions, setDimensions] = useState<number>(1);
  const [point, setPoint] = useState<Point>({
    x: 50,
    y: 50,
    z: 50,
    color: COLORS[0],
    size: SIZES[0]
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const cleanup = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return cleanup;
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const container = document.getElementById("dimension-space");
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPoint(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100, x)),
      y: dimensions >= 2 ? Math.max(0, Math.min(100, y)) : prev.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDimensionChange = () => {
    setDimensions(prev => (prev % 3) + 1);
    setPoint(prev => ({
      ...prev,
      color: COLORS[dimensions % 3],
      size: SIZES[dimensions % 3]
    }));
  };

  const handleReset = () => {
    setPoint({
      x: 50,
      y: 50,
      z: 50,
      color: COLORS[0],
      size: SIZES[0]
    });
    setDimensions(1);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">DimensionCraft Explorer</h2>
        <div className="flex gap-2">
          <Gamepad2 className="text-blue-500" />
          <ChefHat className="text-green-500" />
          <UserCircle2 className="text-gray-500" />
        </div>
      </div>

      <div 
        id="dimension-space"
        className="relative w-full h-64 bg-white rounded-lg border-2 border-gray-200 mb-4"
        role="application"
        aria-label="Dimension space visualization"
      >
        <div
          role="button"
          tabIndex={0}
          className="absolute cursor-move transition-all duration-300"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: point.size,
            height: point.size,
            backgroundColor: point.color,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          onMouseDown={handleMouseDown}
          onKeyDown={(e) => {
            const keys: { [key: string]: boolean } = {
              ArrowLeft: true,
              ArrowRight: true,
              ArrowUp: dimensions >= 2,
              ArrowDown: dimensions >= 2
            };
            if (keys[e.key]) {
              e.preventDefault();
              const step = 5;
              const moves = {
                ArrowLeft: { x: -step },
                ArrowRight: { x: step },
                ArrowUp: { y: -step },
                ArrowDown: { y: step }
              };
              const move = moves[e.key as keyof typeof moves];
              setPoint(prev => ({
                ...prev,
                x: Math.max(0, Math.min(100, prev.x + (move.x || 0))),
                y: Math.max(0, Math.min(100, prev.y + (move.y || 0)))
              }));
            }
          }}
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleDimensionChange}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          aria-label="Change dimensions"
        >
          {dimensions === 1 ? <Maximize2 /> : dimensions === 2 ? <Minimize2 /> : <RotateCcw />}
          <span className="ml-2">Dimensions: {dimensions}D</span>
        </button>
        <div className="text-sm text-gray-600">
          Coordinates: ({point.x.toFixed(0)}, {dimensions >= 2 ? point.y.toFixed(0) : '-'})
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
          aria-label="Reset visualization"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DimensionCraft;