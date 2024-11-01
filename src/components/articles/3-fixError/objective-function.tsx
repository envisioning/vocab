"use client"
import { useState, useEffect } from "react";
import { Target, ArrowUp, ArrowDown, Maximize2, Minimize2, RefreshCw, HelpCircle, Info } from "lucide-react";

interface Point {
  x: number;
  y: number;
  value: number;
}

export default function ObjectiveFunctionDemo() {
  const [points, setPoints] = useState<Point[]>([]);
  const [currentPoint, setCurrentPoint] = useState<Point>({ x: 50, y: 50, value: 0 });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [goal, setGoal] = useState<"maximize" | "minimize">("maximize");
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const generateLandscape = () => {
    const newPoints: Point[] = [];
    for (let x = 0; x < 100; x += 5) {
      for (let y = 0; y < 100; y += 5) {
        const value = Math.sin(x/10) * Math.cos(y/10) * 50 + Math.cos(x/20) * Math.sin(y/20) * 25;
        newPoints.push({ x, y, value });
      }
    }
    setPoints(newPoints);
    setCurrentPoint({ x: 50, y: 50, value: calculateValue(50, 50) });
  };

  const calculateValue = (x: number, y: number): number => {
    return Math.sin(x/10) * Math.cos(y/10) * 50 + Math.cos(x/20) * Math.sin(y/20) * 25;
  };

  useEffect(() => {
    generateLandscape();
    return () => setIsOptimizing(false);
  }, []);

  useEffect(() => {
    if (!isOptimizing) return;

    const interval = setInterval(() => {
      const directions = [
        { dx: 3, dy: 0 }, { dx: -3, dy: 0 },
        { dx: 0, dy: 3 }, { dx: 0, dy: -3 },
        { dx: 2, dy: 2 }, { dx: -2, dy: -2 },
        { dx: 2, dy: -2 }, { dx: -2, dy: 2 }
      ];

      const nextMoves = directions.map(({ dx, dy }) => ({
        x: Math.max(0, Math.min(100, currentPoint.x + dx)),
        y: Math.max(0, Math.min(100, currentPoint.y + dy)),
        value: calculateValue(currentPoint.x + dx, currentPoint.y + dy)
      }));

      const bestMove = goal === "maximize"
        ? nextMoves.reduce((a, b) => a.value > b.value ? a : b)
        : nextMoves.reduce((a, b) => a.value < b.value ? a : b);

      if (Math.abs(bestMove.value - currentPoint.value) < 0.01) {
        setIsOptimizing(false);
      } else {
        setCurrentPoint(bestMove);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isOptimizing, currentPoint, goal]);

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 rounded-2xl shadow-2xl">
      <div className="mb-8 text-center relative">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 flex items-center justify-center gap-3">
          Objective Function Explorer
          <HelpCircle 
            className="w-5 h-5 text-blue-500 cursor-help hover:text-blue-600 transition-colors"
            onMouseEnter={() => setShowTooltip("main")}
            onMouseLeave={() => setShowTooltip(null)}
          />
        </h2>
        {showTooltip === "main" && (
          <div className="absolute z-10 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-xs mx-auto text-sm top-full">
            An objective function measures how well your AI model is performing. Think of it as a landscape where the height represents the performance score!
          </div>
        )}
      </div>

      <div className="relative h-96 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-blue-900 rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-800 shadow-inner">
        {points.map((point, i) => (
          <div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full transition-all duration-300"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              background: `rgba(${Math.floor(((point.value + 50) / 100) * 255)}, ${
                Math.floor((1 - (point.value + 50) / 100) * 255)
              }, 255, 0.6)`,
              boxShadow: '0 0 8px rgba(0,0,0,0.1)'
            }}
          />
        ))}
        
        <div
          className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          style={{
            left: `${currentPoint.x}%`,
            top: `${currentPoint.y}%`,
          }}
        >
          <Target className="w-full h-full text-red-500 filter drop-shadow-lg animate-pulse" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setGoal(prev => prev === "maximize" ? "minimize" : "maximize")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {goal === "maximize" ? (
              <><Maximize2 className="w-5 h-5" /> Maximize</>
            ) : (
              <><Minimize2 className="w-5 h-5" /> Minimize</>
            )}
          </button>
          <button
            onClick={() => setIsOptimizing(prev => !prev)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isOptimizing ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> Optimizing...</>
            ) : (
              <><Target className="w-5 h-5" /> Start Optimization</>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
          Performance Score: {currentPoint.value.toFixed(2)}
          <Info 
            className="w-5 h-5 text-blue-500 cursor-help"
            onMouseEnter={() => setShowTooltip("score")}
            onMouseLeave={() => setShowTooltip(null)}
          />
          {showTooltip === "score" && (
            <div className="absolute z-10 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-xs text-sm">
              This score represents how well the current solution performs. Higher values (red) are better when maximizing, lower values (blue) are better when minimizing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}