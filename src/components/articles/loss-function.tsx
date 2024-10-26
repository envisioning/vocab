import React, { useState, useEffect } from "react";
import { Brain, Target, Gauge, Crosshair } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LossFunctionViz = () => {
  const [prediction, setPrediction] = useState(5);
  const [actualValue, setActualValue] = useState(8);
  const [isAnimating, setIsAnimating] = useState(true);
  const [loss, setLoss] = useState(0);
  const [iteration, setIteration] = useState(0);
  const [learningRate, setLearningRate] = useState(0.5);

  // Calculate loss using squared error
  const calculateLoss = (pred, actual) => {
    return Math.pow(pred - actual, 2);
  };

  // Animation effect
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setIteration((prev) => (prev + 1) % 100);

      // Change actual value slowly over time using a different frequency
      const newActual = 8 + Math.sin(iteration / 25) * 3;
      setActualValue(newActual);

      // Make prediction try to follow actual value with some lag and noise
      const error = actualValue - prediction;
      const newPrediction =
        prediction + error * learningRate * 0.1 + (Math.random() - 0.5) * 0.5;
      setPrediction(newPrediction);

      // Update loss
      setLoss(calculateLoss(newPrediction, newActual));
    }, 100);

    return () => clearInterval(interval);
  }, [isAnimating, iteration, actualValue, prediction, learningRate]);

  // Map loss to emoji expression
  const getLossEmoji = (lossValue) => {
    if (lossValue < 1) return "😊";
    if (lossValue < 4) return "🙂";
    if (lossValue < 9) return "😐";
    if (lossValue < 16) return "😕";
    return "😢";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg">
      <CardContent>
        <div className="flex flex-col items-center space-y-8">
          <div className="text-2xl font-bold text-center">
            Loss Function Visualization
          </div>

          {/* Main visualization area */}
          <div className="relative w-full h-48 bg-gray-50 rounded-lg p-4">
            <div
              className="absolute transition-all duration-300"
              style={{
                left: "10%",
                top: `${(prediction / 16) * 100}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div className="flex flex-col items-center">
                <Brain className="w-8 h-8 text-blue-500" />
                <div className="text-sm font-medium text-blue-500">
                  {prediction.toFixed(2)}
                </div>
              </div>
            </div>

            <div
              className="absolute transition-all duration-300"
              style={{
                right: "10%",
                top: `${(actualValue / 16) * 100}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div className="flex flex-col items-center">
                <Target className="w-8 h-8 text-green-500" />
                <div className="text-sm font-medium text-green-500">
                  {actualValue.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Connection line */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 0 }}
            >
              <line
                x1="20%"
                y1={`${(prediction / 16) * 100}%`}
                x2="80%"
                y2={`${(actualValue / 16) * 100}%`}
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4"
              />
            </svg>
          </div>

          {/* Loss display */}
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{getLossEmoji(loss)}</div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500">
                Current Loss
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {loss.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Loss meter */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300 ease-in-out"
              style={{
                width: `${Math.min(100, (loss / 16) * 100)}%`,
                backgroundColor:
                  loss < 4 ? "#22c55e" : loss < 9 ? "#eab308" : "#ef4444",
              }}
            />
          </div>

          {/* Learning rate slider */}
          <div className="w-full flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Learning Rate: {learningRate.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Controls */}
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {isAnimating ? "Pause" : "Resume"} Animation
          </button>

          {/* Explanation */}
          <div className="text-sm text-gray-600 text-center">
            Watch as the model (🧠) tries to predict the moving target value
            (🎯)! The loss function measures the squared difference between
            prediction and target. Adjust the learning rate to control how
            quickly the model responds to changes. Lower loss = happier model!
            😊
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LossFunctionViz;
