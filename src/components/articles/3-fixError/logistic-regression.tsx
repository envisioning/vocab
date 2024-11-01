"use client"
import { useState, useEffect } from "react";
import { Brain, ChevronUp, ChevronDown, Info, Target, Sparkles, RefreshCw } from "lucide-react";

interface Point {
  x: number;
  y: number;
  class: 0 | 1;
  label: string;
}

interface ComponentProps {}

const INITIAL_POINTS: Point[] = [
  { x: 20, y: 80, class: 0, label: "📱 Social Media" },
  { x: 30, y: 85, class: 0, label: "🎮 Gaming" },
  { x: 25, y: 75, class: 0, label: "🎵 Music" },
  { x: 35, y: 70, class: 0, label: "📺 Streaming" },
  { x: 75, y: 25, class: 1, label: "📚 Study" },
  { x: 70, y: 20, class: 1, label: "✏️ Homework" },
  { x: 80, y: 30, class: 1, label: "📖 Reading" },
  { x: 85, y: 15, class: 1, label: "🧮 Math" },
];

const LogisticRegressionVisualizer: React.FC<ComponentProps> = () => {
  const [points, setPoints] = useState<Point[]>(INITIAL_POINTS);
  const [linePosition, setLinePosition] = useState<number>(50);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  const calculateAccuracy = (position: number): number => {
    const correct = points.filter(point => 
      (point.y > position && point.class === 0) || 
      (point.y <= position && point.class === 1)
    ).length;
    return (correct / points.length) * 100;
  };

  useEffect(() => {
    if (isAnimating) {
      let pos = 90;
      const interval = setInterval(() => {
        if (pos > 10) {
          setLinePosition(pos);
          setAccuracy(calculateAccuracy(pos));
          pos -= 1;
        } else {
          setIsAnimating(false);
          setLinePosition(50);
          setAccuracy(calculateAccuracy(50));
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 min-h-screen">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Time Management AI
          </h2>
          <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-md flex items-center justify-center gap-2">
          <ChevronUp className="w-4 h-4 text-red-400" />
          Distracting Activities
          <Info className="w-4 h-4 text-blue-500 cursor-help" />
          Productive Tasks
          <ChevronDown className="w-4 h-4 text-green-400" />
        </p>
      </div>

      <div className="relative w-[500px] h-[500px] bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl mb-8 backdrop-blur-sm border border-blue-100 dark:border-blue-900">
        <div className="absolute w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg transition-all duration-500"
             style={{ top: `${linePosition}%` }} />
        
        {points.map((point, index) => (
          <div key={index}
               className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
               style={{ left: `${point.x}%`, top: `${point.y}%` }}
               onMouseEnter={() => setShowTooltip(index)}
               onMouseLeave={() => setShowTooltip(null)}>
            <div className={`text-2xl cursor-help ${point.class === 1 ? 'animate-bounce' : 'animate-pulse'}`}>
              {point.label.split(' ')[0]}
            </div>
            {showTooltip === index && (
              <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-xl -translate-x-1/2 left-1/2 whitespace-nowrap">
                {point.label}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setIsAnimating(true)}
          disabled={isAnimating}
          className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full
            shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl
            disabled:opacity-50 flex items-center gap-3">
          <Brain className="w-6 h-6 group-hover:animate-spin" />
          <span className="font-semibold">Optimize My Time</span>
          <Target className="w-6 h-6 group-hover:animate-pulse" />
        </button>

        <div className="flex items-center gap-2">
          <RefreshCw className={`w-5 h-5 text-blue-500 ${isAnimating ? 'animate-spin' : ''}`} />
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Efficiency Score: {accuracy.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogisticRegressionVisualizer;