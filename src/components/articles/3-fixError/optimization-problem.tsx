"use client"
import { useState, useEffect } from "react";
import { Mountain, ArrowRight, ArrowLeft, Flag, Target, Info, Bot, User } from "lucide-react";

interface HikerPosition {
  x: number;
  y: number;
}

interface ComponentProps {}

const OptimizationDemo: React.FC<ComponentProps> = () => {
  const [hikerPos, setHikerPos] = useState<HikerPosition>({ x: 50, y: 80 });
  const [score, setScore] = useState<number>(0);
  const [isClimbing, setIsClimbing] = useState<boolean>(false);
  const [bestScore, setBestScore] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleMove = (direction: "left" | "right") => {
    setHikerPos(prev => {
      const newX = direction === "left" ? Math.max(0, prev.x - 10) : Math.min(90, prev.x + 10);
      const newY = 80 - Math.sin((newX / 90) * Math.PI) * 40;
      const currentScore = Math.round((80 - newY) * 100) / 100;
      setScore(currentScore);
      if (currentScore > bestScore) setBestScore(currentScore);
      return { x: newX, y: newY };
    });
  };

  useEffect(() => {
    if (isClimbing) {
      const interval = setInterval(() => {
        const leftScore = Math.sin(((hikerPos.x - 10) / 90) * Math.PI) * 40;
        const rightScore = Math.sin(((hikerPos.x + 10) / 90) * Math.PI) * 40;
        
        if (leftScore > rightScore && hikerPos.x > 0) {
          handleMove("left");
        } else if (rightScore > leftScore && hikerPos.x < 90) {
          handleMove("right");
        } else {
          setIsClimbing(false);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isClimbing, hikerPos]);

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-2xl">
      <div className="relative mb-8">
        <h2 className="text-4xl font-bold text-gray-800 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          AI Optimization Explorer
        </h2>
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="absolute right-0 top-0 p-2 text-blue-500 hover:text-blue-600 transition-colors duration-300"
        >
          <Info className="w-6 h-6" />
        </button>
        {showTooltip && (
          <div className="absolute right-0 top-12 w-72 p-4 bg-white rounded-lg shadow-xl z-10 text-sm text-gray-600 border border-blue-100">
            <p className="mb-2">This visualization demonstrates how AI finds optimal solutions:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>The mountain represents our problem space</li>
              <li>The peak is the optimal solution</li>
              <li>Watch AI climb efficiently vs manual exploration</li>
            </ul>
          </div>
        )}
      </div>

      <div className="relative h-96 bg-gradient-to-b from-purple-100 via-blue-50 to-slate-100 rounded-xl overflow-hidden shadow-inner">
        <div className="absolute bottom-0 w-full h-4/5">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4B5563" />
                <stop offset="50%" stopColor="#6B7280" />
                <stop offset="100%" stopColor="#4B5563" />
              </linearGradient>
            </defs>
            <path
              d="M0 100 Q 50 20, 100 100"
              fill="url(#mountainGradient)"
              className="transition-all duration-300"
            />
          </svg>
        </div>

        <div
          style={{
            left: `${hikerPos.x}%`,
            bottom: `${hikerPos.y}%`,
          }}
          className="absolute transition-all duration-500"
        >
          {isClimbing ? (
            <Bot className="w-8 h-8 text-blue-600 animate-bounce" />
          ) : (
            <User className="w-8 h-8 text-purple-600 animate-pulse" />
          )}
        </div>

        <div className="absolute left-[50%] bottom-[60%]">
          <Flag className="w-8 h-8 text-red-500 animate-pulse" />
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <div className="space-x-4">
          <button
            onClick={() => handleMove("left")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md"
          >
            <ArrowLeft className="inline-block" />
          </button>
          <button
            onClick={() => handleMove("right")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md"
          >
            <ArrowRight className="inline-block" />
          </button>
          <button
            onClick={() => setIsClimbing(prev => !prev)}
            className={`px-6 py-3 ${
              isClimbing 
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            } text-white rounded-lg transition duration-300 shadow-md`}
          >
            {isClimbing ? "Stop AI" : "Start AI"}
          </button>
        </div>

        <div className="text-right space-y-1">
          <p className="text-gray-700 font-medium">Current Height: <span className="text-blue-600">{score.toFixed(2)}m</span></p>
          <p className="text-gray-700 font-medium">Best Height: <span className="text-green-600">{bestScore.toFixed(2)}m</span></p>
        </div>
      </div>
    </div>
  );
};

export default OptimizationDemo;