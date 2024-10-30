"use client"
import { useState, useEffect } from "react";
import { Brain, Play, Pause, RotateCcw, Zap, Award } from "lucide-react";

interface TrainingVisualizerProps {}

type LearningState = {
  iteration: number;
  accuracy: number;
  speed: 'slow' | 'medium' | 'fast';
  isLearning: boolean;
  currentTask: number;
};

const TRAINING_TASKS = [
  { id: 1, name: "Basic Pattern Recognition", targetAccuracy: 0.7 },
  { id: 2, name: "Simple Classification", targetAccuracy: 0.8 },
  { id: 3, name: "Complex Decision Making", targetAccuracy: 0.9 },
];

/**
 * TrainingVisualizer: Interactive component demonstrating ML training process
 * through familiar learning metaphors.
 */
const TrainingVisualizer: React.FC<TrainingVisualizerProps> = () => {
  const [learningState, setLearningState] = useState<LearningState>({
    iteration: 0,
    accuracy: 0,
    speed: 'medium',
    isLearning: false,
    currentTask: 0,
  });

  const speedMultiplier = {
    slow: 1000,
    medium: 500,
    fast: 250,
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (learningState.isLearning) {
      intervalId = setInterval(() => {
        setLearningState(prev => {
          const newAccuracy = Math.min(
            prev.accuracy + Math.random() * 0.1,
            TRAINING_TASKS[prev.currentTask].targetAccuracy
          );
          
          return {
            ...prev,
            iteration: prev.iteration + 1,
            accuracy: newAccuracy,
          };
        });
      }, speedMultiplier[learningState.speed]);
    }

    return () => clearInterval(intervalId);
  }, [learningState.isLearning, learningState.speed]);

  const handleReset = () => {
    setLearningState({
      iteration: 0,
      accuracy: 0,
      speed: 'medium',
      isLearning: false,
      currentTask: 0,
    });
  };

  const handleSpeedChange = (speed: 'slow' | 'medium' | 'fast') => {
    setLearningState(prev => ({ ...prev, speed }));
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="text-blue-500 w-6 h-6" />
          <h2 className="text-2xl font-bold">AI Training Visualizer</h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setLearningState(prev => ({ ...prev, isLearning: !prev.isLearning }))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white"
            aria-label={learningState.isLearning ? "Pause training" : "Start training"}
          >
            {learningState.isLearning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white"
            aria-label="Reset training"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Current Task</h3>
            <p>{TRAINING_TASKS[learningState.currentTask].name}</p>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Zap className="text-blue-500 w-5 h-5" />
            <div className="flex gap-2">
              {(['slow', 'medium', 'fast'] as const).map(speed => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-3 py-1 rounded ${
                    learningState.speed === speed ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
          <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
            <div
              className="absolute bottom-0 left-0 bg-green-500 transition-all duration-300"
              style={{ 
                width: '100%',
                height: `${learningState.accuracy * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Training Progress</h3>
              <p>Iterations: {learningState.iteration}</p>
            </div>
            <Award className={`w-6 h-6 ${
              learningState.accuracy >= TRAINING_TASKS[learningState.currentTask].targetAccuracy
                ? 'text-green-500'
                : 'text-gray-300'
            }`} />
          </div>
          <div className="h-40 bg-gray-100 rounded-lg overflow-hidden">
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-2xl font-bold">
                {(learningState.accuracy * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingVisualizer;