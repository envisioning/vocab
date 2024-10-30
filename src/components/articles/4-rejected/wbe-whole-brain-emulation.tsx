"use client"
import { useState, useEffect } from "react";
import { Brain, ZapOff, Zap, AlertCircle, BookCopy } from "lucide-react";

interface Node {
  id: number;
  x: number;
  y: number;
  active: boolean;
  connections: number[];
}

interface ComponentProps {}

const INITIAL_NODES: Node[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  active: false,
  connections: Array.from({ length: 3 }, () => Math.floor(Math.random() * 12)),
}));

/**
 * BrainEmulationSimulator - Interactive component teaching WBE concepts
 */
const BrainEmulationSimulator: React.FC<ComponentProps> = () => {
  const [resolution, setResolution] = useState<number>(50);
  const [originalNodes, setOriginalNodes] = useState<Node[]>(INITIAL_NODES);
  const [emulatedNodes, setEmulatedNodes] = useState<Node[]>(INITIAL_NODES);
  const [errorRate, setErrorRate] = useState<number>(0);
  const [activePattern, setActivePattern] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPattern = (activePattern + 1) % 4;
      setActivePattern(newPattern);

      const updatedOriginal = originalNodes.map((node) => ({
        ...node,
        active: Math.random() < 0.3,
      }));
      setOriginalNodes(updatedOriginal);

      const accuracy = resolution / 100;
      const updatedEmulated = originalNodes.map((node) => ({
        ...node,
        active: Math.random() < accuracy ? node.active : Math.random() < 0.3,
      }));
      setEmulatedNodes(updatedEmulated);

      const errors = updatedEmulated.filter(
        (node, i) => node.active !== updatedOriginal[i].active
      ).length;
      setErrorRate((errors / originalNodes.length) * 100);
    }, 2000);

    return () => clearInterval(interval);
  }, [activePattern, originalNodes, resolution]);

  const renderBrain = (nodes: Node[], isOriginal: boolean) => (
    <div
      className="relative h-64 w-full rounded-lg bg-gray-100 p-4"
      role="img"
      aria-label={`${isOriginal ? "Original" : "Emulated"} brain visualization`}
    >
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`absolute h-4 w-4 rounded-full transition-all duration-300 ${
            node.active ? "bg-blue-500" : "bg-gray-400"
          }`}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
        >
          {node.connections.map((targetId) => {
            const target = nodes.find((n) => n.id === targetId);
            if (!target) return null;
            return (
              <div
                key={`${node.id}-${targetId}`}
                className={`absolute left-1/2 top-1/2 h-px transition-all duration-300 ${
                  node.active && target.active ? "bg-blue-500" : "bg-gray-300"
                }`}
                style={{
                  width: `${Math.hypot(
                    target.x - node.x,
                    target.y - node.y
                  )}%`,
                  transform: `rotate(${Math.atan2(
                    target.y - node.y,
                    target.x - node.x
                  )}rad)`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Brain className="h-8 w-8 text-blue-500" />
        Whole Brain Emulation Simulator
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="mb-2 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Biological Brain
          </h2>
          {renderBrain(originalNodes, true)}
        </div>
        <div>
          <h2 className="mb-2 flex items-center gap-2">
            <BookCopy className="h-5 w-5 text-blue-500" />
            Emulated Brain
          </h2>
          {renderBrain(emulatedNodes, false)}
        </div>
      </div>

      <div className="space-y-4 rounded-lg bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="resolution" className="font-medium">
            Scanning Resolution:
          </label>
          <input
            type="range"
            id="resolution"
            min="0"
            max="100"
            value={resolution}
            onChange={(e) => setResolution(Number(e.target.value))}
            className="w-full"
          />
          <span className="w-12 text-right">{resolution}%</span>
        </div>

        <div
          className="flex items-center gap-2"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle
            className={`h-5 w-5 ${
              errorRate > 20 ? "text-red-500" : "text-green-500"
            }`}
          />
          <span>Error Rate: {errorRate.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default BrainEmulationSimulator;