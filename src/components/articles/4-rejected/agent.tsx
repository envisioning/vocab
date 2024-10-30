"use client"
import { useState, useEffect } from "react";
import { Home, Car, Gamepad, Camera, Mic, Thermometer, Play, Pause, RotateCcw } from "lucide-react";

interface ComponentProps {}

type Environment = "home" | "car" | "game";
type Sensor = "camera" | "microphone" | "thermometer";
type Action = "move" | "interact" | "adjust";
type Goal = "assist" | "transport" | "challenge";

interface Agent {
  sensors: Sensor[];
  actions: Action[];
  goals: Goal[];
}

interface SimulationState {
  environment: Environment;
  agent: Agent;
  isRunning: boolean;
  performance: number;
}

const ENVIRONMENTS: Environment[] = ["home", "car", "game"];
const SENSORS: Sensor[] = ["camera", "microphone", "thermometer"];
const ACTIONS: Action[] = ["move", "interact", "adjust"];
const GOALS: Goal[] = ["assist", "transport", "challenge"];

/**
 * AgentSimulator component allows students to configure and observe an AI agent in different environments.
 */
const AgentSimulator: React.FC<ComponentProps> = () => {
  const [simulation, setSimulation] = useState<SimulationState>({
    environment: "home",
    agent: { sensors: [], actions: [], goals: [] },
    isRunning: false,
    performance: 0,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simulation.isRunning) {
      interval = setInterval(() => {
        setSimulation((prev) => ({
          ...prev,
          performance: Math.min(100, prev.performance + 5),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulation.isRunning]);

  const handleEnvironmentChange = (env: Environment) => {
    setSimulation((prev) => ({ ...prev, environment: env, performance: 0 }));
  };

  const toggleSensor = (sensor: Sensor) => {
    setSimulation((prev) => ({
      ...prev,
      agent: {
        ...prev.agent,
        sensors: prev.agent.sensors.includes(sensor)
          ? prev.agent.sensors.filter((s) => s !== sensor)
          : [...prev.agent.sensors, sensor],
      },
      performance: 0,
    }));
  };

  const toggleAction = (action: Action) => {
    setSimulation((prev) => ({
      ...prev,
      agent: {
        ...prev.agent,
        actions: prev.agent.actions.includes(action)
          ? prev.agent.actions.filter((a) => a !== action)
          : [...prev.agent.actions, action],
      },
      performance: 0,
    }));
  };

  const toggleGoal = (goal: Goal) => {
    setSimulation((prev) => ({
      ...prev,
      agent: {
        ...prev.agent,
        goals: prev.agent.goals.includes(goal)
          ? prev.agent.goals.filter((g) => g !== goal)
          : [...prev.agent.goals, goal],
      },
      performance: 0,
    }));
  };

  const toggleSimulation = () => {
    setSimulation((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetSimulation = () => {
    setSimulation({
      environment: "home",
      agent: { sensors: [], actions: [], goals: [] },
      isRunning: false,
      performance: 0,
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Agent Simulator</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Environment</h3>
        <div className="flex space-x-2">
          {ENVIRONMENTS.map((env) => (
            <button
              key={env}
              onClick={() => handleEnvironmentChange(env)}
              className={`p-2 rounded ${
                simulation.environment === env
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              aria-pressed={simulation.environment === env}
            >
              {env === "home" && <Home className="inline-block mr-1" />}
              {env === "car" && <Car className="inline-block mr-1" />}
              {env === "game" && <Gamepad className="inline-block mr-1" />}
              {env}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Sensors</h3>
        <div className="flex space-x-2">
          {SENSORS.map((sensor) => (
            <button
              key={sensor}
              onClick={() => toggleSensor(sensor)}
              className={`p-2 rounded ${
                simulation.agent.sensors.includes(sensor)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              aria-pressed={simulation.agent.sensors.includes(sensor)}
            >
              {sensor === "camera" && <Camera className="inline-block mr-1" />}
              {sensor === "microphone" && <Mic className="inline-block mr-1" />}
              {sensor === "thermometer" && <Thermometer className="inline-block mr-1" />}
              {sensor}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Actions</h3>
        <div className="flex space-x-2">
          {ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => toggleAction(action)}
              className={`p-2 rounded ${
                simulation.agent.actions.includes(action)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              aria-pressed={simulation.agent.actions.includes(action)}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Goals</h3>
        <div className="flex space-x-2">
          {GOALS.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`p-2 rounded ${
                simulation.agent.goals.includes(goal)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              aria-pressed={simulation.agent.goals.includes(goal)}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Simulation</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSimulation}
            className="p-2 bg-green-500 text-white rounded"
            aria-label={simulation.isRunning ? "Pause simulation" : "Start simulation"}
          >
            {simulation.isRunning ? <Pause /> : <Play />}
          </button>
          <button
            onClick={resetSimulation}
            className="p-2 bg-gray-500 text-white rounded"
            aria-label="Reset simulation"
          >
            <RotateCcw />
          </button>
          <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${simulation.performance}%` }}
              role="progressbar"
              aria-valuenow={simulation.performance}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <span>{simulation.performance}%</span>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Configure your agent and observe its performance in different environments.
      </p>
    </div>
  );
};

export default AgentSimulator;