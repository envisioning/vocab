"use client";
import { useState, useEffect } from "react";
import {
  Brain,
  Calculator,
  Heart,
  Music,
  Book,
  Puzzle,
  Trophy,
  AlertCircle,
} from "lucide-react";

interface Capability {
  id: string;
  name: string;
  icon: JSX.Element;
  humanLevel: number;
  aiLevel: number;
}

interface ComparisonState {
  isAnimating: boolean;
  currentYear: number;
  selectedCapability: string;
}

const CAPABILITIES: Capability[] = [
  {
    id: "math",
    name: "Mathematical Reasoning",
    icon: <Calculator size={24} />,
    humanLevel: 85,
    aiLevel: 95,
  },
  {
    id: "emotional",
    name: "Emotional Intelligence",
    icon: <Heart size={24} />,
    humanLevel: 90,
    aiLevel: 40,
  },
  {
    id: "creative",
    name: "Creative Expression",
    icon: <Music size={24} />,
    humanLevel: 88,
    aiLevel: 60,
  },
  {
    id: "learning",
    name: "Adaptive Learning",
    icon: <Book size={24} />,
    humanLevel: 92,
    aiLevel: 75,
  },
  {
    id: "problem",
    name: "Problem Solving",
    icon: <Puzzle size={24} />,
    humanLevel: 87,
    aiLevel: 82,
  },
];

const AIComparisonVisualizer = () => {
  const [state, setState] = useState<ComparisonState>({
    isAnimating: false,
    currentYear: new Date().getFullYear(),
    selectedCapability: "math",
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (state.isAnimating) {
      intervalId = setInterval(() => {
        setState((prev) => ({
          ...prev,
          currentYear:
            prev.currentYear < new Date().getFullYear() + 7
              ? prev.currentYear + 1
              : new Date().getFullYear(),
        }));
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [state.isAnimating]);

  const handleCapabilitySelect = (capabilityId: string) => {
    setState((prev) => ({
      ...prev,
      selectedCapability: capabilityId,
    }));
  };

  const toggleAnimation = () => {
    setState((prev) => ({
      ...prev,
      isAnimating: !prev.isAnimating,
    }));
  };

  const selectedCap = CAPABILITIES.find(
    (cap) => cap.id === state.selectedCapability
  );
  if (!selectedCap) return null;

  const baseYear = new Date().getFullYear();
  const yearProgress = (state.currentYear - baseYear) / 7;
  const aiProgressLevel = selectedCap.aiLevel * (1 + yearProgress);

  return (
    <div
      className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg"
      role="main"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="text-blue-500" />
          Human-Level AI Comparison
        </h2>
        <button
          onClick={toggleAnimation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label={state.isAnimating ? "Pause Animation" : "Start Animation"}
        >
          {state.isAnimating ? "Pause" : "Simulate Future"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {CAPABILITIES.map((capability) => (
          <button
            key={capability.id}
            onClick={() => handleCapabilitySelect(capability.id)}
            className={`p-4 rounded-lg flex items-center gap-2 transition duration-300 ${
              state.selectedCapability === capability.id
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-white border-2 border-gray-200 hover:border-blue-300"
            }`}
            aria-selected={state.selectedCapability === capability.id}
          >
            {capability.icon}
            <span>{capability.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="text-green-500" />
            <span>Current Year: {state.currentYear}</span>
          </div>
          <AlertCircle className="text-blue-500" />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Human Capability</label>
            <div className="h-4 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${selectedCap.humanLevel}%` }}
                role="progressbar"
                aria-valuenow={selectedCap.humanLevel}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">AI Capability</label>
            <div className="h-4 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${Math.min(aiProgressLevel, 100)}%` }}
                role="progressbar"
                aria-valuenow={Math.min(aiProgressLevel, 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIComparisonVisualizer;
