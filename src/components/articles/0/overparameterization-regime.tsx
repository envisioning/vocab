"use client";
import React, { useState, useEffect } from "react";
import { RefreshCw, ChevronRight, Brain } from "lucide-react";

const OverparameterizationDemo = () => {
  const [parameterCount, setParameterCount] = useState(2);
  const [isComplete, setIsComplete] = useState(false);

  // Sample data points (simplified training set)
  const dataPoints = [
    { x: 20, y: 30 },
    { x: 80, y: 45 },
    { x: 160, y: 65 },
    { x: 200, y: 70 },
    { x: 280, y: 90 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setParameterCount((prev) => {
        if (prev >= 20) {
          setIsComplete(true);
          clearInterval(interval);
          return 20;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isComplete]);

  const resetDemo = () => {
    setParameterCount(2);
    setIsComplete(false);
  };

  // Generate curve points based on parameter count
  const generateCurvePoints = () => {
    const points = [];
    for (let x = 0; x <= 300; x += 5) {
      let y = 0;
      // More parameters = more complex curve
      for (let i = 0; i < parameterCount; i++) {
        y += Math.sin((x / 50) * (i + 1)) * (20 / (i + 1));
      }
      y += x / 3 + 20; // Base trend
      points.push({ x, y });
    }
    return points;
  };

  const curvePoints = generateCurvePoints();

  // Convert points to SVG path
  const generatePath = (points: { x: number; y: number }[]) => {
    return points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");
  };

  const getMessage = () => {
    if (parameterCount <= 5) {
      return "Underfitting: The model is too simple to capture the pattern.";
    } else if (parameterCount <= 15) {
      return "Good fit: The model captures the pattern without overfitting.";
    } else {
      return "Overparameterized: The model is too complex and fits noise in the data.";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6 gap-2">
        <Brain className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Overparameterization in ML
        </h2>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-gray-700 flex items-center gap-2">
            Parameters: {parameterCount}
            {parameterCount > 15 && (
              <span className="text-red-500 animate-pulse">
                (Overparameterized!)
              </span>
            )}
          </div>
          <button
            onClick={resetDemo}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Restart animation"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isComplete ? "animate-pulse" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="relative w-full h-64 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 300 120">
          {/* Grid lines for better visualization */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`grid-h-${i}`}
              x1="0"
              y1={i * 20}
              x2="300"
              y2={i * 20}
              className="stroke-gray-100"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={`grid-v-${i}`}
              x1={i * 50}
              y1="0"
              x2={i * 50}
              y2="120"
              className="stroke-gray-100"
              strokeWidth="1"
            />
          ))}

          {/* Training data points */}
          {dataPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              className="fill-blue-500"
            />
          ))}

          {/* Model's prediction curve */}
          <path
            d={generatePath(curvePoints)}
            fill="none"
            className={`stroke-2 transition-colors duration-300 ${
              parameterCount > 15 ? "stroke-red-500" : "stroke-green-500"
            }`}
          />
        </svg>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-start gap-2">
          <ChevronRight className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
          <p className="text-gray-600 transition-all duration-300">
            {getMessage()}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 mt-1 rounded-full bg-blue-500 flex-shrink-0" />
          <p className="text-gray-600">Training data points (5 samples)</p>
        </div>
        <div className="flex items-start gap-2">
          <div
            className={`w-3 h-3 mt-1 rounded-full transition-colors duration-300 ${
              parameterCount > 15 ? "bg-red-500" : "bg-green-500"
            } flex-shrink-0`}
          />
          <p className="text-gray-600">
            Model's prediction curve ({parameterCount} parameters)
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverparameterizationDemo;
