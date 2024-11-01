"use client"
import { useState, useEffect } from "react";
import { Brain, Waves, Wind, Zap, AlertTriangle, Info, ArrowRight } from "lucide-react";

interface ModelStabilityProps {}

type DataPoint = {
  x: number;
  y: number;
  isStable: boolean;
  prediction: number;
};

const INITIAL_DATA_POINTS = 6;
const TOOLTIPS = {
  stability: "A stable model maintains consistent predictions even when input data slightly varies",
  perturbation: "Represents noise or variations in input data",
  prediction: "Model's output prediction value",
  variance: "High variance indicates the model is sensitive to small changes",
};

const ModelStability: React.FC<ModelStabilityProps> = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isStable, setIsStable] = useState<boolean>(true);
  const [perturbation, setPerturbation] = useState<number>(0);
  const [activeTooltip, setActiveTooltip] = useState<string>("");

  useEffect(() => {
    const generatePoints = () => {
      const points = Array.from({ length: INITIAL_DATA_POINTS }, (_, i) => ({
        x: (i * 100) + 50,
        y: 150,
        isStable: true,
        prediction: 0.5
      }));
      setDataPoints(points);
    };

    generatePoints();
    const handleResize = () => generatePoints();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      setDataPoints([]);
    };
  }, []);

  const handlePerturbationChange = (value: number) => {
    setPerturbation(value);
    setDataPoints(prev => 
      prev.map(point => {
        const variation = (Math.random() - 0.5) * value * 200;
        const prediction = 0.5 + (variation / 400);
        return {
          ...point,
          y: 150 + variation,
          isStable: value < 0.5,
          prediction: Math.max(0, Math.min(1, prediction))
        };
      })
    );
    setIsStable(value < 0.5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <Brain className="w-12 h-12 text-blue-500" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center sm:text-left">
              Model Stability Explorer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Discover how model stability affects prediction reliability
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 group relative"
                 onMouseEnter={() => setActiveTooltip("stability")}
                 onMouseLeave={() => setActiveTooltip("")}>
              <Waves className={`w-8 h-8 ${isStable ? 'text-green-500' : 'text-red-500'}`} />
              <div>
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {isStable ? 'Stable Model' : 'Unstable Model'}
                </span>
                <Info className="w-4 h-4 inline-block ml-2 text-gray-400" />
              </div>
              {activeTooltip === "stability" && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 text-white text-sm rounded-md w-48 z-10">
                  {TOOLTIPS.stability}
                </div>
              )}
            </div>
            
            {!isStable && (
              <div className="flex items-center gap-2 text-red-500 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
                <span className="text-sm font-medium">High Variance Detected</span>
              </div>
            )}
          </div>

          <div className="relative h-80 mb-8 border-b border-l border-gray-300 dark:border-gray-600 overflow-hidden">
            {dataPoints.map((point, index) => (
              <div key={index} className="absolute flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full transform transition-all duration-500 ${
                  point.isStable 
                    ? 'bg-green-500 shadow-lg shadow-green-200'
                    : 'bg-red-500 shadow-lg shadow-red-200'
                }`}
                style={{
                  left: point.x,
                  top: point.y,
                }}/>
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {point.prediction.toFixed(2)}
                </div>
                <ArrowRight className={`w-4 h-4 mt-1 ${point.isStable ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Wind className="w-6 h-6 text-blue-500" />
            <div className="flex-grow">
              <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                Perturbation Level
                <Info className="w-4 h-4 text-gray-400 cursor-help"
                      onMouseEnter={() => setActiveTooltip("perturbation")}
                      onMouseLeave={() => setActiveTooltip("")}/>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={perturbation}
                onChange={(e) => handlePerturbationChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
            </div>
            <Zap className={`w-6 h-6 ${perturbation > 0.5 ? 'text-red-500' : 'text-green-500'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelStability;