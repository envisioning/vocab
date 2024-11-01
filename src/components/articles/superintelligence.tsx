"use client"
import { useState, useEffect } from "react";
import { Brain, Zap, Rocket, Info, ChevronRight, Star, Sparkles, Cpu, Globe, Lightning, Shield } from "lucide-react";

interface SuperIntelligenceProps {}

type Intelligence = {
  level: number;
  tasks: string[];
  icon: JSX.Element;
  label: string;
  description: string;
  capabilities: string[];
}

const SuperIntelligenceExplainer: React.FC<SuperIntelligenceProps> = () => {
  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const intelligenceTypes: Intelligence[] = [
    {
      level: 1,
      tasks: ["Pattern Recognition", "Data Processing", "Specific Tasks"],
      icon: <Brain className="w-12 h-12 text-blue-300" />,
      label: "Narrow AI",
      description: "Specialized systems focused on specific tasks",
      capabilities: ["Chess playing", "Image recognition", "Language translation"]
    },
    {
      level: 2,
      tasks: ["Abstract Reasoning", "Emotional Intelligence", "Creative Thinking"],
      icon: <Globe className="w-12 h-12 text-green-300" />,
      label: "Human-Level AI",
      description: "Matching human cognitive abilities across domains",
      capabilities: ["Problem solving", "Social interaction", "Learning adaptation"]
    },
    {
      level: 3,
      tasks: ["Recursive Self-Improvement", "Universal Problem Solving", "Technological Singularity"],
      icon: <Sparkles className="w-14 h-14 text-yellow-300" />,
      label: "Superintelligence",
      description: "Transcending human intelligence exponentially",
      capabilities: ["Infinite learning", "Scientific breakthroughs", "Reality manipulation"]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating) {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentStage((prevStage) => 
              prevStage < intelligenceTypes.length - 1 ? prevStage + 1 : 0
            );
            return 0;
          }
          return prev + 1;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating, intelligenceTypes.length]);

  const getCurrentScale = () => {
    const baseScale = 1;
    const maxScale = 1.8;
    return baseScale + (progress / 100) * (maxScale - baseScale);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-8">
        <h1 className="text-5xl font-bold text-center mb-8 flex items-center gap-4">
          <Shield className="text-blue-400 w-10 h-10" />
          The Evolution of Intelligence
          <Shield className="text-blue-400 w-10 h-10" />
        </h1>

        <div className="relative w-full bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-purple-500/5 to-transparent rounded-2xl" />
          
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
            <div className="absolute top-4 right-4">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-300"
              >
                <Info className="w-5 h-5 text-blue-300" />
              </button>
              {showTooltip && (
                <div className="absolute right-0 mt-2 w-64 p-4 bg-gray-900 rounded-xl shadow-xl border border-gray-700">
                  <p className="text-sm text-gray-300">{intelligenceTypes[currentStage].description}</p>
                </div>
              )}
            </div>

            <div
              style={{ transform: `scale(${getCurrentScale()})` }}
              className="transition-all duration-300 flex flex-col items-center"
            >
              <div className="relative">
                {intelligenceTypes[currentStage].icon}
                <Lightning className="absolute -right-4 -top-4 w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold mt-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {intelligenceTypes[currentStage].label}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-8 w-full max-w-md">
              {intelligenceTypes[currentStage].capabilities.map((capability, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-700/30 px-6 py-3 rounded-xl hover:bg-gray-700/50 transition-colors duration-300"
                >
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-200">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold 
                     hover:from-blue-600 hover:to-purple-600 transition-all duration-300 
                     flex items-center gap-3 shadow-lg shadow-blue-500/20"
        >
          <Rocket className="w-6 h-6" />
          {isAnimating ? "Pause Evolution" : "Continue Evolution"}
        </button>
      </div>
    </div>
  );
};

export default SuperIntelligenceExplainer;