"use client"
import { useState, useEffect } from "react";
import { ChevronRight, Database, Wand2, Brain, Sparkles, Info, Calculator, Calendar, Palette, Thermometer } from "lucide-react";

interface FeatureDesignProps {}

type DataPoint = {
  id: number;
  raw: string;
  engineered: string;
  explanation: string;
  icon: JSX.Element;
  isTransforming: boolean;
};

const INITIAL_DATA: DataPoint[] = [
  {
    id: 1,
    raw: "Height: 180cm",
    engineered: "Height_normalized: 0.75",
    explanation: "Scaled to range 0-1 for consistent model input",
    icon: <Calculator className="w-5 h-5" />,
    isTransforming: false
  },
  {
    id: 2,
    raw: "Date: 2024-02-20",
    engineered: "DayOfWeek: 2",
    explanation: "Extracted meaningful temporal pattern",
    icon: <Calendar className="w-5 h-5" />,
    isTransforming: false
  },
  {
    id: 3,
    raw: "Color: Red",
    engineered: "Color_encoded: 1",
    explanation: "Converted categorical to numerical value",
    icon: <Palette className="w-5 h-5" />,
    isTransforming: false
  },
  {
    id: 4,
    raw: "Temperature: 25°C",
    engineered: "Temp_scaled: 0.4",
    explanation: "Normalized temperature for global comparison",
    icon: <Thermometer className="w-5 h-5" />,
    isTransforming: false
  }
];

export default function FeatureDesignVisualizer({}: FeatureDesignProps) {
  const [data, setData] = useState<DataPoint[]>(INITIAL_DATA);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  useEffect(() => {
    return () => setIsProcessing(false);
  }, []);

  const transformFeatures = () => {
    setIsProcessing(true);
    const transformSequence = async () => {
      for (let i = 0; i < data.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(prev => prev.map((item, idx) => ({
          ...item,
          isTransforming: idx === i
        })));
      }
      setIsProcessing(false);
    };
    transformSequence();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 font-serif">
            Feature Design Laboratory 🧪
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Transform raw data into powerful machine learning features
          </p>
        </div>

        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 border border-blue-100 dark:border-blue-900">
          <button
            onClick={transformFeatures}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center space-x-3 transition duration-300 disabled:opacity-50 text-lg font-semibold shadow-lg"
          >
            <Wand2 className="w-6 h-6" />
            <span>Transform Features</span>
          </button>

          <div className="space-y-6">
            {data.map((item) => (
              <div
                key={item.id}
                className={`relative flex items-center space-x-6 p-6 rounded-2xl transition-all duration-500 
                ${item.isTransforming ? 'bg-blue-100 dark:bg-blue-900/50 shadow-lg scale-105' : 'bg-gray-50 dark:bg-gray-700/50'}`}
              >
                <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                  {item.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-200">{item.raw}</p>
                  <div className="relative">
                    <Info
                      className="w-4 h-4 text-blue-400 hover:text-blue-500 cursor-pointer transition-colors duration-300"
                      onMouseEnter={() => setActiveTooltip(item.id)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === item.id && (
                      <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-blue-600 text-white text-sm rounded-lg shadow-lg z-10">
                        {item.explanation}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={`w-6 h-6 transition-all duration-500 
                  ${item.isTransforming ? 'text-blue-500 translate-x-3' : 'text-gray-400'}`}
                />
                <div className="flex-1">
                  <p className={`text-lg font-medium transition-all duration-500
                    ${item.isTransforming ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-700 dark:text-gray-200'}`}>
                    {item.engineered}
                  </p>
                </div>
                {item.isTransforming && (
                  <Sparkles className="w-6 h-6 text-blue-500 animate-pulse absolute -right-3" />
                )}
              </div>
            ))}
          </div>

          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <Brain className={`w-12 h-12 ${isProcessing ? 'text-green-500 animate-bounce' : 'text-blue-400'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}