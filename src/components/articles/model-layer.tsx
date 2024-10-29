"use client"
import { useState, useEffect } from "react";
import { Coffee, Image, ArrowRight, Zap, Circle } from "lucide-react";

interface LayerState {
  level: number;
  isProcessing: boolean;
  features: string[];
}

const INITIAL_FEATURES = [
  "Raw Data",
  "Basic Shapes",
  "Complex Patterns",
  "Abstract Concepts"
];

/**
 * LayerLensExplorer: Interactive component teaching model layers through metaphors
 */
export default function LayerLensExplorer() {
  const [layerState, setLayerState] = useState<LayerState>({
    level: 0,
    isProcessing: false,
    features: INITIAL_FEATURES
  });
  const [activeMetaphor, setActiveMetaphor] = useState<"art" | "coffee">("art");

  useEffect(() => {
    let processingTimer: number;
    
    if (layerState.isProcessing) {
      processingTimer = window.setTimeout(() => {
        setLayerState(prev => ({
          ...prev,
          level: prev.level < 3 ? prev.level + 1 : prev.level,
          isProcessing: false
        }));
      }, 1500);
    }

    return () => {
      if (processingTimer) clearTimeout(processingTimer);
    };
  }, [layerState.isProcessing]);

  const handleProcessLayer = () => {
    if (layerState.level < 3) {
      setLayerState(prev => ({ ...prev, isProcessing: true }));
    }
  };

  const handleReset = () => {
    setLayerState({
      level: 0,
      isProcessing: false,
      features: INITIAL_FEATURES
    });
  };

  const toggleMetaphor = () => {
    setActiveMetaphor(prev => prev === "art" ? "coffee" : "art");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between mb-6">
        <button
          onClick={toggleMetaphor}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          aria-label="Toggle metaphor view"
        >
          {activeMetaphor === "art" ? <Image size={20} /> : <Coffee size={20} />}
          <span>{activeMetaphor === "art" ? "Art Gallery" : "Coffee Filter"}</span>
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          aria-label="Reset visualization"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 mb-6">
        {layerState.features.map((feature, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300
              ${idx === layerState.level ? 'bg-blue-100 border-2 border-blue-500' : 
                idx < layerState.level ? 'bg-green-100' : 'bg-gray-100'}`}
            role="region"
            aria-label={`Layer ${idx + 1}`}
          >
            <Circle
              size={24}
              className={idx <= layerState.level ? 'text-green-500' : 'text-gray-400'}
            />
            <span className="flex-1">{feature}</span>
            {idx === layerState.level && layerState.isProcessing && (
              <Zap className="animate-pulse text-blue-500" />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleProcessLayer}
        disabled={layerState.level >= 3 || layerState.isProcessing}
        className={`w-full py-3 rounded-lg flex items-center justify-center gap-2
          ${layerState.level >= 3 || layerState.isProcessing
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        aria-label="Process next layer"
      >
        Process Next Layer
        <ArrowRight size={20} />
      </button>
    </div>
  );
}