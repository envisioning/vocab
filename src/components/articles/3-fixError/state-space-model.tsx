"use client"
import { useState, useEffect } from "react";
import { Plant, Sun, Droplets, Flask, Eye, EyeOff, RefreshCw } from "lucide-react";

interface ComponentProps {}

type PlantState = {
  soilMoisture: number;
  rootHealth: number;
  nutrientLevel: number;
};

type Observable = {
  height: number;
  leafColor: string;
  flowerCount: number;
};

type Prediction = {
  predictedMoisture: number;
  predictedRootHealth: number;
  predictedNutrients: number;
};

const StateSpaceModel: React.FC<ComponentProps> = () => {
  const [hiddenState, setHiddenState] = useState<PlantState>({
    soilMoisture: 50,
    rootHealth: 50,
    nutrientLevel: 50,
  });

  const [observable, setObservable] = useState<Observable>({
    height: 50,
    leafColor: "#22C55E",
    flowerCount: 3,
  });

  const [prediction, setPrediction] = useState<Prediction>({
    predictedMoisture: 50,
    predictedRootHealth: 50,
    predictedNutrients: 50,
  });

  const [showHidden, setShowHidden] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const updateObservable = () => {
      setObservable({
        height: (hiddenState.rootHealth + hiddenState.nutrientLevel) / 2,
        leafColor: hiddenState.soilMoisture > 70 ? "#22C55E" : "#6B7280",
        flowerCount: Math.floor(hiddenState.nutrientLevel / 20),
      });
    };

    updateObservable();
    return () => {};
  }, [hiddenState]);

  const handleWater = () => {
    setHiddenState(prev => ({
      ...prev,
      soilMoisture: Math.min(100, prev.soilMoisture + 20),
    }));
  };

  const handleSunlight = () => {
    setHiddenState(prev => ({
      ...prev,
      soilMoisture: Math.max(0, prev.soilMoisture - 10),
      rootHealth: Math.min(100, prev.rootHealth + 10),
    }));
  };

  const handleNutrients = () => {
    setHiddenState(prev => ({
      ...prev,
      nutrientLevel: Math.min(100, prev.nutrientLevel + 20),
      rootHealth: Math.min(100, prev.rootHealth + 5),
    }));
  };

  const handlePredictionChange = (type: keyof Prediction, value: number) => {
    setPrediction(prev => ({ ...prev, [type]: value }));
  };

  const checkPrediction = () => {
    const accuracy = (100 - Math.abs(prediction.predictedMoisture - hiddenState.soilMoisture) +
      (100 - Math.abs(prediction.predictedRootHealth - hiddenState.rootHealth)) +
      (100 - Math.abs(prediction.predictedNutrients - hiddenState.nutrientLevel))) / 3;
    setScore(Math.round(accuracy));
    setShowHidden(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6" role="main">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mystery Greenhouse</h1>
        <button
          onClick={() => window.location.reload()}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Reset simulation"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleWater}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label="Add water"
        >
          <Droplets /> Water
        </button>
        <button
          onClick={handleSunlight}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label="Add sunlight"
        >
          <Sun /> Sunlight
        </button>
        <button
          onClick={handleNutrients}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label="Add nutrients"
        >
          <Flask /> Nutrients
        </button>
      </div>

      <div className="flex justify-center">
        <Plant
          className="w-32 h-32"
          style={{ color: observable.leafColor }}
          strokeWidth={1.5}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="w-32">Soil Moisture:</label>
          <input
            type="range"
            value={prediction.predictedMoisture}
            onChange={(e) => handlePredictionChange('predictedMoisture', Number(e.target.value))}
            className="flex-1"
            min="0"
            max="100"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-32">Root Health:</label>
          <input
            type="range"
            value={prediction.predictedRootHealth}
            onChange={(e) => handlePredictionChange('predictedRootHealth', Number(e.target.value))}
            className="flex-1"
            min="0"
            max="100"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-32">Nutrients:</label>
          <input
            type="range"
            value={prediction.predictedNutrients}
            onChange={(e) => handlePredictionChange('predictedNutrients', Number(e.target.value))}
            className="flex-1"
            min="0"
            max="100"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={checkPrediction}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          {showHidden ? <EyeOff /> : <Eye />}
          {showHidden ? "Hide States" : "Check Prediction"}
        </button>
        {showHidden && <div className="text-xl">Score: {score}%</div>}
      </div>
    </div>
  );
};

export default StateSpaceModel;