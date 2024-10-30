"use client"
import { useState, useEffect } from "react";
import { Fish, Settings, RefreshCw } from "lucide-react";

interface ComponentProps {}

type Agent = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

type Scenario = {
  name: string;
  description: string;
  agentCount: number;
  cohesion: number;
  alignment: number;
  separation: number;
};

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const SCENARIOS: Scenario[] = [
  {
    name: "School of Fish",
    description: "Observe how fish swim together to avoid predators.",
    agentCount: 50,
    cohesion: 0.02,
    alignment: 0.05,
    separation: 0.5,
  },
  {
    name: "Ant Colony",
    description: "Watch ants collaborate to find the optimal path.",
    agentCount: 100,
    cohesion: 0.01,
    alignment: 0.03,
    separation: 0.2,
  },
];

/**
 * SwarmSim: Interactive Swarm Intelligence Simulator
 * This component visualizes swarm behavior and allows users to manipulate parameters.
 */
const SwarmSim: React.FC<ComponentProps> = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const canvas = document.getElementById("swarmCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    const initAgents = () => {
      return Array.from({ length: scenario.agentCount }, () => ({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
      }));
    };

    setAgents(initAgents());

    const animate = () => {
      if (!isRunning) return;

      ctx?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const updatedAgents = agents.map((agent) => {
        let avgDx = 0, avgDy = 0, sepX = 0, sepY = 0, count = 0;

        agents.forEach((other) => {
          const distance = Math.hypot(other.x - agent.x, other.y - agent.y);
          if (distance > 0 && distance < 50) {
            avgDx += other.dx;
            avgDy += other.dy;
            sepX += agent.x - other.x;
            sepY += agent.y - other.y;
            count++;
          }
        });

        if (count > 0) {
          avgDx = (avgDx / count - agent.dx) * scenario.alignment;
          avgDy = (avgDy / count - agent.dy) * scenario.alignment;
          sepX = sepX * scenario.separation;
          sepY = sepY * scenario.separation;
          agent.dx += avgDx + sepX + (scenario.cohesion * (CANVAS_WIDTH / 2 - agent.x));
          agent.dy += avgDy + sepY + (scenario.cohesion * (CANVAS_HEIGHT / 2 - agent.y));
        }

        agent.x += agent.dx;
        agent.y += agent.dy;

        if (agent.x < 0) agent.x = CANVAS_WIDTH;
        if (agent.x > CANVAS_WIDTH) agent.x = 0;
        if (agent.y < 0) agent.y = CANVAS_HEIGHT;
        if (agent.y > CANVAS_HEIGHT) agent.y = 0;

        ctx?.beginPath();
        ctx?.arc(agent.x, agent.y, 3, 0, Math.PI * 2);
        ctx?.fill();

        return agent;
      });

      setAgents(updatedAgents);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      setIsRunning(false);
    };
  }, [scenario, isRunning]);

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newScenario = SCENARIOS.find((s) => s.name === e.target.value);
    if (newScenario) {
      setScenario(newScenario);
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeout(() => {
      setAgents([]);
      setIsRunning(true);
    }, 100);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">SwarmSim: Swarm Intelligence Simulator</h2>
      <div className="mb-4">
        <label htmlFor="scenario" className="mr-2">
          Choose a scenario:
        </label>
        <select
          id="scenario"
          value={scenario.name}
          onChange={handleScenarioChange}
          className="p-2 border rounded"
        >
          {SCENARIOS.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-4 text-center max-w-md">{scenario.description}</p>
      <canvas
        id="swarmCanvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-gray-300 mb-4"
      ></canvas>
      <div className="flex space-x-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          <Settings className="mr-2" size={20} />
          {isRunning ? "Pause" : "Resume"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          <RefreshCw className="mr-2" size={20} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default SwarmSim;