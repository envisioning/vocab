"use client"
import { useState, useEffect } from "react";
import { Building2, Car, Zap, Trees, CloudRain, Users, AlertTriangle } from "lucide-react";

interface CitySystem {
  name: string;
  icon: React.ReactNode;
  health: number;
}

interface Challenge {
  name: string;
  icon: React.ReactNode;
  impact: number;
}

/**
 * AutopoiesisCity Simulator
 * 
 * This component simulates an artefactual autopoietic city system,
 * demonstrating self-maintenance, reproduction, and adaptation.
 */
const AutopoiesisCity: React.FC = () => {
  const [systems, setSystems] = useState<CitySystem[]>([
    { name: "Housing", icon: <Building2 />, health: 100 },
    { name: "Transportation", icon: <Car />, health: 100 },
    { name: "Energy", icon: <Zap />, health: 100 },
    { name: "Environment", icon: <Trees />, health: 100 },
  ]);

  const [population, setPopulation] = useState(1000);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const challenges: Challenge[] = [
    { name: "Population Growth", icon: <Users />, impact: -10 },
    { name: "Natural Disaster", icon: <CloudRain />, impact: -30 },
    { name: "Resource Shortage", icon: <AlertTriangle />, impact: -20 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSystems(prevSystems =>
        prevSystems.map(system => ({
          ...system,
          health: Math.min(100, system.health + 5)
        }))
      );
      setPopulation(prevPopulation => prevPopulation + 10);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChallenge) {
      setSystems(prevSystems =>
        prevSystems.map(system => ({
          ...system,
          health: Math.max(0, system.health + selectedChallenge.impact)
        }))
      );
      setSelectedChallenge(null);
    }
  }, [selectedChallenge]);

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">AutopoiesisCity Simulator</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {systems.map((system, index) => (
          <div key={index} className="bg-white p-4 rounded-md shadow">
            <div className="flex items-center mb-2">
              {system.icon}
              <span className="ml-2 font-semibold">{system.name}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${system.health}%` }}
                role="progressbar"
                aria-valuenow={system.health}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Population: {population}</h2>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Introduce Challenges:</h2>
        <div className="flex space-x-4">
          {challenges.map((challenge, index) => (
            <button
              key={index}
              onClick={() => handleChallengeClick(challenge)}
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
              aria-label={`Introduce ${challenge.name} challenge`}
            >
              {challenge.icon}
              <span className="ml-2">{challenge.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Autopoietic Processes:</h2>
        <ul className="list-disc list-inside">
          <li>Self-maintenance: Systems automatically repair and optimize</li>
          <li>Reproduction: Population growth and system expansion</li>
          <li>Adaptation: Systems respond to challenges and evolve</li>
        </ul>
      </div>
    </div>
  );
};

export default AutopoiesisCity;