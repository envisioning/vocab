"use client";
import React, { useState, useEffect } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";

const SamplingVisualization = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [population, setPopulation] = useState([]);
  const [sample, setSample] = useState([]);
  const [sampleSize, setSampleSize] = useState(10);

  // Constants for visualization
  const PADDING = 20;
  const POINT_SIZE = 4;

  // Generate initial population with a normal-like distribution
  useEffect(() => {
    const generatePopulation = () => {
      const points = [];
      for (let i = 0; i < 100; i++) {
        // Create a roughly normal distribution using Box-Muller transform
        let u = 0,
          v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const std = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

        // Scale and shift the points to fit within 0-1 range
        const x = std * 0.15 + 0.5;
        const y = (Math.random() + Math.random() + Math.random()) / 3;

        // Only add points that will be within bounds
        if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
          points.push({ x, y });
        }
      }
      return points;
    };
    setPopulation(generatePopulation());
    setSample([]);
    setIsPlaying(true);
  }, []);

  // Animation effect
  useEffect(() => {
    let intervalId;
    if (isPlaying && sample.length < sampleSize) {
      intervalId = setInterval(() => {
        setSample((prev) => {
          if (prev.length >= sampleSize) {
            setIsPlaying(false);
            return prev;
          }
          const randomIndex = Math.floor(Math.random() * population.length);
          const newPoint = population[randomIndex];
          return [...prev, newPoint];
        });
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, population, sample.length, sampleSize]);

  const handleReset = () => {
    setSample([]);
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">AI Sampling Visualization</h2>
        <p className="text-gray-600">
          Watch how random sampling selects points while maintaining the
          original distribution pattern
        </p>
      </div>

      <div className="relative h-64 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
        {/* Coordinate system labels */}
        <div className="absolute left-2 top-2 text-xs text-gray-400">
          High Density
        </div>
        <div className="absolute left-2 bottom-2 text-xs text-gray-400">
          Low Density
        </div>

        {/* Population points */}
        {population.map((point, i) => (
          <div
            key={`pop-${i}`}
            className="absolute w-1 h-1 rounded-full bg-gray-300"
            style={{
              left: `${point.x * 100}%`,
              top: `${point.y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Sampled points */}
        {sample.map((point, i) => (
          <div
            key={`sample-${i}`}
            className="absolute w-2 h-2 rounded-full bg-blue-500 transform scale-150 transition-transform duration-300"
            style={{
              left: `${point.x * 100}%`,
              top: `${point.y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          disabled={sample.length >= sampleSize}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {sample.length === 0 ? "Start Sampling" : "Continue"}
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </button>
      </div>

      <div className="text-center text-gray-600">
        <p>
          Population Size: 100 points | Sample Size: {sample.length}/
          {sampleSize} points
        </p>
        <p className="mt-2 text-sm">
          {sample.length === sampleSize
            ? "✨ Sampling complete! Notice how the blue points maintain the original distribution pattern."
            : "Click 'Start Sampling' to begin the random selection process"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          The vertical axis represents data density, showing how sampling
          preserves the distribution of points
        </p>
      </div>
    </div>
  );
};

export default SamplingVisualization;
