"use client";
import React, { useState, useEffect } from "react";
import { Brain } from "lucide-react";

const ParameterSizeVisualizer = () => {
  const [layer1Size, setLayer1Size] = useState(3);
  const [layer2Size, setLayer2Size] = useState(4);
  const [parameterCount, setParameterCount] = useState(0);
  const [connections, setConnections] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);

  // Add hover state for connections
  const [hoveredConnection, setHoveredConnection] = useState(null);

  const NEURON_SIZE = 24; // Size of neuron circles in pixels
  const LAYER_WIDTH = 200; // Width between layers
  const LAYER_HEIGHT = 200; // Height of the layer container

  useEffect(() => {
    // Calculate total parameters (weights)
    const totalParams = layer1Size * layer2Size;
    setParameterCount(totalParams);

    // Generate connection coordinates
    const newConnections = [];
    for (let i = 0; i < layer1Size; i++) {
      for (let j = 0; j < layer2Size; j++) {
        newConnections.push({
          id: `${i}-${j}`,
          highlighted: false,
        });
      }
    }
    setConnections(newConnections);

    // Animation loop
    if (isAnimating) {
      const interval = setInterval(() => {
        setConnections((prev) => {
          const newConns = [...prev];
          // Reset all highlights
          newConns.forEach((conn) => (conn.highlighted = false));
          // Highlight random connection
          const randomIdx = Math.floor(Math.random() * newConns.length);
          newConns[randomIdx].highlighted = true;
          return newConns;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [layer1Size, layer2Size, isAnimating]);

  // Calculate neuron positions
  const getNeuronPosition = (layerIndex, neuronIndex, totalNeurons) => {
    const spacing =
      (LAYER_HEIGHT - NEURON_SIZE) / Math.max(totalNeurons - 1, 1);
    const x = layerIndex === 0 ? NEURON_SIZE : LAYER_WIDTH - NEURON_SIZE;
    const y =
      (LAYER_HEIGHT - (totalNeurons - 1) * spacing) / 2 + neuronIndex * spacing;
    return { x: x + NEURON_SIZE / 2, y: y + NEURON_SIZE / 2 };
  };

  const getExplanationText = () => {
    return (
      <>
        <p className="text-gray-600 mb-2">
          In neural networks, parameters (weights) connect neurons between
          layers:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-600">
          <li>
            Each neuron in Layer 1 connects to <em>every</em> neuron in Layer 2
          </li>
          <li>
            Therefore: {layer1Size} × {layer2Size} = {parameterCount} total
            parameters
          </li>
        </ul>
      </>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-800">
          Neural Network Parameter Counter
        </h2>
      </div>

      {/* Add layer size controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Layer 1 Neurons
          </label>
          <input
            type="range"
            min="1"
            max="6"
            value={layer1Size}
            onChange={(e) => setLayer1Size(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Layer 2 Neurons
          </label>
          <input
            type="range"
            min="1"
            max="6"
            value={layer2Size}
            onChange={(e) => setLayer2Size(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Replace existing explanation with dynamic one */}
      <div className="mb-8">{getExplanationText()}</div>

      {/* Update connection lines to include hover effects */}
      {connections.map((conn, idx) => {
        const fromNeuron = Math.floor(idx / layer2Size);
        const toNeuron = idx % layer2Size;
        const start = getNeuronPosition(0, fromNeuron, layer1Size);
        const end = getNeuronPosition(1, toNeuron, layer2Size);

        return (
          <line
            key={conn.id}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={
              conn.highlighted || hoveredConnection === conn.id
                ? "#3B82F6"
                : "#E5E7EB"
            }
            strokeWidth={
              conn.highlighted || hoveredConnection === conn.id ? "2" : "1"
            }
            className="transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredConnection(conn.id)}
            onMouseLeave={() => setHoveredConnection(null)}
          />
        );
      })}

      {/* Add connection info tooltip */}
      {hoveredConnection && (
        <div className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm">
          Weight connection {hoveredConnection}
        </div>
      )}

      <div className="flex justify-center items-center mb-4">
        {/* Layer Labels */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold mb-2">Layer 1</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 text-center">{layer1Size}</span>
          </div>
        </div>

        {/* Neural Network Visualization */}
        <div
          className="relative mx-8"
          style={{
            width: `${LAYER_WIDTH}px`,
            height: `${LAYER_HEIGHT * 1.1}px`,
          }}
        >
          <svg className="w-full h-full">
            {/* Connection lines */}
            {connections.map((conn, idx) => {
              const fromNeuron = Math.floor(idx / layer2Size);
              const toNeuron = idx % layer2Size;
              const start = getNeuronPosition(0, fromNeuron, layer1Size);
              const end = getNeuronPosition(1, toNeuron, layer2Size);

              return (
                <line
                  key={conn.id}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={conn.highlighted ? "#3B82F6" : "#E5E7EB"}
                  strokeWidth={conn.highlighted ? "2" : "1"}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Layer 1 Neurons */}
            {Array(layer1Size)
              .fill()
              .map((_, i) => {
                const pos = getNeuronPosition(0, i, layer1Size);
                return (
                  <g
                    key={`l1-${i}`}
                    transform={`translate(${pos.x - NEURON_SIZE / 2},${
                      pos.y - NEURON_SIZE / 2
                    })`}
                  >
                    <circle
                      cx={NEURON_SIZE / 2}
                      cy={NEURON_SIZE / 2}
                      r={NEURON_SIZE / 2}
                      className="fill-blue-500"
                    />
                  </g>
                );
              })}

            {/* Layer 2 Neurons */}
            {Array(layer2Size)
              .fill()
              .map((_, i) => {
                const pos = getNeuronPosition(1, i, layer2Size);
                return (
                  <g
                    key={`l2-${i}`}
                    transform={`translate(${pos.x - NEURON_SIZE / 2},${
                      pos.y - NEURON_SIZE / 2
                    })`}
                  >
                    <circle
                      cx={NEURON_SIZE / 2}
                      cy={NEURON_SIZE / 2}
                      r={NEURON_SIZE / 2}
                      className="fill-blue-500"
                    />
                  </g>
                );
              })}
          </svg>
        </div>

        {/* Layer 2 Label */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold mb-2">Layer 2</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 text-center">{layer2Size}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterSizeVisualizer;
