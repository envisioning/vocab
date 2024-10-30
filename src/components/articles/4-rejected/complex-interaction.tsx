"use client"
import { useState, useEffect } from "react";
import { Fish, Sprout, Thermometer, Droplet, AlertCircle } from "lucide-react";

interface ComponentProps {}

type Ecosystem = {
  fishCount: number;
  plantCount: number;
  temperature: number;
  waterQuality: number;
  oxygenLevel: number;
}

type Prediction = {
  made: boolean;
  correct: boolean;
  action: string;
}

const EcosystemSimulator: React.FC<ComponentProps> = () => {
  const [ecosystem, setEcosystem] = useState<Ecosystem>({
    fishCount: 10,
    plantCount: 15,
    temperature: 25,
    waterQuality: 90,
    oxygenLevel: 85
  });

  const [prediction, setPrediction] = useState<Prediction>({
    made: false,
    correct: false,
    action: ""
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    if (isSimulating) {
      const simulation = setInterval(() => {
        setEcosystem(prev => {
          const tempEffect = prev.temperature > 30 ? -1 : (prev.temperature < 20 ? -1 : 0);
          const oxygenEffect = prev.plantCount * 0.5 - prev.fishCount * 0.3;
          
          return {
            fishCount: Math.max(0, prev.fishCount + tempEffect + (prev.oxygenLevel < 50 ? -2 : 0)),
            plantCount: Math.max(0, prev.plantCount + (prev.waterQuality < 60 ? -1 : 1)),
            temperature: prev.temperature,
            waterQuality: Math.max(0, Math.min(100, prev.waterQuality + (prev.fishCount > 15 ? -1 : 1))),
            oxygenLevel: Math.max(0, Math.min(100, prev.oxygenLevel + oxygenEffect))
          };
        });
      }, 1000);

      return () => clearInterval(simulation);
    }
  }, [isSimulating]);

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEcosystem(prev => ({
      ...prev,
      temperature: Number(e.target.value)
    }));
  };

  const makePrediction = (action: string) => {
    setPrediction({
      made: true,
      correct: false,
      action
    });
    setIsSimulating(true);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Ecosystem Simulator</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Fish className="text-blue-500" />
          <span>Fish: {ecosystem.fishCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sprout className="text-green-500" />
          <span>Plants: {ecosystem.plantCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="text-red-500" />
          <span>Temperature: {ecosystem.temperature}°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplet className="text-blue-500" />
          <span>Water Quality: {ecosystem.waterQuality}%</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2">Adjust Temperature (15-35°C)</label>
        <input
          type="range"
          min="15"
          max="35"
          value={ecosystem.temperature}
          onChange={handleTemperatureChange}
          className="w-full"
          aria-label="Temperature control"
        />
      </div>

      {!prediction.made && (
        <div className="space-y-4">
          <p className="font-semibold">What will happen if we increase the temperature?</p>
          <div className="flex gap-4">
            <button
              onClick={() => makePrediction("increase")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
              aria-label="Predict ecosystem will improve"
            >
              Ecosystem Improves
            </button>
            <button
              onClick={() => makePrediction("decrease")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
              aria-label="Predict ecosystem will decline"
            >
              Ecosystem Declines
            </button>
          </div>
        </div>
      )}

      {ecosystem.fishCount < 5 && (
        <div className="mt-4 flex items-center gap-2 text-red-500">
          <AlertCircle />
          <span>Warning: Fish population critically low!</span>
        </div>
      )}
    </div>
  );
};

export default EcosystemSimulator;