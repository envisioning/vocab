"use client"
import { useState, useEffect } from "react";
import { Play, Pause, RefreshCw, ChevronDown, ChevronUp, Zap } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface GradientPlaygroundProps {}

/**
 * Interactive component teaching gradient descent through a marble simulation
 * @component
 */
const GradientPlayground: React.FC<GradientPlaygroundProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [learningRate, setLearningRate] = useState<number>(0.1);
  const [position, setPosition] = useState<Point>({ x: 50, y: 20 });
  const [path, setPath] = useState<Point[]>([]);
  const [steps, setSteps] = useState<number>(0);

  const calculateGradient = (point: Point): Point => {
    // Simulated bowl-shaped gradient
    return {
      x: (point.x - 50) * 0.1,
      y: (point.y - 50) * 0.1,
    };
  };

  useEffect(() => {
    let animationFrame: number;

    const updatePosition = () => {
      if (isPlaying) {
        const gradient = calculateGradient(position);
        const newPosition = {
          x: position.x - gradient.x * learningRate * 10,
          y: position.y - gradient.y * learningRate * 10,
        };

        setPosition(newPosition);
        setPath(prev => [...prev, newPosition]);
        setSteps(prev => prev + 1);

        animationFrame = requestAnimationFrame(updatePosition);
      }
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(updatePosition);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, position, learningRate]);

  const handleReset = () => {
    setPosition({ x: 50, y: 20 });
    setPath([]);
    setSteps(0);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Gradient Descent Playground</h2>
        <p className="text-gray-600">Watch how the marble finds the lowest point!</p>
      </div>

      <div className="relative h-80 bg-white rounded-lg shadow-md mb-4" 
           role="region" 
           aria-label="gradient descent visualization">
        <div 
          className="absolute w-4 h-4 bg-blue-500 rounded-full transition-all duration-300"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
          }}
          role="presentation"
          aria-label="marble position"
        />
        
        {path.map((point, index) => (
          <div
            key={index}
            className="absolute w-1 h-1 bg-blue-300 rounded-full"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
          />
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          aria-label={isPlaying ? "Pause simulation" : "Start simulation"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {isPlaying ? "Pause" : "Start"}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
          aria-label="Reset simulation"
        >
          <RefreshCw size={20} />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 mb-2">
            Learning Rate: {learningRate.toFixed(2)}
            <Zap size={16} className="text-blue-500" />
          </label>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={learningRate}
            onChange={(e) => setLearningRate(Number(e.target.value))}
            className="w-full"
            aria-label="Adjust learning rate"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600">Steps: {steps}</span>
          <span className="text-gray-600">
            Distance from minimum: {Math.sqrt(
              Math.pow(position.x - 50, 2) + Math.pow(position.y - 50, 2)
            ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GradientPlayground;