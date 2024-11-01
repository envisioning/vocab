"use client"
import { useState, useEffect } from "react";
import { Target, Brain, Lightbulb, RefreshCw, HelpCircle } from "lucide-react";

interface PredictionPoint {
  actual: number;
  predicted: number;
  x: number;
}

interface TooltipState {
  show: boolean;
  content: string;
  x: number;
  y: number;
}

const LossFunctionVisualizer = () => {
  const [predictions, setPredictions] = useState<PredictionPoint[]>([]);
  const [lossScore, setLossScore] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const generatePoints = () => {
      const newPoints = Array.from({ length: 5 }, (_, i) => ({
        actual: Math.sin(i * 0.8) * 50 + 100,
        predicted: Math.sin(i * 0.8) * 50 + 100 + (Math.random() - 0.5) * 40,
        x: 50 + i * 100,
      }));
      setPredictions(newPoints);
    };

    generatePoints();
    const interval = setInterval(() => {
      if (isAnimating) generatePoints();
    }, 2000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    const calculateLoss = () => {
      const mse = predictions.reduce((acc, point) => {
        return acc + Math.pow(point.actual - point.predicted, 2);
      }, 0) / predictions.length;
      setLossScore(Math.round(mse));
    };
    calculateLoss();
  }, [predictions]);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Brain className="w-10 h-10 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Loss Function Explorer</h2>
          <HelpCircle
            className="w-6 h-6 text-gray-400 cursor-help hover:text-blue-400 transition-colors duration-300"
            onMouseEnter={(e) => setTooltip({
              show: true,
              content: "Loss functions help AI models learn by measuring prediction errors",
              x: e.clientX,
              y: e.clientY
            })}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
        </div>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 transform hover:scale-105"
        >
          <RefreshCw className={`${isAnimating ? "animate-spin" : ""}`} />
          {isAnimating ? "Pause Learning" : "Resume Learning"}
        </button>
      </div>

      <div className="relative h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700">
        <div className="absolute inset-0">
          {predictions.map((point, index) => (
            <div key={index} className="absolute" style={{ left: point.x }}>
              <div
                className="absolute w-5 h-5 bg-green-400 rounded-full shadow-lg transform -translate-x-2 transition-all duration-300 hover:scale-150"
                style={{ top: point.actual }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  Actual
                </div>
              </div>

              <div
                className="absolute w-5 h-5 bg-blue-400 rounded-full shadow-lg transform -translate-x-2 transition-all duration-300 hover:scale-150"
                style={{ top: point.predicted }}
              >
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  Predicted
                </div>
              </div>

              <div
                className="absolute w-1 bg-gradient-to-b from-red-400 to-red-600 opacity-75"
                style={{
                  top: Math.min(point.actual, point.predicted),
                  left: -0.5,
                  height: Math.abs(point.actual - point.predicted),
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <div className="flex items-center justify-center gap-6">
          <Target className="w-10 h-10 text-red-400" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">
              Loss Score: {lossScore}
            </span>
            <div className="flex items-center gap-2 mt-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300">
                Lower scores indicate better predictions!
              </span>
            </div>
          </div>
        </div>
      </div>

      {tooltip.show && (
        <div 
          className="fixed bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-blue-500 max-w-xs z-50"
          style={{ left: tooltip.x + 10, top: tooltip.y - 10 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default LossFunctionVisualizer;