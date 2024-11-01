"use client"
import { useState, useEffect } from "react";
import { Brain, Image, ArrowRight, Info, Sparkles, Target, Zap } from "lucide-react";

interface InferenceProps {}

type PredictionStep = {
  id: number;
  input: string;
  process: string;
  output: string;
  confidence: number;
}

const PREDICTIONS: PredictionStep[] = [
  { 
    id: 1, 
    input: "Beach Photo", 
    process: "Analyzing colors, textures, shapes...", 
    output: "Sunny Day at Beach", 
    confidence: 0.94 
  },
  { 
    id: 2, 
    input: "X-Ray Image", 
    process: "Detecting patterns, anomalies...", 
    output: "Normal Chest X-Ray", 
    confidence: 0.89 
  },
  { 
    id: 3, 
    input: "Audio Clip", 
    process: "Processing sound waves...", 
    output: "Classical Music", 
    confidence: 0.97 
  }
];

const InferenceVisualizer: React.FC<InferenceProps> = () => {
  const [currentStep, setCurrentStep] = useState<PredictionStep | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isProcessing) {
        const nextPrediction = PREDICTIONS[completedCount % PREDICTIONS.length];
        setCurrentStep(nextPrediction);
        setIsProcessing(true);

        setTimeout(() => {
          setIsProcessing(false);
          setCompletedCount(prev => prev + 1);
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isProcessing, completedCount]);

  return (
    <div className="relative flex flex-col items-center p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl text-white">
      <div className="absolute top-4 right-4">
        <div className="relative">
          <Info 
            className="w-6 h-6 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors duration-300"
            onMouseEnter={() => setShowTooltip(1)}
            onMouseLeave={() => setShowTooltip(null)}
          />
          {showTooltip === 1 && (
            <div className="absolute right-0 w-64 p-3 mt-2 text-sm bg-blue-500 rounded-lg shadow-xl">
              Inference is how AI applies its training to make predictions on new data
            </div>
          )}
        </div>
      </div>

      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Neural Network Inference
      </h2>

      <div className="flex items-center justify-between w-full max-w-3xl p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm">
        <div className="relative group w-1/3 p-4 bg-gray-700/50 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-300">
            <Target className="w-5 h-5" />
            Input
          </h3>
          <div className="mt-3 text-gray-300">
            {currentStep?.input || "Waiting..."}
          </div>
        </div>

        <ArrowRight className={`w-8 h-8 text-blue-400 ${isProcessing ? 'animate-pulse' : ''}`} />

        <div className="relative group w-1/3 p-4 bg-gray-700/50 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-300">
            <Brain className="w-5 h-5" />
            Processing
          </h3>
          <div className="mt-3 text-gray-300">
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                {currentStep?.process}
              </div>
            ) : "Ready"}
          </div>
        </div>

        <ArrowRight className={`w-8 h-8 text-blue-400 ${isProcessing ? 'animate-pulse' : ''}`} />

        <div className="relative group w-1/3 p-4 bg-gray-700/50 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-green-300">
            <Zap className="w-5 h-5" />
            Prediction
          </h3>
          <div className="mt-3">
            {!isProcessing && currentStep && (
              <div className="space-y-2">
                <div className="text-gray-300">{currentStep.output}</div>
                <div className="text-sm text-green-400">
                  Confidence: {(currentStep.confidence * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-400 max-w-md text-center">
        Completed inferences: {completedCount}
      </div>
    </div>
  );
};

export default InferenceVisualizer;