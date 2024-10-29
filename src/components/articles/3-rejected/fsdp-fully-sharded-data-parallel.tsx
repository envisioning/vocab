"use client"
import { useState, useEffect } from "react";
import { Building2, Cpu, Network, ArrowsUpFromLine, Workflow, Activity } from "lucide-react";

interface Node {
  id: number;
  x: number;
  y: number;
  resources: number;
  connections: number[];
}

interface CityBuilderProps {
  initialNodes?: number;
}

const CityBuilder: React.FC<CityBuilderProps> = ({ initialNodes = 3 }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [efficiency, setEfficiency] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);

  useEffect(() => {
    // Initialize nodes in a circular layout
    const initialLayout = Array.from({ length: initialNodes }, (_, i) => ({
      id: i,
      x: 200 + Math.cos((i * 2 * Math.PI) / initialNodes) * 150,
      y: 200 + Math.sin((i * 2 * Math.PI) / initialNodes) * 150,
      resources: 100,
      connections: []
    }));

    setNodes(initialLayout);

    return () => {
      setNodes([]);
      setIsOptimizing(false);
    };
  }, [initialNodes]);

  useEffect(() => {
    if (isOptimizing) {
      const interval = setInterval(() => {
        setNodes(prev => {
          return prev.map(node => ({
            ...node,
            resources: redistributeResources(node.resources)
          }));
        });
        
        calculateEfficiency();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOptimizing]);

  const redistributeResources = (current: number): number => {
    const variation = Math.random() * 20 - 10;
    return Math.max(0, Math.min(100, current + variation));
  };

  const calculateEfficiency = () => {
    const totalResources = nodes.reduce((sum, node) => sum + node.resources, 0);
    const avgResources = totalResources / nodes.length;
    const variance = nodes.reduce((sum, node) => {
      return sum + Math.pow(node.resources - avgResources, 2);
    }, 0) / nodes.length;
    
    setEfficiency(100 - Math.min(100, variance));
  };

  const handleNodeDrag = (e: React.MouseEvent, id: number) => {
    if (draggedNodeId === null) {
      setDraggedNodeId(id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setNodes(prev => 
        prev.map(node => 
          node.id === draggedNodeId 
            ? { ...node, x, y }
            : node
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg p-4">
      <div className="absolute top-4 left-4 flex gap-4">
        <button
          onClick={() => setIsOptimizing(!isOptimizing)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {isOptimizing ? <Activity className="w-4 h-4" /> : <Workflow className="w-4 h-4" />}
          {isOptimizing ? 'Stop' : 'Start'} Optimization
        </button>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg">
          <Network className="w-4 h-4" />
          Efficiency: {efficiency.toFixed(1)}%
        </div>
      </div>

      <svg 
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Connection lines */}
        {nodes.map(node => 
          node.connections.map(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (!target) return null;
            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="4"
              />
            );
          })
        )}

        {/* Nodes */}
        {nodes.map(node => (
          <g key={node.id} transform={`translate(${node.x},${node.y})`}>
            <circle
              r="40"
              fill={draggedNodeId === node.id ? "#60a5fa" : "#3b82f6"}
              className="cursor-move"
              onMouseDown={(e) => handleNodeDrag(e, node.id)}
            />
            <Cpu className="w-6 h-6 text-white absolute -translate-x-3 -translate-y-3" />
            <text
              className="text-xs fill-white"
              textAnchor="middle"
              y="20"
            >
              {node.resources.toFixed(0)}%
            </text>
          </g>
        ))}
      </svg>

      <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">FSDP Resource Distribution</h3>
        <p className="text-sm text-gray-600">
          Drag nodes to reorganize the network. Watch how resources are automatically redistributed to maintain optimal performance.
        </p>
      </div>
    </div>
  );
};

export default CityBuilder;