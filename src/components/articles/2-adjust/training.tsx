"use client";
import { useState, useEffect } from "react";
import { 
  Brain, 
  Target, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Info 
} from "lucide-react";

interface TrainingProps {}

type DataPoint = {
  x: number;
  y: number;
  label: "positive" | "negative";
};

const INITIAL_POINTS_COUNT = 30;
const MAX_EPOCHS = 100;
const TRAINING_INTERVAL = 200;
const MAX_ACCURACY = 98;

// Create linearly separable data points
const generateSeparableData = (): DataPoint[] => {
  const points: DataPoint[] = [];
  
  // Generate main cluster of positive points (upper left)
  for (let i = 0; i < (INITIAL_POINTS_COUNT/2 - 1); i++) {
    points.push({
      x: Math.random() * 40 + 10, // 10-50%
      y: Math.random() * 40 + 10, // 10-50%
      label: "positive"
    });
  }
  
  // Generate main cluster of negative points (lower right)
  for (let i = 0; i < (INITIAL_POINTS_COUNT/2 - 1); i++) {
    points.push({
      x: Math.random() * 40 + 50, // 50-90%
      y: Math.random() * 40 + 50, // 50-90%
      label: "negative"
    });
  }
  
  // Add required outliers
  
  // Guaranteed positive point in negative area (right side)
  points.push({
    x: Math.random() * 30 + 60, // 60-90%
    y: Math.random() * 30 + 10, // 10-40%
    label: "positive"
  });
  
  // Guaranteed negative point in positive area (left side)
  points.push({
    x: Math.random() * 30 + 10, // 10-40%
    y: Math.random() * 30 + 60, // 60-90%
    label: "negative"
  });
  
  return points;
};

const TrainingVisualization: React.FC<TrainingProps> = () => {
  const [epoch, setEpoch] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [decision, setDecision] = useState<number>(50);
  const [decisionAngle, setDecisionAngle] = useState<number>(45);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    darkModeQuery.addEventListener('change', handler);
    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const initialPoints = generateSeparableData();
    setDataPoints(initialPoints);
    return () => setIsTraining(false);
  }, []);

  useEffect(() => {
    if (!isTraining) return;

    const intervalId = setInterval(() => {
      setEpoch(prev => {
        const newEpoch = prev < MAX_EPOCHS ? prev + 1 : prev;
        
        if (newEpoch < MAX_EPOCHS) {
          // Slower progress calculation with power function
          const progress = Math.pow(newEpoch / MAX_EPOCHS, 0.5);
          // Custom easing that moves slower at the beginning and maintains movement longer
          const easeProgress = Math.pow(progress, 3);
          
          setDecisionAngle(startAngle => {
            const target = 135; // Target angle for diagonal separation
            // Add small oscillation for fine-tuning appearance
            const oscillation = Math.sin(newEpoch * 0.2) * (1 - progress) * 2;
            return startAngle + (target - startAngle) * easeProgress + oscillation;
          });
          
          setDecision(startPos => {
            const target = 45; // Target position for optimal separation
            // Add small oscillation for fine-tuning appearance
            const oscillation = Math.cos(newEpoch * 0.2) * (1 - progress) * 1;
            return startPos + (target - startPos) * easeProgress + oscillation;
          });
        }
        return newEpoch;
      });
      
      // Slower accuracy improvement
      setAccuracy(prev => {
        if (prev < MAX_ACCURACY) {
          const remainingAccuracy = MAX_ACCURACY - prev;
          // Even slower increment
          const increment = remainingAccuracy * 0.03;
          return Math.min(prev + increment, MAX_ACCURACY);
        }
        return prev;
      });
    }, TRAINING_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [isTraining]);

  const handleStartTraining = () => {
    setIsTraining(true);
    setEpoch(0);
    setAccuracy(0);
    setDecision(70);  // Start higher
    setDecisionAngle(45);  // Start at 45 degrees
  };

  const handleReset = () => {
    setIsTraining(false);
    setEpoch(0);
    setAccuracy(0);
    setDecision(70);
    setDecisionAngle(20);
    setDataPoints(generateSeparableData());
  };

  return (
    <div className={`w-full sm:aspect-[1.618/1] mx-auto p-3 sm:p-6 flex flex-col ${
      isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    } rounded-xl shadow-xl transition-colors duration-500`}>
      <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        <h2 className={`text-xl sm:text-3xl md:text-4xl font-bold ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        } flex items-center justify-center gap-2`}>
          <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
          Training Simulation
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="ml-2 hover:scale-110 transition-transform duration-300"
          >
            <Info className="w-5 h-5 text-gray-400 hover:text-gray-300" />
          </button>
        </h2>
        <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Observe how the AI learns to separate two classes of data points by adjusting its decision boundary
        </p>
        {showHelp && (
          <div className={`text-xs sm:text-sm p-2 rounded-lg ${
            isDark ? 'bg-slate-800 text-gray-300' : 'bg-white text-gray-600'
          } shadow-lg transform transition-all duration-300`}>
            <p>• Blue circles represent positive samples</p>
            <p>• Red triangles represent negative samples</p>
            <p>• The rotating line shows the model's decision boundary</p>
            <p>• Watch as the accuracy improves with each training epoch!</p>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className={`relative ${
          isDark ? 'bg-slate-700/50' : 'bg-white/50'
        } rounded-xl p-4 shadow-inner overflow-hidden min-h-[300px] sm:min-h-0`}>
          {dataPoints.map((point, idx) => (
            <div
              key={idx}
              className={`absolute transform transition-all duration-300 ${
                point.label === "positive" 
                  ? (isDark ? 'text-blue-400' : 'text-blue-500') 
                  : (isDark ? 'text-red-400' : 'text-red-500')
              }`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: "translate(-50%, -50%)"
              }}
            >
              {point.label === "positive" 
                ? <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                : <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              }
            </div>
          ))}
          <div
            className={`absolute h-0.5 ${
              isDark ? 'bg-purple-400/50' : 'bg-purple-500/50'
            } transform transition-all duration-300`}
            style={{
              top: `${decision}%`,
              left: '-50%',  // Extend beyond left edge
              right: '-50%', // Extend beyond right edge
              width: '200%', // Make line 2x container width
              transform: `rotate(${decisionAngle}deg)`,
              transformOrigin: 'center'
            }}
          />
        </div>

        <div className={`flex flex-col gap-4 ${
          isDark ? 'bg-slate-700/50' : 'bg-white/50'
        } rounded-xl p-4`}>
          <div className="space-y-4">
            <div className={`flex items-center justify-between ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            } text-sm sm:text-base`}>
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Training Epoch:
              </span>
              <span className="font-mono">{epoch}/{MAX_EPOCHS}</span>
            </div>
            <div className={`flex items-center justify-between ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            } text-sm sm:text-base`}>
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4" /> Model Accuracy:
              </span>
              <span className="font-mono">{accuracy.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  isDark ? 'bg-blue-500' : 'bg-blue-600'
                } transition-all duration-300`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className={`flex-1 flex items-center justify-center gap-2 ${
                isDark 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:bg-gray-600 text-white rounded-lg py-2 px-4 transition duration-300 text-sm sm:text-base`}
            >
              <Target className="w-4 h-4" />
              {isTraining ? "Training..." : "Start Training"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4 transition duration-300 text-sm sm:text-base"
            >
              <XCircle className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingVisualization;