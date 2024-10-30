"use client"
import { useState, useEffect } from "react";
import { Bot, Eye, Ear, Hand, Brain, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";

interface SensorData {
  visual: number;
  audio: number;
  touch: number;
}

interface PetState {
  isLearning: boolean;
  currentTask: string;
  sensorData: SensorData;
  confidence: number;
}

interface ComponentProps {}

const TASKS = [
  "Fetch Ball",
  "Follow Voice",
  "Navigate Room",
];

const INITIAL_SENSOR_DATA: SensorData = {
  visual: 0,
  audio: 0,
  touch: 0,
};

const VirtualPetTrainer: React.FC<ComponentProps> = () => {
  const [petState, setPetState] = useState<PetState>({
    isLearning: false,
    currentTask: TASKS[0],
    sensorData: INITIAL_SENSOR_DATA,
    confidence: 0,
  });

  const [activeDemo, setActiveDemo] = useState<boolean>(true);

  useEffect(() => {
    if (activeDemo) {
      const demoInterval = setInterval(() => {
        setPetState(prev => ({
          ...prev,
          sensorData: {
            visual: Math.min(prev.sensorData.visual + 20, 100),
            audio: Math.min(prev.sensorData.audio + 15, 100),
            touch: Math.min(prev.sensorData.touch + 10, 100),
          },
          confidence: Math.min(prev.confidence + 5, 100),
        }));
      }, 1000);

      return () => clearInterval(demoInterval);
    }
  }, [activeDemo]);

  const handleTaskChange = (task: string) => {
    setPetState({
      isLearning: true,
      currentTask: task,
      sensorData: INITIAL_SENSOR_DATA,
      confidence: 0,
    });
  };

  const resetDemo = () => {
    setPetState({
      isLearning: false,
      currentTask: TASKS[0],
      sensorData: INITIAL_SENSOR_DATA,
      confidence: 0,
    });
    setActiveDemo(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Virtual Pet Trainer</h1>
        <button
          onClick={resetDemo}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
          aria-label="Reset demonstration"
        >
          <RefreshCw className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            Pet's Perspective
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <div className="flex-1 bg-gray-200 h-4 rounded-full">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${petState.sensorData.visual}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Ear className="w-5 h-5 text-blue-500" />
              <div className="flex-1 bg-gray-200 h-4 rounded-full">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${petState.sensorData.audio}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hand className="w-5 h-5 text-blue-500" />
              <div className="flex-1 bg-gray-200 h-4 rounded-full">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${petState.sensorData.touch}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            Learning Progress
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Task:</span>
              <select
                value={petState.currentTask}
                onChange={(e) => handleTaskChange(e.target.value)}
                className="border rounded p-1"
              >
                {TASKS.map(task => (
                  <option key={task} value={task}>{task}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <div className="flex-1 bg-gray-200 h-4 rounded-full">
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${petState.confidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualPetTrainer;