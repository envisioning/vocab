"use client"
import { useState, useEffect } from "react";
import { TrendingUp, Circle, MoveHorizontal, Info, Book, Brain, LineChart, HelpCircle } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface ComponentProps {}

/**
 * Interactive Regression Visualization Component
 * Demonstrates linear regression concepts for students
 */
const RegressionExplainer: React.FC<ComponentProps> = () => {
  const [points, setPoints] = useState<Point[]>([
    { x: 10, y: 20 }, { x: 30, y: 35 }, { x: 50, y: 55 }, 
    { x: 70, y: 80 }, { x: 90, y: 95 }
  ]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [showLine, setShowLine] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        setPoints(prevPoints =>
          prevPoints.map(point => ({
            ...point,
            y: point.y + (Math.random() * 2 - 1)
          }))
        );
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isAnimating]);

  const calculateRegression = () => {
    const n = points.length;
    const sumX = points.reduce((acc, point) => acc + point.x, 0);
    const sumY = points.reduce((acc, point) => acc + point.y, 0);
    const sumXY = points.reduce((acc, point) => acc + point.x * point.y, 0);
    const sumXX = points.reduce((acc, point) => acc + point.x * point.x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  };

  const { slope, intercept } = calculateRegression();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-3 rounded-full">
            <Brain className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Linear Regression Explorer
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAnimating(prev => !prev)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isAnimating ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
            } text-white transition duration-300 shadow-lg`}
          >
            <LineChart className="w-4 h-4" />
            {isAnimating ? 'Pause' : 'Animate'}
          </button>
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition duration-300"
            >
              <HelpCircle className="w-6 h-6 text-blue-500" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-full mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 w-64">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Watch how the regression line adapts to find the best fit through the moving data points. 
                  This demonstrates how machine learning models learn from patterns in data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden shadow-inner">
        <div className="absolute inset-0 p-4">
          {points.map((point, index) => (
            <div
              key={index}
              className={`absolute transform -translate-x-2 -translate-y-2 transition-all duration-300 ${
                hoveredPoint === index ? 'scale-150' : 'scale-100'
              }`}
              style={{
                left: `${point.x}%`,
                top: `${100 - point.y}%`,
              }}
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <Circle
                className={`w-4 h-4 ${
                  hoveredPoint === index
                    ? 'text-blue-500 fill-blue-500'
                    : 'text-blue-400 fill-blue-400'
                } filter drop-shadow-lg transition-colors duration-300`}
              />
            </div>
          ))}

          {showLine && (
            <div
              className="absolute left-0 right-0 border-2 border-blue-500/70 shadow-lg transition-transform duration-300"
              style={{
                top: `${100 - (slope * 0 + intercept)}%`,
                transform: `rotate(${Math.atan(slope) * (180 / Math.PI)}deg)`,
                transformOrigin: '0 0',
                width: '100%',
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setShowLine(prev => !prev)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition duration-300 shadow-lg"
        >
          <MoveHorizontal className="w-5 h-5" />
          {showLine ? 'Hide' : 'Show'} Best Fit Line
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          Slope: {slope.toFixed(2)} | Intercept: {intercept.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default RegressionExplainer;