"use client";
import React, { useState, useEffect } from "react";
import {
  Brain,
  CircleSlash2,
  CircleCheck,
  PlayCircle,
  PauseCircle,
  RefreshCw,
} from "lucide-react";

const SampleEfficiencyDemo = () => {
  const [isPlaying, setIsPlaying] = useState(true); // Start playing automatically
  const [sampleCount, setSampleCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Models' accuracy curves (simplified for demonstration)
  const getEfficientAccuracy = (samples: number) => {
    return Math.min(95, Math.floor(100 * (1 - Math.exp(-samples / 10))));
  };

  const getInefficientAccuracy = (samples: number) => {
    return Math.min(95, Math.floor(100 * (1 - Math.exp(-samples / 25))));
  };

  // Initial animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Training animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && sampleCount < 50) {
      interval = setInterval(() => {
        setSampleCount((prev) => prev + 1);
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sampleCount]);

  const resetDemo = () => {
    setIsPlaying(true);
    setSampleCount(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const efficientAccuracy = getEfficientAccuracy(sampleCount);
  const inefficientAccuracy = getInefficientAccuracy(sampleCount);

  return (
    <div
      className={`w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg transition-opacity duration-500 ${
        hasStarted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Sample Efficiency in AI</h2>
        <p className="text-gray-600">
          Watch how models learn from training samples
        </p>
      </div>

      <div className="flex justify-center gap-8 mb-8">
        {/* Sample Efficient Model */}
        <div className="text-center">
          <div
            className={`relative mb-4 transform transition-transform duration-300 ${
              hasStarted ? "translate-y-0" : "translate-y-4"
            }`}
          >
            <Brain className="w-16 h-16 text-blue-500 mx-auto" />
            <div className="mt-2 font-semibold">Sample Efficient Model</div>
            <div className="text-3xl font-bold text-blue-500 transition-all duration-300">
              {efficientAccuracy}%
            </div>
            <div className="text-sm text-gray-500">accuracy</div>
          </div>
        </div>

        {/* Sample Inefficient Model */}
        <div className="text-center">
          <div
            className={`relative mb-4 transform transition-transform duration-300 delay-150 ${
              hasStarted ? "translate-y-0" : "translate-y-4"
            }`}
          >
            <Brain className="w-16 h-16 text-red-500 mx-auto" />
            <div className="mt-2 font-semibold">Sample Inefficient Model</div>
            <div className="text-3xl font-bold text-red-500 transition-all duration-300">
              {inefficientAccuracy}%
            </div>
            <div className="text-sm text-gray-500">accuracy</div>
          </div>
        </div>
      </div>

      {/* Training Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Training Samples</span>
          <span className="text-sm font-semibold">{sampleCount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-500 rounded-full h-2.5 transition-all duration-200"
            style={{ width: `${(sampleCount / 50) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? (
            <>
              <PauseCircle className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <PlayCircle className="w-5 h-5" />
              Play
            </>
          )}
        </button>
        <button
          onClick={resetDemo}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Key Insights */}
      <div
        className={`mt-8 p-4 bg-gray-50 rounded-lg transform transition-all duration-500 delay-300 ${
          hasStarted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <h3 className="font-semibold mb-2">Key Insights:</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
            <span>
              Sample efficient model learns faster with fewer training examples
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CircleSlash2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
            <span>
              Sample inefficient model needs more data to achieve the same
              accuracy
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SampleEfficiencyDemo;
