"use client"
import { useState, useEffect } from "react";
import { Circle, Square, Triangle, Check, X, BrainCog, HelpCircle, Lightbulb, Target } from "lucide-react";

interface Pattern {
  shape: "circle" | "square" | "triangle";
  color: string;
  isSelected: boolean;
}

interface Tooltip {
  isVisible: boolean;
  text: string;
}

export default function InductiveReasoningDemo() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [stage, setStage] = useState(0);
  const [hypothesis, setHypothesis] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip>({ isVisible: false, text: "" });

  const colors = {
    primary: "#8B5CF6",
    secondary: "#EC4899",
    accent: "#10B981",
    highlight: "#F59E0B"
  };

  useEffect(() => {
    const initialPatterns = [
      { shape: "circle", color: colors.primary, isSelected: false },
      { shape: "square", color: colors.secondary, isSelected: false },
      { shape: "circle", color: colors.accent, isSelected: false },
      { shape: "triangle", color: colors.highlight, isSelected: false },
      { shape: "circle", color: colors.primary, isSelected: false },
    ] as Pattern[];

    setPatterns(initialPatterns);
    return () => setPatterns([]);
  }, []);

  const handleShapeClick = (index: number) => {
    if (stage !== 1) return;
    setPatterns(prev => prev.map((p, i) => ({
      ...p,
      isSelected: i === index ? !p.isSelected : p.isSelected
    })));
  };

  const checkHypothesis = () => {
    const allCirclesSelected = patterns.every((p) => 
      (p.shape === "circle" && p.isSelected) || 
      (p.shape !== "circle" && !p.isSelected)
    );
    
    setIsCorrect(allCirclesSelected);
    setStage(2);
    setHypothesis(allCirclesSelected ? 
      "Excellent! You discovered that all circles follow the pattern!" : 
      "Keep observing! Try to find what the shapes have in common.");
  };

  const renderShape = (pattern: Pattern, index: number) => {
    const ShapeComponent = {
      circle: Circle,
      square: Square,
      triangle: Triangle
    }[pattern.shape];

    return (
      <div
        key={index}
        onClick={() => handleShapeClick(index)}
        className={`relative w-20 h-20 transition-all duration-500 cursor-pointer
          ${pattern.isSelected ? 'scale-110 shadow-xl' : 'hover:scale-105'}
          ${stage === 1 ? 'animate-pulse' : ''}`}
        onMouseEnter={() => setTooltip({ 
          isVisible: true, 
          text: `Click to ${pattern.isSelected ? 'deselect' : 'select'} this shape` 
        })}
        onMouseLeave={() => setTooltip({ isVisible: false, text: "" })}
      >
        <ShapeComponent 
          size={80}
          fill={pattern.color}
          color={pattern.color}
          className={`transition-transform duration-500
            ${pattern.isSelected ? 'stroke-2 filter drop-shadow-lg' : 'stroke-1'}`}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BrainCog className="w-10 h-10 text-purple-500 animate-spin-slow" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Inductive Reasoning
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Discover patterns by observing specific examples
            </p>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-10 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-wrap justify-center gap-8">
            {patterns.map((pattern, index) => renderShape(pattern, index))}
          </div>

          {stage === 0 && (
            <div className="mt-10 text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Ready to explore patterns and make discoveries?
              </p>
              <button
                onClick={() => setStage(1)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl
                  hover:from-purple-600 hover:to-pink-600 transition duration-300 shadow-lg
                  transform hover:-translate-y-1"
              >
                Begin Pattern Discovery
              </button>
            </div>
          )}

          {stage === 1 && (
            <div className="mt-10 text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-purple-500" />
                <p className="text-gray-700 dark:text-gray-300">
                  Select shapes that follow a pattern
                </p>
              </div>
              <button
                onClick={checkHypothesis}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl
                  hover:from-blue-600 hover:to-purple-600 transition duration-300 shadow-lg
                  transform hover:-translate-y-1"
              >
                Verify Pattern
              </button>
            </div>
          )}

          {stage === 2 && (
            <div className="mt-10 space-y-6 text-center">
              <div className="flex items-center justify-center gap-3">
                {isCorrect ? (
                  <Check className="w-8 h-8 text-green-500" />
                ) : (
                  <HelpCircle className="w-8 h-8 text-yellow-500" />
                )}
                <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
                  {hypothesis}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                This demonstrates inductive reasoning: forming general conclusions from specific observations!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}