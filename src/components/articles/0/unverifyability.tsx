"use client";
import React, { useState, useEffect } from "react";
import { Box, Brain, ArrowRight } from "lucide-react";

const UnverifiabilityDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const inputs = [
    { image: "🐱", label: "cat" },
    { image: "🐕", label: "dog" },
    { image: "🦊", label: "fox" },
    { image: "🐘", label: "elephant" },
    { image: "🦜", label: "parrot" },
    { image: "🐠", label: "fish" },
    { image: "🦒", label: "giraffe" },
    { image: "🐼", label: "panda" },
    { image: "🦘", label: "kangaroo" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % inputs.length);
      setPrediction(null);
      setTimeout(() => {
        setPrediction(Math.random() > 0.2);
      }, 1000);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          Understanding Unverifiability in AI
        </h2>
        <p className="text-gray-600">
          Watch how we can't verify the internal decision process
        </p>
      </div>

      <div className="flex items-center justify-center space-x-8 h-48">
        {/* Input */}
        <div className="text-center">
          <div className="text-5xl mb-2">{inputs[currentStep].image}</div>
          <div className="text-sm text-gray-600">Input</div>
        </div>

        {/* Black Box */}
        <div className="relative">
          <div
            className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center"
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
          >
            <Brain className="w-16 h-16 text-gray-700" />
            {showHint && (
              <div className="absolute -top-16 w-48 bg-white p-2 rounded shadow-lg text-xs text-gray-600">
                We can't verify how decisions are made inside!
              </div>
            )}
          </div>
          <div className="absolute -bottom-6 w-full text-center text-sm text-gray-600">
            Black Box Model
          </div>
        </div>

        <ArrowRight className="w-6 h-6 text-gray-400" />

        {/* Output */}
        <div className="text-center w-24">
          {prediction === null ? (
            <div className="w-12 h-12 mx-auto text-gray-400 animate-pulse">
              ❓
            </div>
          ) : prediction ? (
            <div className="w-12 h-12 mx-auto text-green-500">✅</div>
          ) : (
            <div className="w-12 h-12 mx-auto text-red-500">❌</div>
          )}
          <div className="text-sm text-gray-600 mt-2">Prediction</div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Key Points:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• We can observe inputs and outputs</li>
          <li>• The internal decision process remains opaque</li>
          <li>• Cannot verify if the model uses correct reasoning</li>
          <li>• May work correctly but for wrong reasons</li>
        </ul>
      </div>
    </div>
  );
};

export default UnverifiabilityDemo;
