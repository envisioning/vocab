"use client"
import { useState, useEffect } from "react";
import { Building2, Trees, Factory, Car, Users, Coins, Wind, Play, Pause, RotateCcw } from "lucide-react";

interface CityMetrics {
  population: number;
  pollution: number;
  economy: number;
  traffic: number;
}

interface BuildingType {
  id: string;
  type: 'house' | 'park' | 'factory';
  impact: Partial<CityMetrics>;
}

const INITIAL_METRICS: CityMetrics = {
  population: 1000,
  pollution: 20,
  economy: 50,
  traffic: 30
};

const BUILDING_TYPES: Record<string, BuildingType['impact']> = {
  house: { population: 100, traffic: 5, economy: 2 },
  park: { pollution: -10, economy: 1 },
  factory: { pollution: 20, economy: 10, traffic: 10 }
};

export default function SimulationCity() {
  const [metrics, setMetrics] = useState<CityMetrics>(INITIAL_METRICS);
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedType, setSelectedType] = useState<'house' | 'park' | 'factory'>('house');

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        population: prev.population + buildings.reduce((acc, b) => acc + (b.impact.population || 0), 0),
        pollution: Math.max(0, prev.pollution + buildings.reduce((acc, b) => acc + (b.impact.pollution || 0), 0)),
        economy: prev.economy + buildings.reduce((acc, b) => acc + (b.impact.economy || 0), 0),
        traffic: Math.min(100, prev.traffic + buildings.reduce((acc, b) => acc + (b.impact.traffic || 0), 0))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, buildings]);

  const handleAddBuilding = () => {
    const newBuilding: BuildingType = {
      id: Math.random().toString(),
      type: selectedType,
      impact: BUILDING_TYPES[selectedType]
    };
    setBuildings(prev => [...prev, newBuilding]);
  };

  const handleReset = () => {
    setMetrics(INITIAL_METRICS);
    setBuildings([]);
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">City Simulation</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-blue-500" />
          <span>Population: {metrics.population}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="text-blue-500" />
          <span>Pollution: {metrics.pollution}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="text-blue-500" />
          <span>Economy: {metrics.economy}</span>
        </div>
        <div className="flex items-center gap-2">
          <Car className="text-blue-500" />
          <span>Traffic: {metrics.traffic}%</span>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedType('house')}
          className={`flex items-center gap-2 p-2 rounded ${
            selectedType === 'house' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <Building2 size={20} /> House
        </button>
        <button
          onClick={() => setSelectedType('park')}
          className={`flex items-center gap-2 p-2 rounded ${
            selectedType === 'park' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <Trees size={20} /> Park
        </button>
        <button
          onClick={() => setSelectedType('factory')}
          className={`flex items-center gap-2 p-2 rounded ${
            selectedType === 'factory' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <Factory size={20} /> Factory
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleAddBuilding}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Building
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Pause' : 'Start'} Simulation
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded"
        >
          <RotateCcw size={20} /> Reset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {buildings.map((building) => (
          <div
            key={building.id}
            className="p-4 bg-white rounded shadow flex items-center justify-center"
          >
            {building.type === 'house' && <Building2 className="text-blue-500" />}
            {building.type === 'park' && <Trees className="text-green-500" />}
            {building.type === 'factory' && <Factory className="text-gray-500" />}
          </div>
        ))}
      </div>
    </div>
  );
}