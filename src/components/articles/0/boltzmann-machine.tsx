"use client";

import React, { useState, useEffect } from "react";
import { Circle, RefreshCw, Thermometer } from "lucide-react";

const BoltzmannMachineExplainer = () => {
  // Create a grid of nodes with slight random offsets
  const createNodes = () => {
    const nodes = [];
    const gridSize = 4;
    const spacing = 80;
    const baseX = 100;
    const baseY = 100;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const randomOffset = () => (Math.random() - 0.5) * 20;
        nodes.push({
          id: i * gridSize + j,
          state: Math.random() < 0.5 ? 1 : 0,
          x: baseX + j * spacing + randomOffset(),
          y: baseY + i * spacing + randomOffset(),
        });
      }
    }
    return nodes;
  };

  const [nodes, setNodes] = useState(createNodes());
  const [isRunning, setIsRunning] = useState(true);
  const [temperature, setTemperature] = useState(1.0);

  // Sigmoid function for probability calculation
  const sigmoid = (x) => 1 / (1 + Math.exp(-x / temperature));

  // Update multiple random nodes' states
  const updateRandomNodes = () => {
    const numNodesToUpdate = Math.floor(Math.random() * 3) + 1; // Update 1-3 nodes at once

    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];
      for (let i = 0; i < numNodesToUpdate; i++) {
        const nodeId = Math.floor(Math.random() * nodes.length);

        // Calculate "energy" based on neighbors' states
        const neighbors = newNodes.filter(
          (other) =>
            Math.sqrt(
              Math.pow(other.x - newNodes[nodeId].x, 2) +
                Math.pow(other.y - newNodes[nodeId].y, 2)
            ) < 100 && other.id !== nodeId
        );

        const neighborEnergy = neighbors.reduce(
          (sum, neighbor) => sum + (neighbor.state * 2 - 1),
          0
        );

        const energy = neighborEnergy + (Math.random() * 2 - 1);
        const probability = sigmoid(energy);

        newNodes[nodeId] = {
          ...newNodes[nodeId],
          state: Math.random() < probability ? 1 : 0,
        };
      }
      return newNodes;
    });
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(updateRandomNodes, 200);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Boltzmann Machine Simulation</h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Watch as the neurons stochastically update their states based on their
          neighbors and the system temperature. Higher temperature leads to more
          random behavior, while lower temperature makes the system more
          deterministic.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isRunning ? "Pause" : "Resume"}
          <RefreshCw className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
        </button>

        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4" />
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-gray-600">
            Temperature: {temperature.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="relative h-96 border rounded-lg bg-gray-50 overflow-hidden">
        <svg className="w-full h-full">
          {/* Connections between nearby nodes */}
          {nodes.map((node1) =>
            nodes.map((node2) => {
              const distance = Math.sqrt(
                Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
              );
              return (
                node1.id < node2.id &&
                distance < 100 && (
                  <line
                    key={`${node1.id}-${node2.id}`}
                    x1={node1.x}
                    y1={node1.y}
                    x2={node2.x}
                    y2={node2.y}
                    stroke="gray"
                    strokeWidth="1"
                    strokeDasharray="4"
                    opacity={0.5}
                  />
                )
              );
            })
          )}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              <circle
                r="16"
                fill={node.state === 1 ? "#60A5FA" : "#E5E7EB"}
                stroke="#2563EB"
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              <text
                textAnchor="middle"
                dy="0.3em"
                className="text-xs font-medium select-none"
                fill={node.state === 1 ? "white" : "black"}
              >
                {node.state}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Stats */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-blue-500 fill-current" /> Active (
            {nodes.filter((n) => n.state === 1).length})
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-gray-300 fill-current" /> Inactive (
            {nodes.filter((n) => n.state === 0).length})
          </div>
        </div>
        <div>
          Activity Rate:{" "}
          {(
            (nodes.filter((n) => n.state === 1).length / nodes.length) *
            100
          ).toFixed(1)}
          %
        </div>
      </div>
    </div>
  );
};

export default BoltzmannMachineExplainer;
