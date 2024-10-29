"use client"
import { useState, useEffect } from "react";
import { ChefHat, Ruler, Brain, Play, RotateCcw, Check, X, Settings, Database, Bot } from "lucide-react";

interface AutoMLState {
  phase: 'data' | 'model' | 'tune';
  isRunning: boolean;
  accuracy: number;
  selectedDataset: string;
}

interface Dataset {
  id: string;
  name: string;
  description: string;
}

const DATASETS: Dataset[] = [
  { id: "cake", name: "Cake Recipe", description: "Predict cake quality from ingredients" },
  { id: "clothes", name: "Clothing Fit", description: "Predict clothing size from measurements" },
];

/**
 * AutoML Workshop component for teaching automated machine learning concepts
 * to high school students through interactive metaphors.
 */
export default function AutoMLWorkshop() {
  const [state, setState] = useState<AutoMLState>({
    phase: 'data',
    isRunning: false,
    accuracy: 0,
    selectedDataset: DATASETS[0].id
  });

  useEffect(() => {
    if (!state.isRunning) return;
    
    let interval = setInterval(() => {
      setState(prev => {
        if (prev.accuracy >= 95) {
          return { ...prev, isRunning: false };
        }
        return { ...prev, accuracy: prev.accuracy + 5 };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [state.isRunning]);

  const handleDatasetSelect = (id: string) => {
    setState(prev => ({ ...prev, selectedDataset: id, accuracy: 0 }));
  };

  const handleStart = () => {
    setState(prev => ({ ...prev, isRunning: true, accuracy: 0 }));
  };

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      phase: 'data',
      isRunning: false,
      accuracy: 0
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bot className="text-blue-500" />
        AutoML Workshop
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${state.phase === 'data' ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-blue-500" />
            <h2 className="font-semibold">Data Analysis</h2>
          </div>
          <select
            className="w-full p-2 rounded border"
            value={state.selectedDataset}
            onChange={(e) => handleDatasetSelect(e.target.value)}
            disabled={state.isRunning}
          >
            {DATASETS.map(dataset => (
              <option key={dataset.id} value={dataset.id}>
                {dataset.name}
              </option>
            ))}
          </select>
        </div>

        <div className={`p-4 rounded-lg ${state.phase === 'model' ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="text-blue-500" />
            <h2 className="font-semibold">Model Selection</h2>
          </div>
          <div className="h-8 bg-gray-200 rounded overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${state.accuracy}%` }}
            />
          </div>
        </div>

        <div className={`p-4 rounded-lg ${state.phase === 'tune' ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="text-blue-500" />
            <h2 className="font-semibold">Parameter Tuning</h2>
          </div>
          <p className="text-center font-bold text-xl">
            {state.accuracy}% Accuracy
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleStart}
          disabled={state.isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
        >
          <Play size={16} />
          Start AutoML
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}