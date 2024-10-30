"use client";
import React, { useState, useEffect } from "react";
import { Settings2, Brain, Target, RotateCcw } from "lucide-react";

const ParameterSpaceExplorer = () => {
  const [currentPoint, setCurrentPoint] = useState({ x: 50, y: 50 });
  const [optimalPoints, setOptimalPoints] = useState([
    { x: 75, y: 65, strength: 1 },
  ]);
  const [loss, setLoss] = useState(0);
  const [trail, setTrail] = useState([]);
  const [iteration, setIteration] = useState(0);
  const [scenario, setScenario] = useState(0);

  // Different scenarios for parameter space exploration
  const scenarios = [
    {
      name: "Single Optimum",
      setup: () => [
        {
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          strength: 1,
        },
      ],
    },
    {
      name: "Local Minima",
      setup: () => [
        {
          x: 25 + Math.random() * 20,
          y: 25 + Math.random() * 20,
          strength: 0.7,
        },
        { x: 75 + Math.random() * 20, y: 75 + Math.random() * 20, strength: 1 },
      ],
    },
    {
      name: "Multiple Optima",
      setup: () => [
        { x: 20 + Math.random() * 20, y: 20 + Math.random() * 20, strength: 1 },
        { x: 80 + Math.random() * 20, y: 40 + Math.random() * 20, strength: 1 },
        { x: 50 + Math.random() * 20, y: 80 + Math.random() * 20, strength: 1 },
      ],
    },
  ];

  // Calculate loss based on distance from all optimal points
  const calculateLoss = (point) => {
    const losses = optimalPoints.map((optimalPoint) => {
      const distance = Math.sqrt(
        Math.pow(point.x - optimalPoint.x, 2) +
          Math.pow(point.y - optimalPoint.y, 2)
      );
      return distance * (1 - optimalPoint.strength);
    });
    return Math.min(...losses);
  };

  // Calculate gradient for the current point
  const calculateGradient = (point) => {
    const nearestOptimal = optimalPoints.reduce((nearest, current) => {
      const currentDist = Math.sqrt(
        Math.pow(point.x - current.x, 2) + Math.pow(point.y - current.y, 2)
      );
      const nearestDist = Math.sqrt(
        Math.pow(point.x - nearest.x, 2) + Math.pow(point.y - nearest.y, 2)
      );
      return currentDist < nearestDist ? current : nearest;
    });

    return {
      dx: (nearestOptimal.x - point.x) * 0.05,
      dy: (nearestOptimal.y - point.y) * 0.05,
    };
  };

  // Reset with new scenario
  const resetScenario = () => {
    const newScenario = (scenario + 1) % scenarios.length;
    setScenario(newScenario);
    setOptimalPoints(scenarios[newScenario].setup());
    setCurrentPoint({
      x: Math.random() * 100,
      y: Math.random() * 100,
    });
    setTrail([]);
    setIteration(0);
  };

  // Animation loop
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setCurrentPoint((prev) => {
        const gradient = calculateGradient(prev);

        // Add some noise to make it more interesting
        const noise = {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        };

        const newPoint = {
          x: prev.x + gradient.dx + noise.x,
          y: prev.y + gradient.dy + noise.y,
        };

        // Keep within bounds
        newPoint.x = Math.max(0, Math.min(100, newPoint.x));
        newPoint.y = Math.max(0, Math.min(100, newPoint.y));

        setTrail((prevTrail) => [...prevTrail.slice(-30), prev]);
        setLoss(calculateLoss(newPoint));

        return newPoint;
      });

      setIteration((prev) => {
        if (prev > 200) {
          resetScenario();
          return 0;
        }
        return prev + 1;
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [currentPoint, optimalPoints, scenario]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Settings2 className="text-blue-500" />
          {scenarios[scenario].name}
        </h2>
        <p className="text-gray-600">
          Exploring different parameter space scenarios
        </p>
      </div>

      <div
        className="relative bg-gray-50 border rounded-lg p-4 mb-6"
        style={{ height: "400px" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient backgrounds for each optimal point */}
          {optimalPoints.map((point, idx) => (
            <div key={idx} className="absolute inset-0">
              <div
                className="absolute w-full h-full bg-gradient-radial from-green-100 to-transparent opacity-50"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: "translate(-50%, -50%)",
                  background: `radial-gradient(circle at center, 
                    rgba(34, 197, 94, ${0.2 * point.strength}) 0%,
                    transparent 70%)`,
                }}
              />
            </div>
          ))}

          {/* Optimal points */}
          {optimalPoints.map((point, idx) => (
            <div
              key={idx}
              className="absolute"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: "translate(-50%, -50%)",
                opacity: point.strength,
              }}
            >
              <Target className="text-green-500 w-8 h-8" />
            </div>
          ))}

          {/* Trail */}
          {trail.map((point, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: `rgba(59, 130, 246, ${index / trail.length})`,
              }}
            />
          ))}

          {/* Current point */}
          <div
            className="absolute"
            style={{
              left: `${currentPoint.x}%`,
              top: `${currentPoint.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Brain className="text-blue-500 w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={resetScenario}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Next Scenario
          </button>
        </div>
      </div>

      <div className="mt-6 text-gray-600 text-sm">
        <h3 className="font-bold mb-2">What's happening here?</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            The glowing regions represent areas of low loss in the parameter
            space.
          </li>
          <li>
            Multiple targets (🎯) show different optimal parameter combinations.
          </li>
          <li>
            The brain (🧠) represents the model's current parameters as it
            explores.
          </li>
          <li>
            Watch how the model can get stuck in local minima or find different
            optimal solutions!
          </li>
          <li>
            Each scenario shows different parameter space landscapes you might
            encounter in ML.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ParameterSpaceExplorer;
