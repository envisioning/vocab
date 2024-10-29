"use client"
import { useState, useEffect } from "react";
import { LineChart, Brush, Ruler, AlertCircle, ChevronRight } from "lucide-react";

interface DataPoint {
  x: number;
  y: number;
}

interface UnderfittingProps {}

const PATTERNS: DataPoint[][] = [
  Array.from({ length: 10 }, (_, i) => ({
    x: i,
    y: Math.sin(i * 0.5) * 3 + 5,
  })),
  Array.from({ length: 10 }, (_, i) => ({
    x: i,
    y: i * i * 0.2 + 2,
  })),
  Array.from({ length: 10 }, (_, i) => ({
    x: i,
    y: Math.exp(i * 0.3),
  })),
];

/**
 * Interactive component teaching underfitting through visual pattern matching
 */
export default function UnderfittingVisualizer({}: UnderfittingProps) {
  const [currentPattern, setCurrentPattern] = useState<number>(0);
  const [complexity, setComplexity] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setComplexity((prev) => (prev < 5 ? prev + 1 : 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    const error = calculateError(complexity);
    setScore(100 - error);
    
    setFeedback(
      error > 70
        ? "Too simple! The model can't capture the pattern."
        : error > 30
        ? "Getting better, but still missing details."
        : "Great fit! The model captures the pattern well."
    );
  }, [complexity]);

  const calculateError = (modelComplexity: number): number => {
    const baseError = 100 - modelComplexity * 20;
    return Math.max(0, Math.min(100, baseError));
  };

  const handleComplexityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAnimating(false);
    setComplexity(Number(e.target.value));
  };

  const handleNextPattern = () => {
    setCurrentPattern((prev) => (prev + 1) % PATTERNS.length);
    setComplexity(1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Pattern Matcher</h2>
        <button
          onClick={handleNextPattern}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label="Next pattern"
        >
          Next <ChevronRight size={20} />
        </button>
      </div>

      <div className="relative h-64 mb-6 bg-white rounded border border-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <LineChart className="text-blue-500" size={32} />
          {Array.from({ length: complexity }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-green-500 w-2 h-2 rounded-full"
              style={{
                left: `${(i + 1) * (100 / (complexity + 1))}%`,
                top: `${50 + Math.sin(i) * 20}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 mb-2">
          <Ruler className="text-gray-600" size={20} />
          <span>Model Complexity</span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={complexity}
          onChange={handleComplexityChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          aria-label="Adjust model complexity"
        />
      </div>

      <div className="flex items-center gap-4 p-4 bg-gray-100 rounded">
        <AlertCircle
          className={score > 70 ? "text-green-500" : "text-gray-500"}
          size={24}
        />
        <div>
          <div className="font-semibold">Score: {score.toFixed(0)}</div>
          <p className="text-gray-600">{feedback}</p>
        </div>
      </div>
    </div>
  );
}