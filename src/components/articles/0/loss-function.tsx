"use client"
import { useState, useEffect } from "react";
import { 
  Target, 
  CircleDot, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb,
  Brain,
  TrendingDown
} from "lucide-react";

interface LossFunctionProps {}

const INITIAL_PREDICTION = 75;
const INITIAL_TARGET = 50;
const STEP_SIZE = 2;

const LossFunctionDemo: React.FC<LossFunctionProps> = () => {
  const [prediction, setPrediction] = useState<number>(INITIAL_PREDICTION);
  const [target] = useState<number>(INITIAL_TARGET);
  const [loss, setLoss] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentTip, setCurrentTip] = useState<number>(0);

  const tips = [
    "The loss function measures how far our prediction is from the target value.",
    "A smaller loss means better predictions - try to minimize it!",
    "In real ML models, this process happens automatically through optimization.",
  ];

  useEffect(() => {
    const loss = Math.round(Math.pow(prediction - target, 2) / 100);
    setLoss(loss);
    return () => setIsAnimating(false);
  }, [prediction, target]);

  const handlePredictionChange = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPrediction(prev => {
      const newValue = direction === 'right' 
        ? Math.min(prev + STEP_SIZE, 100) 
        : Math.max(prev - STEP_SIZE, 0);
      return newValue;
    });

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="flex flex-col p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 rounded-xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <Brain className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Loss Function Explorer
        </h1>
      </div>

      <div className="relative h-40 bg-white/90 dark:bg-gray-800/90 rounded-xl p-4 mb-6">
        <div className="absolute left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 top-1/2" />
        
        <div 
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${target}%` }}
        >
          <Target className="w-8 h-8 text-green-500 -translate-x-1/2" />
          <div className="absolute top-8 -translate-x-1/2 px-3 py-1 bg-green-100 dark:bg-green-900/50 rounded-full shadow-sm min-w-[120px]">
            <span className="block text-sm font-medium text-green-700 dark:text-green-300 text-center">
              Target: {target}
            </span>
          </div>
        </div>

        <div 
          className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isAnimating ? 'scale-110' : ''
          }`}
          style={{ left: `${prediction}%` }}
        >
          <div className="absolute -top-12 -translate-x-1/2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-full shadow-sm min-w-[120px]">
            <span className="block text-sm font-medium text-blue-700 dark:text-blue-300 text-center">
              Prediction: {prediction}
            </span>
          </div>
          <CircleDot className="w-8 h-8 text-blue-500 -translate-x-1/2" />
        </div>

        <div 
          className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-red-400/60 transition-all duration-300"
          style={{
            left: `${Math.min(prediction, target)}%`,
            width: `${Math.abs(prediction - target)}%`
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePredictionChange('left')}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors duration-300"
            disabled={isAnimating}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => handlePredictionChange('right')}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors duration-300"
            disabled={isAnimating}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg">
          <TrendingDown className="w-5 h-5 text-red-500" />
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loss: {loss}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-blue-100/80 dark:bg-blue-950/50 p-4 rounded-lg">
        <Lightbulb className="w-6 h-6 text-blue-500 flex-shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {tips[currentTip]}
        </p>
        <button 
          onClick={() => setCurrentTip(prev => (prev + 1) % tips.length)}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-300"
        >
          Next Tip
        </button>
      </div>
    </div>
  );
};

export default LossFunctionDemo;