"use client";

import React, { useState, useEffect } from "react";
import { Brain, Shield, ArrowLeftRight, RotateCw } from "lucide-react";

const AdversarialDebiasingDemo = () => {
  const [progress, setProgress] = useState(0);
  const [biasLevel, setBiasLevel] = useState(80);
  const [isActive, setIsActive] = useState(true);
  const [predictions, setPredictions] = useState([
    {
      input: "Software Engineer",
      biasedPrediction: "Male (90%)",
      debiasedPrediction: "Loading...",
    },
    {
      input: "Nurse",
      biasedPrediction: "Female (85%)",
      debiasedPrediction: "Loading...",
    },
    {
      input: "CEO",
      biasedPrediction: "Male (95%)",
      debiasedPrediction: "Loading...",
    },
  ]);
  const [trainingSpeed, setTrainingSpeed] = useState(1);

  // Animation loop
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      if (progress >= 99) {
        setIsActive(false);
        setPredictions((prev) =>
          prev.map((p) => ({
            ...p,
            debiasedPrediction: "Gender: Uncertain (50-55%)",
          }))
        );
        return;
      }

      setProgress((prev) => prev + 0.5);
      setBiasLevel((prev) => {
        const newBias = prev - 0.3;
        return newBias < 20 ? 20 : newBias;
      });

      if (isActive) {
        animationFrame = requestAnimationFrame(() => {
          setTimeout(animate, 50 / trainingSpeed);
        });
      }
    };

    if (isActive) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, progress, trainingSpeed]);

  const handleRestart = () => {
    setProgress(0);
    setBiasLevel(80);
    setIsActive(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Adversarial Debiasing in Action
      </h2>

      {/* Control button */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          disabled={!progress || progress < 99}
        >
          <RotateCw size={20} />
          Restart
        </button>
        <select
          value={trainingSpeed}
          onChange={(e) => setTrainingSpeed(Number(e.target.value))}
          className="px-4 py-2 rounded-lg border"
        >
          <option value={0.5}>Slow</option>
          <option value={1}>Normal</option>
          <option value={2}>Fast</option>
        </select>
      </div>

      {/* Main visualization area */}
      <div className="relative h-64 mb-8">
        {/* Main model */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
          <Brain size={48} className="text-blue-500 mb-2" />
          <span className="text-sm font-medium">Main Model</span>
        </div>

        {/* Data flow visualization */}
        <div className="absolute left-20 right-20 top-1/2 transform -translate-y-1/2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ArrowLeftRight
            size={24}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 text-gray-500"
          />
        </div>

        {/* Adversarial model */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
          <Shield size={48} className="text-red-500 mb-2" />
          <span className="text-sm font-medium">Adversarial Model</span>
        </div>

        {/* Bias meter */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-48">
          <div className="text-center mb-2">Bias Level</div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${biasLevel}%`,
                backgroundColor: `hsl(${120 - biasLevel * 1.2}, 70%, 50%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Add example predictions */}
      <div className="mt-8 border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Example Predictions</h3>
        <div className="space-y-4">
          {predictions.map((pred, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="font-medium">{pred.input}:</span>
              <div className="flex gap-8">
                <span className="text-red-500">
                  Before: {pred.biasedPrediction}
                </span>
                <span className="text-green-500">
                  After:{" "}
                  {progress >= 99 ? pred.debiasedPrediction : "Training..."}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="text-center text-sm text-gray-600 space-y-2">
        <p>
          The main model learns to make predictions while the adversarial model
          tries to detect bias.
        </p>
        <p>
          As training progresses, the main model learns to make predictions that
          the adversarial model cannot use to determine sensitive attributes.
        </p>
        <p>This results in a more fair and unbiased model</p>
      </div>
    </div>
  );
};

export default AdversarialDebiasingDemo;
