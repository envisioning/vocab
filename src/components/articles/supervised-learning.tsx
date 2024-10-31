"use client"
import { useState, useEffect } from "react";
import { Brain, Tag, CheckCircle2, BookOpen, HelpCircle, Sparkles } from "lucide-react";

interface DataPoint {
  id: number;
  x: number;
  y: number;
  label: "cat" | "dog";
  isClassified: boolean;
}

interface ComponentProps {}

const TOOLTIPS = {
  training: "The model learns from labeled examples, like a student learning from solved problems",
  features: "Features are characteristics like size, fur pattern, and ear shape that help identify cats and dogs",
  classification: "The model gradually learns to recognize patterns and make accurate predictions",
};

const SupervisedLearningDemo: React.FC<ComponentProps> = () => {
  const [phase, setPhase] = useState<"training" | "prediction">("training");
  const [progress, setProgress] = useState<number>(0);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isLearning, setIsLearning] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string>("");

  useEffect(() => {
    const initialData: DataPoint[] = [
      { id: 1, x: 25, y: 35, label: "cat", isClassified: false },
      { id: 2, x: 45, y: 65, label: "dog", isClassified: false },
      { id: 3, x: 65, y: 25, label: "cat", isClassified: false },
      { id: 4, x: 85, y: 75, label: "dog", isClassified: false },
    ];
    setDataPoints(initialData);

    return () => {
      setDataPoints([]);
      setProgress(0);
    };
  }, []);

  useEffect(() => {
    if (isLearning) {
      const interval = setInterval(() => {
        setDataPoints((prev) =>
          prev.map((point, idx) => ({
            ...point,
            isClassified: progress >= (idx * 25),
          }))
        );
        
        setProgress((prev) => {
          if (prev >= 100) {
            setIsLearning(false);
            setPhase("prediction");
            return 100;
          }
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isLearning, progress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 p-8 text-white">
      <div className="absolute top-4 right-4 flex gap-4">
        <button
          onMouseEnter={() => setActiveTooltip("training")}
          onMouseLeave={() => setActiveTooltip("")}
          className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-300"
        >
          <HelpCircle className="w-6 h-6 text-blue-300" />
        </button>
        <button
          onMouseEnter={() => setActiveTooltip("features")}
          onMouseLeave={() => setActiveTooltip("")}
          className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-300"
        >
          <BookOpen className="w-6 h-6 text-blue-300" />
        </button>
      </div>

      {activeTooltip && (
        <div className="absolute top-16 right-4 w-64 p-4 bg-gray-800/90 rounded-lg border border-blue-500/30 backdrop-blur-sm">
          <p className="text-sm text-blue-100">{TOOLTIPS[activeTooltip as keyof typeof TOOLTIPS]}</p>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8 text-blue-300 flex items-center gap-3">
        <Brain className="w-10 h-10" />
        Supervised Learning Explorer
      </h1>

      <div className="relative w-full max-w-3xl h-96 bg-gray-800/50 rounded-2xl border border-blue-500/30 p-6 mb-8 backdrop-blur-sm">
        <div className="absolute inset-0 flex items-center justify-center">
          {dataPoints.map((point) => (
            <div
              key={point.id}
              className={`absolute transition-all duration-500 ${
                point.isClassified ? "scale-110" : "scale-100"
              }`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
            >
              <div
                className={`flex items-center gap-2 p-3 rounded-xl ${
                  point.isClassified
                    ? point.label === "cat"
                      ? "bg-blue-500/90 shadow-lg shadow-blue-500/20"
                      : "bg-green-500/90 shadow-lg shadow-green-500/20"
                    : "bg-gray-700/90"
                } transition-all duration-300 backdrop-blur-sm`}
              >
                <Tag className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {point.label.charAt(0).toUpperCase() + point.label.slice(1)}
                </span>
                {point.isClassified && <Sparkles className="w-4 h-4 text-white/80" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl mb-8">
        <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-blue-500 transition-all duration-300 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {phase === "training" && !isLearning && (
          <button
            onClick={() => setIsLearning(true)}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
          >
            <Brain className="w-6 h-6" />
            Begin Learning Process
          </button>
        )}
        {phase === "prediction" && (
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <div className="text-2xl font-medium text-green-400 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" />
              Learning Complete!
            </div>
            <p className="text-blue-200 text-lg">
              The AI has mastered cat and dog classification
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisedLearningDemo;