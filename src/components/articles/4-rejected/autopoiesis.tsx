"use client"
import { useState, useEffect } from "react";
import { Home, Sun, Droplets, Wind, Plus, Minus, RefreshCw, AlertCircle } from "lucide-react";

interface SystemState {
  temperature: number;
  moisture: number;
  energy: number;
  reproduction: number;
}

interface AutopoiesisProps {}

const INITIAL_STATE: SystemState = {
  temperature: 50,
  moisture: 50,
  energy: 50,
  reproduction: 0,
};

export default function AutopoiesisSimulation({}: AutopoiesisProps) {
  const [systemState, setSystemState] = useState<SystemState>(INITIAL_STATE);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSystemState(prev => {
        const newState = { ...prev };
        
        // Self-maintenance logic
        if (prev.temperature > 60) newState.temperature -= 2;
        if (prev.temperature < 40) newState.temperature += 2;
        if (prev.moisture > 70) newState.moisture -= 3;
        if (prev.moisture < 30) newState.moisture += 3;
        
        // Energy consumption
        newState.energy = Math.max(0, prev.energy - 1);
        
        // Reproduction when conditions are optimal
        if (prev.temperature >= 45 && prev.temperature <= 55 &&
            prev.moisture >= 45 && prev.moisture <= 55 &&
            prev.energy > 40) {
          newState.reproduction = Math.min(100, prev.reproduction + 5);
        }

        return newState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleEnvironmentalChange = (
    type: keyof SystemState,
    amount: number
  ) => {
    setSystemState(prev => ({
      ...prev,
      [type]: Math.max(0, Math.min(100, prev[type] + amount))
    }));
  };

  const renderStatusBar = (value: number, label: string) => (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div
        className="h-full rounded-full bg-blue-500 transition-all duration-300"
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Digital Ecosystem</h2>
        <p className="text-gray-600">Observe how the system maintains itself</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sun className="text-yellow-500" />
              <span>Temperature</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEnvironmentalChange("temperature", -10)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Decrease temperature"
              >
                <Minus size={20} />
              </button>
              <button
                onClick={() => handleEnvironmentalChange("temperature", 10)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Increase temperature"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          {renderStatusBar(systemState.temperature, "Temperature level")}
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplets className="text-blue-500" />
              <span>Moisture</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEnvironmentalChange("moisture", -10)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Decrease moisture"
              >
                <Minus size={20} />
              </button>
              <button
                onClick={() => handleEnvironmentalChange("moisture", 10)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Increase moisture"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          {renderStatusBar(systemState.moisture, "Moisture level")}
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wind className="text-green-500" />
              <span>Energy</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEnvironmentalChange("energy", 20)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Add energy"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          {renderStatusBar(systemState.energy, "Energy level")}
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="text-purple-500" />
            <span>Reproduction</span>
          </div>
          {renderStatusBar(systemState.reproduction, "Reproduction progress")}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          {isActive ? "Pause" : "Resume"}
        </button>
        <button
          onClick={() => setSystemState(INITIAL_STATE)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}