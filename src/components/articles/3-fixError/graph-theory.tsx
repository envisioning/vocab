"use client"
import { useState, useEffect } from "react";
import { Circle, Line, Users, Train, School, Plus, Trash, Award } from "lucide-react";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: string;
  to: string;
  weight?: number;
}

interface Scenario {
  id: string;
  name: string;
  icon: JSX.Element;
  nodeLabel: string;
  edgeLabel: string;
}

const SCENARIOS: Scenario[] = [
  { id: "social", name: "Social Network", icon: <Users size={24} />, nodeLabel: "Person", edgeLabel: "Friend" },
  { id: "metro", name: "Metro System", icon: <Train size={24} />, nodeLabel: "Station", edgeLabel: "Line" },
  { id: "school", name: "School Clubs", icon: <School size={24} />, nodeLabel: "Club", edgeLabel: "Members" }
];

/**
 * GraphTheoryExplorer: An interactive component for learning graph theory
 * through real-world scenarios and hands-on exploration.
 */
export default function GraphTheoryExplorer() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>("social");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "connect" | "delete">("add");

  useEffect(() => {
    const cleanup = () => {
      setNodes([]);
      setEdges([]);
    };
    return cleanup;
  }, [selectedScenario]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "add") return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newNode: Node = {
      id: `node-${Date.now()}`,
      x,
      y,
      label: `${SCENARIOS.find(s => s.id === selectedScenario)?.nodeLabel} ${nodes.length + 1}`
    };
    
    setNodes([...nodes, newNode]);
  };

  const handleNodeClick = (nodeId: string) => {
    if (mode === "delete") {
      setNodes(nodes.filter(n => n.id !== nodeId));
      setEdges(edges.filter(e => e.from !== nodeId && e.to !== nodeId));
      return;
    }

    if (mode === "connect") {
      if (!selectedNode) {
        setSelectedNode(nodeId);
      } else if (selectedNode !== nodeId) {
        setEdges([...edges, { from: selectedNode, to: nodeId }]);
        setSelectedNode(null);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg">
      <div className="flex gap-4 mb-4">
        {SCENARIOS.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario.id)}
            className={`flex items-center gap-2 p-2 rounded ${
              selectedScenario === scenario.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            aria-label={`Switch to ${scenario.name} scenario`}
          >
            {scenario.icon}
            <span>{scenario.name}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("add")}
          className={`p-2 rounded ${mode === "add" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-label="Add node mode"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={() => setMode("connect")}
          className={`p-2 rounded ${mode === "connect" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-label="Connect nodes mode"
        >
          <Line size={20} />
        </button>
        <button
          onClick={() => setMode("delete")}
          className={`p-2 rounded ${mode === "delete" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-label="Delete mode"
        >
          <Trash size={20} />
        </button>
      </div>

      <div
        onClick={handleCanvasClick}
        className="relative w-full h-[500px] border-2 border-gray-300 rounded-lg bg-white"
        role="application"
        aria-label="Graph canvas"
      >
        {edges.map((edge, i) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <line
              key={`edge-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              className="stroke-gray-400 stroke-2"
              style={{
                position: 'absolute',
                pointerEvents: 'none'
              }}
            />
          );
        })}

        {nodes.map(node => (
          <div
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
              ${selectedNode === node.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{ left: node.x, top: node.y }}
          >
            <Circle
              size={32}
              className={`${selectedNode === node.id ? 'fill-blue-500' : 'fill-gray-200'} 
                stroke-gray-600`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}