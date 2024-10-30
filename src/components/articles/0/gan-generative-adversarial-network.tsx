"use client";
import React, { useState, useEffect } from "react";
import {
  Paintbrush2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";

const GANExplainer = () => {
  const [iteration, setIteration] = useState(0);
  const [quality, setQuality] = useState(20);
  const [isTraining, setIsTraining] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setIteration((prev) => {
          if (prev >= 10) {
            setIsTraining(false);
            return prev;
          }
          setQuality((prevQ) => Math.min(prevQ + 8, 95));
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const handleTrain = () => {
    setIsTraining(true);
    setIteration(0);
    setQuality(20);
    setFeedback("Training in progress...");
  };

  const getImage = () => {
    const noise = Array(25)
      .fill()
      .map(() =>
        Array(25)
          .fill()
          .map(() => Math.random() * (100 - quality) + quality)
      );
    return noise;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">
          GAN: Generator vs Discriminator
        </h2>
        <p className="text-gray-600">
          Watch how the Generator (Artist) improves with feedback from the
          Discriminator (Critic)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Generator Section */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Paintbrush2 className="text-blue-600" />
            <h3 className="font-semibold text-lg">Generator (The Artist)</h3>
          </div>
          <div className="aspect-square bg-white rounded-lg overflow-hidden">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(25, 1fr)`,
                width: "100%",
                height: "100%",
              }}
            >
              {getImage().map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    style={{
                      backgroundColor: `rgb(${cell}%, ${cell}%, ${cell}%)`,
                      paddingBottom: "100%",
                    }}
                  />
                ))
              )}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Quality Score: {quality}%</p>
          </div>
        </div>

        {/* Discriminator Section */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="text-purple-600" />
            <h3 className="font-semibold text-lg">
              Discriminator (The Critic)
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="flex gap-4 mb-4">
              <ThumbsUp
                className={`w-8 h-8 ${
                  quality > 75 ? "text-green-500" : "text-gray-300"
                }`}
              />
              <ThumbsDown
                className={`w-8 h-8 ${
                  quality <= 75 ? "text-red-500" : "text-gray-300"
                }`}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {quality > 75
                ? "This looks quite realistic!"
                : "I can tell this is fake. Try again!"}
            </p>
          </div>
        </div>
      </div>

      {/* Training Controls */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <button
          onClick={handleTrain}
          disabled={isTraining}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg
            ${
              isTraining
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }
          `}
        >
          <RefreshCw
            className={`w-5 h-5 ${isTraining ? "animate-spin" : ""}`}
          />
          {isTraining ? "Training..." : "Start Training"}
        </button>
        <div className="text-sm text-gray-600">Iteration: {iteration} / 10</div>
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">How it works:</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>The Generator creates images starting from random noise</li>
          <li>The Discriminator evaluates if the images look realistic</li>
          <li>The Generator learns from the feedback and improves</li>
          <li>
            This process continues until the Generator creates convincing images
          </li>
        </ol>
      </div>
    </div>
  );
};

export default GANExplainer;
