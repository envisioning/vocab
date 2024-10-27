"use client";

import React, { useState, useEffect } from "react";
import _ from "lodash";

const RegressionDemo = () => {
  // Function to generate random points with some noise
  const generatePoints = () => {
    const numPoints = 12;
    const baseSlope = 0.7;
    const baseIntercept = 20;

    return _.range(numPoints).map(() => {
      const x = Math.random() * 80 + 10; // x between 10 and 90
      // y = mx + b + noise
      const noise = (Math.random() - 0.5) * 20; // Random noise
      const y = baseSlope * x + baseIntercept + noise;
      return { x, y: Math.max(0, Math.min(100, y)) }; // Clamp y between 0 and 100
    });
  };

  const [points, setPoints] = useState(generatePoints());
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [regressionStats, setRegressionStats] = useState({
    slope: 0,
    intercept: 0,
    r2: 0,
  });

  // Calculate regression line parameters using least squares method
  const calculateRegression = (points) => {
    const n = points.length;
    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared (coefficient of determination)
    const meanY = sumY / n;
    const totalSS = points.reduce(
      (acc, p) => acc + Math.pow(p.y - meanY, 2),
      0
    );
    const residualSS = points.reduce((acc, p) => {
      const predicted = slope * p.x + intercept;
      return acc + Math.pow(p.y - predicted, 2);
    }, 0);
    const r2 = 1 - residualSS / totalSS;

    return { slope, intercept, r2 };
  };

  // Update regression stats when points change
  useEffect(() => {
    const stats = calculateRegression(points);
    setRegressionStats(stats);
  }, [points]);

  // Animation effect
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setProgress((prev) => {
        if (prev >= 1) {
          setIsAnimating(false);
          return 1;
        }
        animationFrame = requestAnimationFrame(animate);
        return prev + 0.02;
      });
    };

    if (isAnimating) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isAnimating]);

  // SVG dimensions and scales
  const width = 400;
  const height = 300;
  const padding = 40;
  const xScale = (x) => ((x - 0) * (width - 2 * padding)) / 100 + padding;
  const yScale = (y) =>
    height - (((y - 0) * (height - 2 * padding)) / 100 + padding);

  // Calculate regression line points
  const startX = 0;
  const endX = 100;
  const startY = regressionStats.intercept + regressionStats.slope * startX;
  const endY = regressionStats.intercept + regressionStats.slope * endX;

  // Animated line points
  const currentEndX = startX + (endX - startX) * progress;
  const currentEndY =
    regressionStats.intercept + regressionStats.slope * currentEndX;

  return (
    <div className="w-full max-w-xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          Machine Learning: Linear Regression
        </h2>

        <div className="space-y-4">
          <div className="relative bg-white border border-gray-200 rounded-lg p-2">
            <svg width={width} height={height}>
              {/* Grid lines */}
              {Array.from({ length: 11 }, (_, i) => i * 10).map((tick) => (
                <React.Fragment key={tick}>
                  <line
                    x1={xScale(tick)}
                    y1={padding}
                    x2={xScale(tick)}
                    y2={height - padding}
                    stroke="#eee"
                    strokeWidth="1"
                  />
                  <line
                    x1={padding}
                    y1={yScale(tick)}
                    x2={width - padding}
                    y2={yScale(tick)}
                    stroke="#eee"
                    strokeWidth="1"
                  />
                </React.Fragment>
              ))}

              {/* Axes */}
              <line
                x1={padding}
                y1={height - padding}
                x2={width - padding}
                y2={height - padding}
                stroke="#666"
                strokeWidth="2"
              />
              <line
                x1={padding}
                y1={padding}
                x2={padding}
                y2={height - padding}
                stroke="#666"
                strokeWidth="2"
              />

              {/* Error lines */}
              {points.map((point, i) => {
                const predictedY =
                  regressionStats.slope * point.x + regressionStats.intercept;
                return (
                  <line
                    key={`error-${i}`}
                    x1={xScale(point.x)}
                    y1={yScale(point.y)}
                    x2={xScale(point.x)}
                    y2={yScale(predictedY)}
                    stroke="#ddd"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                );
              })}

              {/* Data points */}
              {points.map((point, i) => (
                <circle
                  key={i}
                  cx={xScale(point.x)}
                  cy={yScale(point.y)}
                  r="4"
                  fill="#3b82f6"
                />
              ))}

              {/* Regression line */}
              <line
                x1={xScale(startX)}
                y1={yScale(startY)}
                x2={xScale(currentEndX)}
                y2={yScale(currentEndY)}
                stroke="#ef4444"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="font-semibold">
              Model: y = {regressionStats.slope.toFixed(2)}x +{" "}
              {regressionStats.intercept.toFixed(2)}
            </p>
            <p className="font-semibold">
              R² (Accuracy): {(regressionStats.r2 * 100).toFixed(1)}%
            </p>
            <p className="text-gray-600">
              Machine Learning Connection: Linear regression is a fundamental ML
              algorithm that:
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm">
              <li>Learns patterns from training data (the dots)</li>
              <li>Minimizes prediction errors (dotted lines)</li>
              <li>Creates a model (red line) to predict new values</li>
              <li>R² shows how well the model fits the data</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                setProgress(0);
                setIsAnimating(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Replay Animation
            </button>
            <button
              onClick={() => {
                setPoints(generatePoints());
                setProgress(0);
                setIsAnimating(true);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              New Random Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegressionDemo;
