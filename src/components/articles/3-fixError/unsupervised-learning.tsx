"use client"
import { useState, useEffect } from "react";
import { Circle, Square, Triangle, RefreshCw, Play, Pause, HelpCircle, Brain } from "lucide-react";

interface DataPoint {
  id: number;
  x: number;
  y: number;
  shape: "circle" | "square" | "triangle";
  cluster: number;
  color: string;
  scale: number;
}

const COLORS = ["#3B82F6", "#22C55E", "#EC4899"];
const TOOLTIPS = [
  "Circles represent continuous data patterns",
  "Squares show structured information blocks",
  "Triangles indicate hierarchical relationships"
];

const UnsupervisedLearningVisual = () => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [iteration, setIteration] = useState<number>(0);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<number>(-1);

  const generateRandomDataPoints = () => {
    const shapes: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      shape: shapes[Math.floor(Math.random() * 3)],
      cluster: 0,
      color: "#6B7280",
      scale: 1
    }));
  };

  const assignClusters = () => {
    if (iteration > 5) {
      setIsAnimating(false);
      return;
    }

    setDataPoints(prev => {
      return prev.map(point => {
        const similarPoints = prev.filter(p => p.shape === point.shape);
        const centerX = similarPoints.reduce((sum, p) => sum + p.x, 0) / similarPoints.length;
        const centerY = similarPoints.reduce((sum, p) => sum + p.y, 0) / similarPoints.length;
        
        const dx = (centerX - point.x) * 0.1;
        const dy = (centerY - point.y) * 0.1;

        return {
          ...point,
          x: point.x + dx,
          y: point.y + dy,
          cluster: ["circle", "square", "triangle"].indexOf(point.shape),
          color: COLORS[["circle", "square", "triangle"].indexOf(point.shape)],
          scale: 1 + (iteration * 0.1)
        };
      });
    });

    setIteration(prev => prev + 1);
  };

  useEffect(() => {
    setDataPoints(generateRandomDataPoints());
  }, []);

  useEffect(() => {
    let animationFrame: number;
    
    if (isAnimating) {
      const animate = () => {
        assignClusters();
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isAnimating, iteration]);

  const renderShape = (point: DataPoint) => {
    const props = {
      size: 24 * point.scale,
      color: point.color,
      fill: point.color,
      strokeWidth: 1.5,
      className: "transition-all duration-500"
    };

    switch (point.shape) {
      case "circle": return <Circle {...props} />;
      case "square": return <Square {...props} />;
      case "triangle": return <Triangle {...props} />;
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <Brain className="w-8 h-8 text-blue-500" />
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Unsupervised Learning Lab
        </h2>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg mb-6">
        <p className="text-gray-700 leading-relaxed">
          Watch AI discover patterns by itself! The shapes will naturally group together based on their similarities,
          demonstrating how machines can learn without explicit instructions.
        </p>
      </div>
      
      <div className="relative h-[400px] bg-white/90 rounded-lg border-2 border-gray-200 mb-6 overflow-hidden">
        <div className="absolute top-4 right-4 flex gap-2">
          {TOOLTIPS.map((tip, idx) => (
            <div key={idx} className="relative">
              <HelpCircle
                className="w-6 h-6 text-gray-400 hover:text-blue-500 cursor-help transition-colors duration-300"
                onMouseEnter={() => setActiveTooltip(idx)}
                onMouseLeave={() => setActiveTooltip(-1)}
              />
              {activeTooltip === idx && (
                <div className="absolute right-0 top-8 w-48 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg z-10">
                  {tip}
                </div>
              )}
            </div>
          ))}
        </div>
        {dataPoints.map(point => (
          <div
            key={point.id}
            className="absolute transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`
            }}
          >
            {renderShape(point)}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {isAnimating ? <Pause size={20} /> : <Play size={20} />}
          {isAnimating ? "Pause" : "Start"} Learning
        </button>
        <button
          onClick={() => {
            handleReset();
            setIteration(0);
            setDataPoints(generateRandomDataPoints());
          }}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <RefreshCw size={20} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default UnsupervisedLearningVisual;