"use client"
import { useState, useEffect } from "react";
import { Building, Factory, House, Zap } from "lucide-react";

interface ComponentProps {}

type BuildingType = 'input' | 'hidden' | 'output';

interface CityBuilding {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
}

const BUILDING_ICONS = {
  input: House,
  hidden: Building,
  output: Factory,
};

const CHALLENGES = [
  { name: "Image Recognition", description: "Build a city to recognize handwritten digits" },
  { name: "Natural Language Processing", description: "Create a city to understand and translate languages" },
  { name: "Anomaly Detection", description: "Design a city to detect unusual patterns in data" },
];

/**
 * DNNCityBuilder: An interactive component to teach Deep Neural Networks
 * through a city-building metaphor.
 */
const DNNCityBuilder: React.FC<ComponentProps> = () => {
  const [buildings, setBuildings] = useState<CityBuilding[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [dataFlow, setDataFlow] = useState<number[]>([]);

  useEffect(() => {
    const flowInterval = setInterval(() => {
      setDataFlow((prev) => {
        if (prev.length >= buildings.length) {
          return [];
        }
        return [...prev, prev.length];
      });
    }, 1000);

    return () => clearInterval(flowInterval);
  }, [buildings]);

  const addBuilding = (type: BuildingType) => {
    const newBuilding: CityBuilding = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    };
    setBuildings((prev) => [...prev, newBuilding]);
  };

  const resetCity = () => {
    setBuildings([]);
    setDataFlow([]);
  };

  const nextChallenge = () => {
    setCurrentChallenge((prev) => (prev + 1) % CHALLENGES.length);
    resetCity();
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">DNN City Builder</h2>
      <p className="mb-4">{CHALLENGES[currentChallenge].description}</p>
      
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => addBuilding('input')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Add Input Building"
        >
          <House className="inline-block mr-2" /> Input
        </button>
        <button
          onClick={() => addBuilding('hidden')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Add Hidden Building"
        >
          <Building className="inline-block mr-2" /> Hidden
        </button>
        <button
          onClick={() => addBuilding('output')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Add Output Building"
        >
          <Factory className="inline-block mr-2" /> Output
        </button>
      </div>

      <div className="relative bg-gray-200 w-full h-96 rounded-lg overflow-hidden" role="region" aria-label="City Building Area">
        {buildings.map((building, index) => {
          const Icon = BUILDING_ICONS[building.type];
          return (
            <div
              key={building.id}
              className="absolute transition-all duration-300"
              style={{ left: `${building.x}%`, top: `${building.y}%` }}
            >
              <Icon
                className={`w-8 h-8 ${dataFlow.includes(index) ? 'text-green-500' : 'text-gray-600'}`}
                aria-label={`${building.type} building`}
              />
            </div>
          );
        })}
        {buildings.length > 1 && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {buildings.slice(0, -1).map((start, i) => (
              <line
                key={`${start.id}-${buildings[i + 1].id}`}
                x1={`${start.x}%`}
                y1={`${start.y}%`}
                x2={`${buildings[i + 1].x}%`}
                y2={`${buildings[i + 1].y}%`}
                stroke={dataFlow.includes(i) ? "#22C55E" : "#6B7280"}
                strokeWidth="2"
              />
            ))}
          </svg>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={resetCity}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          aria-label="Reset City"
        >
          Reset City
        </button>
        <button
          onClick={nextChallenge}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          aria-label="Next Challenge"
        >
          Next Challenge
        </button>
      </div>
    </div>
  );
};

export default DNNCityBuilder;