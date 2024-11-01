"use client"
import { useState, useEffect } from "react";
import { Database, FileSpreadsheet, Brain, Robot, ChevronRight, Laptop, HelpCircle, Info } from "lucide-react";

interface DataPoint {
  id: number;
  type: "image" | "text" | "number";
  label: string;
  description: string;
  isSelected: boolean;
}

const INITIAL_DATA: DataPoint[] = [
  { id: 1, type: "image", label: "🐱 Cat Photos", description: "Thousands of cat images help AI recognize different cat breeds", isSelected: false },
  { id: 2, type: "text", label: "📝 News Articles", description: "News text helps AI understand current events and writing styles", isSelected: false },
  { id: 3, type: "number", label: "📊 Weather Data", description: "Temperature and humidity patterns for weather prediction", isSelected: false },
  { id: 4, type: "image", label: "🎨 Artwork", description: "Digital art and paintings for style analysis", isSelected: false },
  { id: 5, type: "text", label: "💬 Conversations", description: "Chat logs help AI learn natural dialogue", isSelected: false },
  { id: 6, type: "number", label: "💫 Star Data", description: "Astronomical measurements for space exploration", isSelected: false }
];

export default function DatasetExplorer() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(INITIAL_DATA);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    if (isTraining) {
      const timer = setTimeout(() => {
        setIsTraining(false);
        setStep(3);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTraining]);

  const handleDataPointClick = (id: number) => {
    setDataPoints(prev => 
      prev.map(point => 
        point.id === id ? {...point, isSelected: !point.isSelected} : point
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Dataset Explorer
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <p className="text-gray-600 dark:text-gray-300">
              Discover how AI learns from different types of data
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-500' : ''}`}>
            <Database className="w-6 h-6" />
            <span className="ml-2 font-medium">Collect Data</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className={`flex items-center ${step >= 2 ? 'text-blue-500' : ''}`}>
            <Brain className="w-6 h-6" />
            <span className="ml-2 font-medium">Process</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className={`flex items-center ${step >= 3 ? 'text-green-500' : ''}`}>
            <Robot className="w-6 h-6" />
            <span className="ml-2 font-medium">Learn</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dataPoints.map((point) => (
            <div key={point.id} className="relative">
              <button
                onClick={() => handleDataPointClick(point.id)}
                onMouseEnter={() => setHoveredId(point.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`w-full p-6 rounded-xl transition-all duration-300 transform hover:scale-102
                  ${point.isSelected 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-102' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg'
                  }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <FileSpreadsheet className={`w-10 h-10 ${point.isSelected ? 'text-white' : 'text-blue-500'}`} />
                  <span className="text-lg font-semibold">{point.label}</span>
                </div>
              </button>
              {hoveredId === point.id && (
                <div className="absolute top-full mt-2 p-3 bg-gray-800 text-white rounded-lg shadow-xl z-10 text-sm w-full">
                  {point.description}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setIsTraining(true)}
            disabled={isTraining || !dataPoints.some(p => p.isSelected)}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
              ${isTraining 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
          >
            <div className="flex items-center gap-3">
              {isTraining ? (
                <>
                  <Laptop className="w-6 h-6 animate-pulse" />
                  <span>Training Model...</span>
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6" />
                  <span>Start Learning</span>
                </>
              )}
            </div>
          </button>
        </div>

        {step === 3 && (
          <div className="text-center p-6 bg-green-500 text-white rounded-xl shadow-lg animate-fadeIn">
            <p className="text-xl font-semibold">
              🎉 Success! Your AI model has learned from {dataPoints.filter(p => p.isSelected).length} different data sources!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}