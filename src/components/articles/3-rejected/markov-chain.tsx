"use client"
import { useState, useEffect } from "react";
import { MapPin, ArrowRight, Play, Pause, RotateCcw } from "lucide-react";

interface Location {
  name: string;
  x: number;
  y: number;
}

interface Transition {
  from: string;
  to: string;
  probability: number;
}

const LOCATIONS: Location[] = [
  { name: "Home", x: 50, y: 50 },
  { name: "School", x: 200, y: 100 },
  { name: "Park", x: 150, y: 200 },
  { name: "Mall", x: 300, y: 150 },
];

const TRANSITIONS: Transition[] = [
  { from: "Home", to: "School", probability: 0.6 },
  { from: "Home", to: "Park", probability: 0.3 },
  { from: "Home", to: "Mall", probability: 0.1 },
  { from: "School", to: "Home", probability: 0.7 },
  { from: "School", to: "Mall", probability: 0.3 },
  { from: "Park", to: "Home", probability: 0.5 },
  { from: "Park", to: "Mall", probability: 0.5 },
  { from: "Mall", to: "Home", probability: 0.4 },
  { from: "Mall", to: "School", probability: 0.3 },
  { from: "Mall", to: "Park", probability: 0.3 },
];

/**
 * MarkovChainCityExplorer - An interactive component to teach Markov Chains
 * through a city exploration metaphor.
 */
const MarkovChainCityExplorer: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<string>("Home");
  const [path, setPath] = useState<string[]>(["Home"]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isSimulating) {
      intervalId = setInterval(() => {
        moveToNextLocation();
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimulating, currentLocation]);

  const moveToNextLocation = () => {
    const possibleTransitions = TRANSITIONS.filter(
      (t) => t.from === currentLocation
    );
    const randomValue = Math.random();
    let cumulativeProbability = 0;

    for (const transition of possibleTransitions) {
      cumulativeProbability += transition.probability;
      if (randomValue <= cumulativeProbability) {
        setCurrentLocation(transition.to);
        setPath((prevPath) => [...prevPath, transition.to]);
        break;
      }
    }
  };

  const handleLocationClick = (location: string) => {
    if (!isSimulating) {
      setCurrentLocation(location);
      setPath((prevPath) => [...prevPath, location]);
    }
  };

  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentLocation("Home");
    setPath(["Home"]);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Markov Chain City Explorer</h2>
      <div className="relative w-full h-80 bg-gray-200 rounded-md mb-4">
        {LOCATIONS.map((location) => (
          <button
            key={location.name}
            className={`absolute p-2 rounded-full ${
              currentLocation === location.name
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            style={{ left: `${location.x}px`, top: `${location.y}px` }}
            onClick={() => handleLocationClick(location.name)}
            disabled={isSimulating}
            aria-label={`Move to ${location.name}`}
          >
            <MapPin size={24} />
          </button>
        ))}
        {TRANSITIONS.map((transition, index) => {
          const from = LOCATIONS.find((l) => l.name === transition.from);
          const to = LOCATIONS.find((l) => l.name === transition.to);
          if (!from || !to) return null;
          return (
            <svg
              key={index}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            >
              <line
                x1={from.x + 12}
                y1={from.y + 12}
                x2={to.x + 12}
                y2={to.y + 12}
                stroke="gray"
                strokeWidth="2"
              />
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2}
                fill="black"
                fontSize="12"
                textAnchor="middle"
              >
                {(transition.probability * 100).toFixed(0)}%
              </text>
            </svg>
          );
        })}
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
          onClick={toggleSimulation}
          aria-label={isSimulating ? "Pause simulation" : "Start simulation"}
        >
          {isSimulating ? <Pause size={20} /> : <Play size={20} />}
          <span className="ml-2">
            {isSimulating ? "Pause" : "Start"} Simulation
          </span>
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center"
          onClick={resetSimulation}
          aria-label="Reset simulation"
        >
          <RotateCcw size={20} />
          <span className="ml-2">Reset</span>
        </button>
      </div>
      <div className="bg-white p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Path Taken:</h3>
        <div className="flex flex-wrap items-center">
          {path.map((location, index) => (
            <span key={index} className="flex items-center">
              {index > 0 && <ArrowRight size={16} className="mx-1" />}
              {location}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarkovChainCityExplorer;