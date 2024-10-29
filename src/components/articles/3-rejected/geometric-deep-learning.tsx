"use client"
import { useState, useEffect } from "react";
import { Users, Train, Mountain, Plus, Minus, Play, Pause, RotateCcw, Network } from "lucide-react";

interface Node {
  id: number;
  x: number;
  y: number;
  type: 'person' | 'station' | 'peak';
  connections: number[];
}

interface SimulationState {
  activeNodes: number[];
  flowPaths: number[][];
}

const INITIAL_NODES: Node[] = [
  { id: 1, x: 20, y: 20, type: 'person', connections: [2, 3] },
  { id: 2, x: 50, y: 30, type: 'person', connections: [1, 4] },
  { id: 3, x: 30, y: 60, type: 'person', connections: [1] },
  { id: 4, x: 70, y: 40, type: 'person', connections: [2] },
];

/**
 * GeometricLearningExplorer - Interactive component teaching geometric deep learning
 * through social networks, transit systems, and terrain navigation.
 */
const GeometricLearningExplorer = () => {
  const [mode, setMode] = useState<'social' | 'transit' | 'terrain'>('social');
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<SimulationState>({
    activeNodes: [],
    flowPaths: [],
  });

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimulation(prev => {
        const newActiveNodes = [...prev.activeNodes];
        nodes[0].connections.forEach(conn => {
          if (!newActiveNodes.includes(conn)) {
            newActiveNodes.push(conn);
          }
        });
        return {
          activeNodes: newActiveNodes,
          flowPaths: [...prev.flowPaths, newActiveNodes],
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, nodes]);

  const handleAddNode = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setNodes(prev => [...prev, {
      id: prev.length + 1,
      x,
      y,
      type: mode === 'social' ? 'person' : mode === 'transit' ? 'station' : 'peak',
      connections: [],
    }]);
  };

  const handleReset = () => {
    setNodes(INITIAL_NODES);
    setSimulation({ activeNodes: [], flowPaths: [] });
    setIsSimulating(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('social')}
          className={`flex items-center gap-2 p-2 rounded ${mode === 'social' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-label="Social Network Mode"
        >
          <Users className="w-5 h-5" /> Social
        </button>
        <button
          onClick={() => setMode('transit')}
          className={`flex items-center gap-2 p-2 rounded ${mode === 'transit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-label="Transit System Mode"
        >
          <Train className="w-5 h-5" /> Transit
        </button>
        <button
          onClick={() => setMode('terrain')}
          className={`flex items-center gap-2 p-2 rounded ${mode === 'terrain' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-label="Terrain Navigation Mode"
        >
          <Mountain className="w-5 h-5" /> Terrain
        </button>
      </div>

      <div 
        className="relative h-96 bg-white border-2 border-gray-200 rounded-lg cursor-pointer"
        onClick={handleAddNode}
        role="application"
        aria-label="Interactive Network Visualization"
      >
        {nodes.map(node => (
          <div
            key={node.id}
            className={`absolute w-8 h-8 flex items-center justify-center rounded-full 
              ${simulation.activeNodes.includes(node.id) ? 'bg-green-500' : 'bg-gray-300'} 
              transition-colors duration-300`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {node.type === 'person' && <Users className="w-4 h-4" />}
            {node.type === 'station' && <Train className="w-4 h-4" />}
            {node.type === 'peak' && <Mountain className="w-4 h-4" />}
          </div>
        ))}
        <Network className="absolute top-2 right-2 text-gray-400 w-6 h-6" />
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className="flex items-center gap-2 p-2 rounded bg-blue-500 text-white"
          aria-label={isSimulating ? "Pause Simulation" : "Start Simulation"}
        >
          {isSimulating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 p-2 rounded bg-gray-200"
          aria-label="Reset Visualization"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GeometricLearningExplorer;