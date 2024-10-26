import React, { useEffect, useState } from "react";

const NeuralNetworkViz = () => {
  const [time, setTime] = useState(0);
  const [nodeActivations, setNodeActivations] = useState({});

  // Define network structure
  const layers = [
    { nodes: 3, label: "Input Layer" },
    { nodes: 4, label: "Hidden Layer" },
    { nodes: 2, label: "Output Layer" },
  ];

  const getRandomWeight = () => Math.random() * 2 - 1;
  const activate = (x) => Math.max(Math.min(x, 1), -1);

  // Slower overall cycle, but faster dot movement
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev + 1) % 600); // Much longer cycle for slower activation changes
    }, 50); // Faster interval for smoother dot movement
    return () => clearInterval(timer);
  }, []);

  // Layout calculations
  const nodeRadius = 15;
  const layerSpacing = 180;
  const verticalSpacing = 60;
  const width = layerSpacing * (layers.length - 1) + 100;
  const height = Math.max(...layers.map((l) => l.nodes)) * verticalSpacing;

  // Generate network structure
  const edges = [];
  const nodes = {};

  layers.forEach((layer, layerIdx) => {
    for (let i = 0; i < layer.nodes; i++) {
      const nodeId = `${layerIdx}-${i}`;
      nodes[nodeId] = {
        x: layerIdx * layerSpacing + 50,
        y: (i - (layer.nodes - 1) / 2) * verticalSpacing + height / 2,
        layer: layerIdx,
      };

      if (layerIdx < layers.length - 1) {
        for (let j = 0; j < layers[layerIdx + 1].nodes; j++) {
          edges.push({
            from: nodeId,
            to: `${layerIdx + 1}-${j}`,
            weight: getRandomWeight(),
          });
        }
      }
    }
  });

  const getColor = (value) => {
    const absValue = Math.abs(value);
    if (value > 0) {
      return `rgba(59, 130, 246, ${Math.min(absValue + 0.2, 1)})`; // Blue for positive
    } else {
      return `rgba(239, 68, 68, ${Math.min(Math.abs(absValue) + 0.2, 1)})`; // Red for negative
    }
  };

  // Calculate node activations based on network state
  useEffect(() => {
    const newActivations = {};

    // Much slower input pattern change
    for (let i = 0; i < layers[0].nodes; i++) {
      const value = Math.sin((time / 600) * Math.PI + i * 2); // Slower oscillation
      newActivations[`0-${i}`] = value;
    }

    // Signal propagation phase
    const phase = Math.floor((time % 600) / 200); // Three slower phases

    if (phase >= 1) {
      // Process hidden layer
      for (let i = 0; i < layers[1].nodes; i++) {
        const nodeId = `1-${i}`;
        let sum = 0;
        edges
          .filter((e) => e.to === nodeId)
          .forEach((edge) => {
            sum += (newActivations[edge.from] || 0) * edge.weight;
          });
        newActivations[nodeId] = activate(sum / layers[0].nodes);
      }
    }

    if (phase >= 2) {
      // Process output layer
      for (let i = 0; i < layers[2].nodes; i++) {
        const nodeId = `2-${i}`;
        let sum = 0;
        edges
          .filter((e) => e.to === nodeId)
          .forEach((edge) => {
            sum += (newActivations[edge.from] || 0) * edge.weight;
          });
        newActivations[nodeId] = activate(sum / layers[1].nodes);
      }
    }

    setNodeActivations(newActivations);
  }, [time]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        Neural Network Visualization
      </h2>
      <div className="relative">
        <svg width={width} height={height} className="mx-auto">
          {/* Draw edges */}
          {edges.map((edge, idx) => {
            const from = nodes[edge.from];
            const to = nodes[edge.to];
            const strokeWidth = Math.abs(edge.weight) * 3 + 1;

            // Faster signal movement within each phase
            const phase = Math.floor((time % 600) / 200);
            const shouldShowSignal = phase === from.layer;
            const signalProgress = (time % 50) / 50; // Faster signal movement cycle

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={getColor(edge.weight)}
                  strokeWidth={strokeWidth}
                  opacity={0.6}
                />
                {shouldShowSignal && (
                  <circle
                    cx={from.x + (to.x - from.x) * signalProgress}
                    cy={from.y + (to.y - from.y) * signalProgress}
                    r="4"
                    fill={getColor(nodeActivations[edge.from] * edge.weight)}
                    opacity={0.8}
                  />
                )}
              </g>
            );
          })}

          {/* Draw nodes */}
          {Object.entries(nodes).map(([nodeId, node]) => (
            <g key={nodeId}>
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill={
                  Math.abs(nodeActivations[nodeId] || 0) > 0.1
                    ? getColor(nodeActivations[nodeId])
                    : "white"
                }
                stroke="#333"
                strokeWidth="2"
                className="transition-all duration-700"
              />
            </g>
          ))}

          {/* Layer labels */}
          {layers.map((layer, idx) => (
            <text
              key={`label-${idx}`}
              x={idx * layerSpacing + 50}
              y={height + 30}
              textAnchor="middle"
              className="text-sm font-medium"
            >
              {layer.label}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-6 flex justify-center items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-blue-500"></div>
          <span className="text-sm">Strong Positive Weight/Activation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-red-500"></div>
          <span className="text-sm">Strong Negative Weight/Activation</span>
        </div>
      </div>

      <p className="mt-4 text-center text-gray-600">
        Signals propagate layer-by-layer. Node colors show activation values,
        connection colors show weights.
      </p>
    </div>
  );
};

export default NeuralNetworkViz;
