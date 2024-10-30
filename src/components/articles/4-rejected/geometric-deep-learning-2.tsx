"use client"
import { useState, useEffect } from "react";
import { Users, Network, Share2, MessageCircle, Zap, RefreshCcw } from "lucide-react";

interface Node {
  id: number;
  x: number;
  y: number;
  influence: number;
  connections: number[];
}

interface NetworkState {
  nodes: Node[];
  activeNode: number | null;
  simulationRunning: boolean;
  predictionMode: boolean;
  userPredictions: boolean[];
  informationType: "rumor" | "news" | "trend";
}

const INITIAL_NODES: Node[] = [
  { id: 0, x: 50, y: 50, influence: 0, connections: [1, 2] },
  { id: 1, x: 150, y: 50, influence: 0, connections: [0, 3] },
  { id: 2, x: 50, y: 150, influence: 0, connections: [0, 3] },
  { id: 3, x: 150, y: 150, influence: 0, connections: [1, 2] }
];

export default function GeometricDeepLearningSimulator() {
  const [network, setNetwork] = useState<NetworkState>({
    nodes: INITIAL_NODES,
    activeNode: null,
    simulationRunning: false,
    predictionMode: true,
    userPredictions: Array(INITIAL_NODES.length).fill(false),
    informationType: "rumor"
  });

  useEffect(() => {
    if (network.simulationRunning) {
      const interval = setInterval(() => {
        setNetwork(prev => {
          const newNodes = [...prev.nodes];
          newNodes.forEach(node => {
            if (node.influence > 0) {
              node.connections.forEach(connId => {
                const connNode = newNodes.find(n => n.id === connId);
                if (connNode) {
                  connNode.influence = Math.min(1, connNode.influence + 0.2);
                }
              });
            }
          });
          return { ...prev, nodes: newNodes };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [network.simulationRunning]);

  const handleNodeClick = (nodeId: number) => {
    if (network.predictionMode) {
      setNetwork(prev => ({
        ...prev,
        userPredictions: prev.userPredictions.map((p, i) => 
          i === nodeId ? !p : p
        )
      }));
    } else {
      setNetwork(prev => ({
        ...prev,
        nodes: prev.nodes.map(node =>
          node.id === nodeId ? { ...node, influence: 1 } : node
        ),
        activeNode: nodeId
      }));
    }
  };

  const startSimulation = () => {
    setNetwork(prev => ({
      ...prev,
      simulationRunning: true,
      predictionMode: false
    }));
  };

  const resetSimulation = () => {
    setNetwork({
      ...network,
      nodes: INITIAL_NODES,
      activeNode: null,
      simulationRunning: false,
      predictionMode: true,
      userPredictions: Array(INITIAL_NODES.length).fill(false)
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-100 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Influence Network Simulator</h2>
        <div className="flex gap-4">
          <button
            onClick={startSimulation}
            disabled={network.simulationRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            aria-label="Start simulation"
          >
            <Zap size={20} /> Start Flow
          </button>
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            aria-label="Reset simulation"
          >
            <RefreshCcw size={20} /> Reset
          </button>
        </div>
      </div>

      <div className="relative w-full h-[400px] bg-white rounded-lg shadow-lg mb-6">
        {network.nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            className={`absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
              node.influence > 0 ? 'bg-green-500' : 
              network.userPredictions[node.id] ? 'bg-blue-300' : 'bg-gray-300'
            }`}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`
            }}
            role="button"
            tabIndex={0}
            aria-label={`Network node ${node.id}`}
          >
            <Users size={20} className="text-white" />
          </div>
        ))}
        
        {network.nodes.map(node => 
          node.connections.map(connId => {
            const connNode = network.nodes.find(n => n.id === connId);
            if (connNode) {
              return (
                <svg
                  key={`${node.id}-${connId}`}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                >
                  <line
                    x1={node.x + 24}
                    y1={node.y + 24}
                    x2={connNode.x + 24}
                    y2={connNode.y + 24}
                    stroke={node.influence > 0 && connNode.influence > 0 ? "#22C55E" : "#6B7280"}
                    strokeWidth="2"
                  />
                </svg>
              );
            }
          })
        )}
      </div>

      <div className="text-center text-gray-700">
        {network.predictionMode ? 
          "Click nodes to predict how information will spread" :
          "Watch how information flows through the network"
        }
      </div>
    </div>
  );
}