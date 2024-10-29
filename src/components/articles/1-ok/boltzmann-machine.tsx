"use client"
import { useState, useEffect } from "react";
import { Users, Thermometer, Activity, Network, Play, Pause, RefreshCw } from "lucide-react";

interface Node {
  id: number;
  state: boolean;
  x: number;
  y: number;
}

interface Connection {
  from: number;
  to: number;
  weight: number;
}

const GRID_SIZE = 4;
const INITIAL_TEMPERATURE = 1.0;

const BoltzmannMachine = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [temperature, setTemperature] = useState<number>(INITIAL_TEMPERATURE);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [energy, setEnergy] = useState<number>(0);

  useEffect(() => {
    initializeNetwork();
    return () => setIsRunning(false);
  }, []);

  const initializeNetwork = () => {
    const initialNodes: Node[] = [];
    const initialConnections: Connection[] = [];

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      initialNodes.push({
        id: i,
        state: Math.random() > 0.5,
        x: (i % GRID_SIZE) * 100 + 50,
        y: Math.floor(i / GRID_SIZE) * 100 + 50
      });
    }

    for (let i = 0; i < initialNodes.length; i++) {
      for (let j = i + 1; j < initialNodes.length; j++) {
        initialConnections.push({
          from: i,
          to: j,
          weight: (Math.random() * 2 - 1) * 0.5
        });
      }
    }

    setNodes(initialNodes);
    setConnections(initialConnections);
  };

  useEffect(() => {
    let animationFrame: number;
    
    const updateStates = () => {
      if (!isRunning) return;

      setNodes(prevNodes => {
        const newNodes = [...prevNodes];
        const randomNodeIndex = Math.floor(Math.random() * nodes.length);
        const currentEnergy = calculateEnergy(newNodes[randomNodeIndex], newNodes);
        
        newNodes[randomNodeIndex].state = !newNodes[randomNodeIndex].state;
        const newEnergy = calculateEnergy(newNodes[randomNodeIndex], newNodes);
        
        const deltaEnergy = newEnergy - currentEnergy;
        const probability = Math.exp(-deltaEnergy / temperature);

        if (Math.random() > probability) {
          newNodes[randomNodeIndex].state = !newNodes[randomNodeIndex].state;
        }

        setEnergy(calculateTotalEnergy(newNodes));
        return newNodes;
      });

      animationFrame = requestAnimationFrame(updateStates);
    };

    if (isRunning) {
      animationFrame = requestAnimationFrame(updateStates);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isRunning, temperature]);

  const calculateEnergy = (node: Node, allNodes: Node[]) => {
    let energy = 0;
    connections.forEach(conn => {
      if (conn.from === node.id || conn.to === node.id) {
        const otherNode = allNodes[conn.from === node.id ? conn.to : conn.from];
        energy += conn.weight * (node.state ? 1 : -1) * (otherNode.state ? 1 : -1);
      }
    });
    return -energy;
  };

  const calculateTotalEnergy = (currentNodes: Node[]) => {
    let total = 0;
    connections.forEach(conn => {
      total += conn.weight * 
        (currentNodes[conn.from].state ? 1 : -1) * 
        (currentNodes[conn.to].state ? 1 : -1);
    });
    return -total;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" role="application">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Social Energy Simulator</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded"
            aria-label={isRunning ? "Pause simulation" : "Start simulation"}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={initializeNetwork}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded"
            aria-label="Reset network"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative w-[400px] h-[400px] border rounded">
          <svg width="400" height="400">
            {connections.map((conn, i) => (
              <line
                key={`conn-${i}`}
                x1={nodes[conn.from]?.x}
                y1={nodes[conn.from]?.y}
                x2={nodes[conn.to]?.x}
                y2={nodes[conn.to]?.y}
                stroke={`rgba(59, 130, 246, ${Math.abs(conn.weight)})`}
                strokeWidth="1"
              />
            ))}
            {nodes.map((node, i) => (
              <circle
                key={`node-${i}`}
                cx={node.x}
                cy={node.y}
                r="20"
                fill={node.state ? "#22C55E" : "#6B7280"}
                className="transition-colors duration-300"
              />
            ))}
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="text-blue-500" />
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full"
              aria-label="Temperature control"
            />
            <span className="w-12 text-right">{temperature.toFixed(1)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="text-blue-500" />
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.abs(energy) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoltzmannMachine;