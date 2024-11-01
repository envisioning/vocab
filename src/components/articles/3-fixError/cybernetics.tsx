"use client"
import { useState, useEffect } from "react";
import { Brain, Cpu, ArrowRight, GitBranch, RefreshCw, Zap, Info, MessageCircle, Eye } from "lucide-react";

interface CyberneticsNode {
  id: number;
  type: "human" | "machine";
  tooltip: string;
  examples: string[];
}

const NODES: CyberneticsNode[] = [
  {
    id: 1,
    type: "human",
    tooltip: "Living systems that process and respond to information",
    examples: ["Neural Networks", "Decision Making", "Learning & Adaptation"]
  },
  {
    id: 2,
    type: "machine",
    tooltip: "Artificial systems with control and feedback mechanisms",
    examples: ["AI Systems", "Robotics", "Smart Devices"]
  }
];

export default function CyberneticsVisualization() {
  const [activeNode, setActiveNode] = useState<number>(1);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [flowDirection, setFlowDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode(prev => prev === 1 ? 2 : 1);
      setFlowDirection(prev => prev === "forward" ? "backward" : "forward");
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8">
      <div className="absolute top-6 left-6 flex items-center space-x-3">
        <Brain className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Cybernetics Explorer</h2>
      </div>

      <div className="mt-20 flex justify-center items-center gap-24">
        {NODES.map((node) => (
          <div key={node.id} className="relative group">
            <div
              className={`w-40 h-40 rounded-2xl flex flex-col items-center justify-center
                ${node.type === "human" ? "bg-blue-500/20" : "bg-green-500/20"}
                ${activeNode === node.id ? "ring-4 ring-offset-4 ring-offset-gray-900" : ""}
                ${node.type === "human" ? "ring-blue-400" : "ring-green-400"}
                transition-all duration-500 backdrop-blur-sm`}
              onMouseEnter={() => setShowTooltip(node.id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              {node.type === "human" ? (
                <Brain className="w-16 h-16 text-blue-400 mb-2" />
              ) : (
                <Cpu className="w-16 h-16 text-green-400 mb-2" />
              )}
              <span className="text-white font-medium">
                {node.type === "human" ? "Human System" : "Machine System"}
              </span>

              {showTooltip === node.id && (
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 bg-white rounded-lg p-3 shadow-xl z-10">
                  <p className="text-gray-700 text-sm">{node.tooltip}</p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="w-3 h-3 bg-white rotate-45 transform" />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2">
              {node.examples.map((example, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-gray-400 text-sm">
                  <GitBranch className="w-4 h-4" />
                  <span>{example}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64">
          <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full w-full bg-gradient-to-r 
                from-blue-500 via-purple-500 to-green-500 rounded-full
                transition-transform duration-1000 ease-in-out
                ${flowDirection === "forward" ? "translate-x-0" : "-translate-x-full"}`}
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-xs">Input</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-xs">Feedback</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center space-y-2">
        <p className="text-gray-300">Exploring the continuous interaction between human and machine systems</p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>Observe</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>Communicate</span>
          </div>
          <div className="flex items-center space-x-1">
            <Info className="w-4 h-4" />
            <span>Learn</span>
          </div>
        </div>
      </div>
    </div>
  );
}