"use client";
import React, { useState, useEffect } from "react";
import { Cpu, Play, Pause, RefreshCcw } from "lucide-react";

const SSFExplainer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [gpuUsage, setGpuUsage] = useState(0);
  const [frames, setFrames] = useState<{ id: number; similarity: number }[]>(
    []
  );

  // Generate new random frames with some natural temporal coherence
  const generateNewFrames = () => {
    const newFrames = [];
    let lastSimilarity = Math.random() * 0.3; // Start with a low similarity

    for (let i = 0; i < 7; i++) {
      // 70% chance to be similar to previous frame if the last frame was processed
      // This creates more natural sequences of similar frames
      const willBeSimilar =
        lastSimilarity > 0.9 ? Math.random() < 0.7 : Math.random() < 0.3;

      const similarity = willBeSimilar
        ? 0.9 + Math.random() * 0.09 // Very similar: 0.9-0.99
        : 0.2 + Math.random() * 0.3; // Different: 0.2-0.5

      newFrames.push({
        id: i + 1,
        similarity: similarity,
      });

      lastSimilarity = similarity;
    }
    return newFrames;
  };

  // Initialize frames
  useEffect(() => {
    setFrames(generateNewFrames());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && frames.length > 0) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => {
          // When we reach the end, generate new frames and start over
          if (prev === frames.length - 1) {
            setFrames(generateNewFrames());
            return 0;
          }
          return prev + 1;
        });
        setGpuUsage(frames[currentFrame].similarity > 0.9 ? 20 : 80);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentFrame, frames]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(true);
    setCurrentFrame(0);
    setGpuUsage(0);
    setFrames(generateNewFrames());
  };

  if (frames.length === 0) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Stochastic Similarity Filter (SSF)
      </h2>

      {/* Explanation */}
      <div className="mb-6 text-gray-600">
        <p className="mb-2">SSF optimizes GPU usage by:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Processing unique frames fully</li>
          <li>Skipping similar consecutive frames</li>
          <li>Reducing computational load</li>
        </ul>
      </div>

      {/* Main visualization area */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Cpu
              className={`w-6 h-6 ${
                gpuUsage > 50 ? "text-red-500" : "text-green-500"
              }`}
            />
            <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  gpuUsage > 50 ? "bg-red-500" : "bg-green-500"
                } transition-all duration-300`}
                style={{ width: `${gpuUsage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePlayPause}
              className="p-2 rounded hover:bg-gray-200"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded hover:bg-gray-200"
            >
              <RefreshCcw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Frame visualization */}
        <div className="flex justify-center space-x-4 overflow-x-auto py-4">
          {frames.map((frame, index) => (
            <div
              key={`${frame.id}-${frame.similarity}`}
              className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
                index === currentFrame
                  ? "ring-2 ring-blue-500 transform scale-110"
                  : ""
              } ${frame.similarity > 0.9 ? "bg-gray-200" : "bg-blue-100"}`}
            >
              <span className="text-sm font-mono">
                {frame.similarity > 0.9 ? "Skip" : "Process"}
              </span>
            </div>
          ))}
        </div>

        {/* Current frame info */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Frame {currentFrame + 1}:
            {frames[currentFrame].similarity > 0.9
              ? " Skipped (Similar to previous frame)"
              : " Processed (Significant change detected)"}
          </p>
          <p className="text-xs text-gray-500">
            Similarity score: {frames[currentFrame].similarity.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
          <span>Processed Frame</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
          <span>Skipped Frame</span>
        </div>
      </div>
    </div>
  );
};

export default SSFExplainer;
