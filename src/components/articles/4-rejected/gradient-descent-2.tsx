"use client"
import { useState, useEffect } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Play, Square, RefreshCw, Snowflake } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface TerrainPoint {
  x: number;
  y: number;
  height: number;
}

const GRID_SIZE = 20;
const LEARNING_RATES = [0.5, 1, 2];
const TERRAIN_POINTS: TerrainPoint[] = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
  x: i % GRID_SIZE,
  y: Math.floor(i / GRID_SIZE),
  height: Math.sin(i % GRID_SIZE / 3) * Math.cos(Math.floor(i / GRID_SIZE) / 3) * 10
}));

const GradientDescentLearner = () => {
  const [position, setPosition] = useState<Position>({ x: 10, y: 10 });
  const [trail, setTrail] = useState<Position[]>([]);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(false);
  const [learningRate, setLearningRate] = useState<number>(1);
  const [steps, setSteps] = useState<number>(0);

  const getHeight = (x: number, y: number): number => {
    const point = TERRAIN_POINTS.find(p => p.x === x && p.y === y);
    return point?.height || 0;
  };

  const getGradient = (x: number, y: number): Position => {
    const dx = getHeight(x + 1, y) - getHeight(x - 1, y);
    const dy = getHeight(x, y + 1) - getHeight(x, y - 1);
    return { x: dx, y: dy };
  };

  const movePosition = (direction: Position) => {
    setPosition(prev => {
      const newX = Math.max(0, Math.min(GRID_SIZE - 1, prev.x + direction.x));
      const newY = Math.max(0, Math.min(GRID_SIZE - 1, prev.y + direction.y));
      return { x: newX, y: newY };
    });
    setTrail(prev => [...prev, position]);
    setSteps(prev => prev + 1);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoMode) {
      intervalId = setInterval(() => {
        const gradient = getGradient(position.x, position.y);
        movePosition({
          x: -gradient.x * learningRate / 10,
          y: -gradient.y * learningRate / 10
        });
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoMode, position, learningRate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAutoMode) return;
    
    const moves: Record<string, Position> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }
    };

    if (moves[e.key]) {
      movePosition(moves[e.key]);
    }
  };

  const reset = () => {
    setPosition({ x: 10, y: 10 });
    setTrail([]);
    setSteps(0);
    setIsAutoMode(false);
  };

  return (
    <div 
      className="w-full max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label="Gradient Descent Learning Environment"
    >
      <div className="grid grid-cols-20 gap-0 bg-white p-4 rounded-lg">
        {TERRAIN_POINTS.map((point, i) => (
          <div
            key={i}
            className="w-6 h-6 border border-gray-200"
            style={{
              backgroundColor: `rgb(${Math.floor(255 - point.height * 10)}, ${Math.floor(255 - point.height * 10)}, 255)`
            }}
          >
            {point.x === position.x && point.y === position.y && (
              <Snowflake className="w-6 h-6 text-blue-500" />
            )}
            {trail.some(t => t.x === point.x && t.y === point.y) && (
              <div className="w-2 h-2 bg-blue-300 rounded-full mx-auto" />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setIsAutoMode(!isAutoMode)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          aria-label={isAutoMode ? "Stop automatic descent" : "Start automatic descent"}
        >
          {isAutoMode ? <Square /> : <Play />}
          {isAutoMode ? "Stop" : "Auto"}
        </button>

        <div className="flex gap-4">
          {LEARNING_RATES.map(rate => (
            <button
              key={rate}
              onClick={() => setLearningRate(rate)}
              className={`px-4 py-2 rounded-lg ${
                learningRate === rate ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              aria-label={`Set learning rate to ${rate}`}
            >
              {rate}x
            </button>
          ))}
        </div>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
          aria-label="Reset simulation"
        >
          <RefreshCw />
          Reset
        </button>
      </div>

      <div className="mt-4 text-center text-gray-700">
        Current Height: {getHeight(position.x, position.y).toFixed(2)}
        <br />
        Steps: {steps}
      </div>
    </div>
  );
};

export default GradientDescentLearner;