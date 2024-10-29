"use client"
import { useState, useEffect } from "react";
import { Umbrella, Users, Book, Moon, ArrowUp, Trophy, Brain, RefreshCw } from "lucide-react";

interface Agent {
  id: number;
  height: number;
  hasUmbrella: boolean;
  satisfaction: number;
}

interface MolochSimulatorProps {
  initialAgents?: number;
}

const INITIAL_HEIGHT = 50;
const UPDATE_INTERVAL = 1000;

/**
 * MolochSimulator: Educational component demonstrating competitive dynamics
 * through the "Beach Umbrella Race" metaphor.
 */
const MolochSimulator = ({ initialAgents = 5 }: MolochSimulatorProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [averageSatisfaction, setAverageSatisfaction] = useState(100);

  useEffect(() => {
    const initialState = Array.from({ length: initialAgents }, (_, i) => ({
      id: i,
      height: INITIAL_HEIGHT,
      hasUmbrella: false,
      satisfaction: 100,
    }));
    setAgents(initialState);
  }, [initialAgents]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setAgents((currentAgents) => {
          const updatedAgents = currentAgents.map((agent) => {
            const othersStanding = currentAgents.filter(
              (a) => a.id !== agent.id && a.height > INITIAL_HEIGHT
            ).length;

            if (othersStanding > 0 && !agent.hasUmbrella) {
              return {
                ...agent,
                height: agent.height + 10,
                hasUmbrella: true,
                satisfaction: Math.max(0, agent.satisfaction - 15),
              };
            }
            return agent;
          });

          const newAvgSatisfaction =
            updatedAgents.reduce((sum, a) => sum + a.satisfaction, 0) /
            updatedAgents.length;
          setAverageSatisfaction(newAvgSatisfaction);
          setRound((r) => r + 1);

          return updatedAgents;
        });
      }, UPDATE_INTERVAL);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setRound(0);
    setAverageSatisfaction(100);
    setAgents(
      Array.from({ length: initialAgents }, (_, i) => ({
        id: i,
        height: INITIAL_HEIGHT,
        hasUmbrella: false,
        satisfaction: 100,
      }))
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg max-w-2xl mx-auto" role="main">
      <h2 className="text-xl font-bold mb-4">The Beach Umbrella Race</h2>
      
      <div className="flex justify-between mb-6">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label={isRunning ? "Pause simulation" : "Start simulation"}
        >
          {isRunning ? "Pause" : "Start"} Simulation
        </button>
        
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
          aria-label="Reset simulation"
        >
          <RefreshCw className="inline-block mr-2" size={16} />
          Reset
        </button>
      </div>

      <div className="relative h-80 border-b-2 border-gray-300 mb-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="absolute bottom-0 transition-all duration-300"
            style={{ left: `${(agent.id * 100) / initialAgents}%` }}
          >
            {agent.hasUmbrella && (
              <Umbrella
                className="text-blue-500 mb-1"
                size={24}
                style={{ transform: `translateY(-${agent.height}px)` }}
              />
            )}
            <Users
              className="text-gray-700"
              size={24}
              style={{ transform: `translateY(-${agent.height}px)` }}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-gray-100 rounded">
          <p className="font-bold">Round</p>
          <p>{round}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded">
          <p className="font-bold">Standing People</p>
          <p>{agents.filter((a) => a.height > INITIAL_HEIGHT).length}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded">
          <p className="font-bold">Satisfaction</p>
          <p>{averageSatisfaction.toFixed(0)}%</p>
        </div>
      </div>

      <p className="mt-4 text-gray-600 text-sm">
        Watch how individual rational decisions lead to collective dissatisfaction.
        Everyone stands, but nobody sees better than before.
      </p>
    </div>
  );
};

export default MolochSimulator;