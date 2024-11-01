"use client";
import { useState, useEffect } from "react";
import { Brain, Target, Info, ArrowRight, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

interface TrainingStep {
  id: number;
  input: number[];
  prediction: number;
  actual: number;
  learned: boolean;
  rule: string;
}

const INITIAL_STEPS: TrainingStep[] = [
  { id: 1, input: [2, 4], prediction: 8, actual: 6, learned: false, rule: "Add numbers" },
  { id: 2, input: [3, 5], prediction: 11, actual: 8, learned: false, rule: "Add numbers" },
  { id: 3, input: [4, 2], prediction: 9, actual: 6, learned: false, rule: "Add numbers" },
  { id: 4, input: [1, 3], prediction: 6, actual: 4, learned: false, rule: "Add numbers" }
];

const TrainingVisualizer = () => {
  const [steps, setSteps] = useState<TrainingStep[]>(INITIAL_STEPS);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  useEffect(() => {
    if (isTraining && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setSteps(prev => prev.map(step => 
          step.id === currentStep + 1 
            ? { ...step, learned: true, prediction: step.actual }
            : step
        ));
        setCurrentStep(prev => prev + 1);
        setAccuracy((currentStep + 1) / steps.length * 100);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isTraining, currentStep]);

  const handleStartTraining = () => setIsTraining(true);
  const handleReset = () => {
    setSteps(INITIAL_STEPS);
    setCurrentStep(0);
    setIsTraining(false);
    setAccuracy(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Brain className="w-10 h-10 text-blue-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-bounce" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Neural Training Lab
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Watch the AI learn patterns in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
              <Target className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold text-blue-600 dark:text-blue-300">
                Accuracy: {accuracy.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {steps.map(step => (
              <div 
                key={step.id}
                className={`relative flex items-center justify-between p-6 rounded-xl transition-all duration-500
                  ${step.id === currentStep + 1 
                    ? 'bg-blue-50 dark:bg-blue-900/30 scale-105 shadow-lg' 
                    : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}
                onMouseEnter={() => setShowTooltip(step.id)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <div className="flex items-center gap-6">
                  <div className="flex gap-3">
                    {step.input.map((num, idx) => (
                      <span 
                        key={idx}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 font-bold text-lg shadow-inner"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg shadow-lg
                    ${step.learned 
                      ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {step.learned ? step.actual : step.prediction}
                  </div>
                </div>
                
                {step.learned ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-gray-400" />
                )}

                {showTooltip === step.id && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm shadow-xl">
                    {step.rule}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            {!isTraining ? (
              <button
                onClick={handleStartTraining}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Brain className="w-5 h-5" />
                Start Training
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold text-lg transition duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-5 h-5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingVisualizer;