"use client";

import React, { useState, useEffect, useMemo } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
}

const generateOrganicGraph = (nodeCount = 18) => {
  const nodes: Node[] = [];
  const centerX = 250;
  const centerY = 150;

  // Create a more evenly distributed set of nodes
  const gridCols = Math.ceil(Math.sqrt(nodeCount * 1.5)); // More columns than rows for width
  const gridRows = Math.ceil(nodeCount / gridCols);
  const cellWidth = 300 / gridCols;
  const cellHeight = 200 / gridRows;

  for (let i = 0; i < nodeCount; i++) {
    const row = Math.floor(i / gridCols);
    const col = i % gridCols;

    // Base position in grid
    const baseX = centerX - 150 + (col + 0.5) * cellWidth;
    const baseY = centerY - 100 + (row + 0.5) * cellHeight;

    // Add some random variation
    const randX = (Math.random() - 0.5) * cellWidth * 0.7;
    const randY = (Math.random() - 0.5) * cellHeight * 0.7;

    nodes.push({
      id: i,
      x: baseX + randX,
      y: baseY + randY,
    });
  }

  // Helper to calculate distance between nodes
  const distance = (a: Node, b: Node) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  // Generate edges ensuring connectivity
  const edges: [number, number][] = [];
  const connected = new Set([0]);
  const unconnected = new Set(nodes.slice(1).map((n) => n.id));

  while (unconnected.size > 0) {
    let bestEdge: [number, number] | null = null;
    let shortestDistance = Infinity;

    for (const from of connected) {
      for (const to of unconnected) {
        const dist = distance(nodes[from], nodes[to]);
        if (dist < shortestDistance) {
          shortestDistance = dist;
          bestEdge = [from, to];
        }
      }
    }

    if (bestEdge) {
      edges.push(bestEdge);
      connected.add(bestEdge[1]);
      unconnected.delete(bestEdge[1]);
    }
  }

  nodes.forEach((node, i) => {
    const nearest = nodes
      .map((other, j) => ({ j, dist: distance(node, other) }))
      .filter(
        ({ j }) =>
          j !== i &&
          !edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))
      )
      .sort((a, b) => a.dist - b.dist);

    const extraConnections = 2 + Math.floor(Math.random() * 3);
    nearest.slice(0, extraConnections).forEach(({ j }) => {
      if (i < j && distance(nodes[i], nodes[j]) < 120) {
        edges.push([i, j]);
      }
    });
  });

  // Dijkstra's algorithm for shortest path
  const findShortestPath = (start: Node, end: Node) => {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    // Initialize distances
    nodes.forEach((node) => {
      distances.set(node.id, Infinity);
      unvisited.add(node.id);
    });
    distances.set(start.id, 0);

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let current = null;
      let minDistance = Infinity;
      for (const id of unvisited) {
        if (distances.get(id) < minDistance) {
          minDistance = distances.get(id);
          current = id;
        }
      }

      if (current === null || current === end.id) break;

      unvisited.delete(current);

      // Add type guard to ensure current is a number
      const currentNode = nodes[current as number];

      // Update distances to neighbors
      edges
        .filter(([a, b]) => a === current || b === current)
        .map(([a, b]) => (a === current ? b : a))
        .filter((neighbor) => unvisited.has(neighbor))
        .forEach((neighbor) => {
          const dist =
            distances.get(current) + distance(currentNode, nodes[neighbor]);
          if (dist < distances.get(neighbor)) {
            distances.set(neighbor, dist);
            previous.set(neighbor, current);
          }
        });
    }

    // Reconstruct path
    const path = [];
    let current = end.id;
    while (current !== undefined) {
      path.unshift(current);
      current = previous.get(current);
    }

    return path;
  };

  const leftSide = nodes
    .filter((n) => n.x < centerX)
    .reduce((a, b) => (a.x < b.x ? a : b));
  const rightSide = nodes
    .filter((n) => n.x > centerX)
    .reduce((a, b) => (a.x > b.x ? a : b));
  const path = findShortestPath(leftSide, rightSide);

  return { nodes, edges, path };
};

const GRAPH_STATES = [
  generateOrganicGraph(),
  generateOrganicGraph(),
  generateOrganicGraph(),
];

const AnimatedGraph = () => {
  const [currentState, setCurrentState] = useState(0);
  const [pathProgress, setPathProgress] = useState(0);
  const [graphs, setGraphs] = useState(GRAPH_STATES);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentState((prev) => {
        const next = (prev + 1) % graphs.length;
        if (next === 0) {
          setGraphs([
            generateOrganicGraph(),
            generateOrganicGraph(),
            generateOrganicGraph(),
          ]);
        }
        return next;
      });
      setPathProgress(0);
    }, 4000);
    return () => clearInterval(timer);
  }, [graphs]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPathProgress((prev) => Math.min(prev + 0.01, 1));
    }, 25); // Slower path animation
    return () => clearInterval(timer);
  }, [currentState]);

  const currentGraph = graphs[currentState];

  const pathSegments = useMemo(() => {
    const segments = [];
    const path = currentGraph.path;
    for (let i = 0; i < path.length - 1; i++) {
      const start = currentGraph.nodes[path[i]];
      const end = currentGraph.nodes[path[i + 1]];
      segments.push({ start, end });
    }
    return segments;
  }, [currentState, graphs]);

  const lerp = (start: number, end: number, t: number) =>
    start + (end - start) * t;

  const getPathPosition = () => {
    const totalSegments = pathSegments.length;
    const segmentProgress = totalSegments * pathProgress;
    const currentSegment = Math.min(
      Math.floor(segmentProgress),
      totalSegments - 1
    );
    const segmentT = segmentProgress - currentSegment;

    if (!pathSegments[currentSegment]) return { currentSegment: 0, x: 0, y: 0 };

    const segment = pathSegments[currentSegment];
    const x = lerp(segment.start.x, segment.end.x, segmentT);
    const y = lerp(segment.start.y, segment.end.y, segmentT);

    return {
      currentSegment,
      x,
      y,
      totalProgress: (currentSegment + segmentT) / totalSegments,
    };
  };

  const pathPosition = getPathPosition();
  // Calculate which nodes should be green based on path progress
  // Nodes turn green slightly ahead of the line
  const getNodeColor = (nodeIndex: number) => {
    const nodePosition = currentGraph.path.indexOf(nodeIndex);
    if (nodePosition === -1) return "#ef4444";

    const progressOffset = 0.15; // Nodes turn green this far ahead of the line
    const nodeThreshold = (pathPosition.totalProgress ?? 0) + progressOffset;
    const nodeProgress = nodePosition / (currentGraph.path.length - 1);

    return nodeProgress <= nodeThreshold ? "#22c55e" : "#ef4444";
  };

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg p-4">
      <svg className="w-full h-full" viewBox="0 0 500 300">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render edges */}
        {currentGraph.edges.map(([from, to], i) => {
          const start = currentGraph.nodes[from];
          const end = currentGraph.nodes[to];
          return (
            <line
              key={`edge-${i}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#fb923c"
              strokeWidth="1.5"
              opacity="0.4"
            />
          );
        })}

        {/* Render highlighted path up to current progress */}
        {pathSegments
          .slice(0, pathPosition.currentSegment + 1)
          .map((segment, i) => (
            <line
              key={`path-${i}`}
              x1={segment.start.x}
              y1={segment.start.y}
              x2={
                i === pathPosition.currentSegment
                  ? pathPosition.x
                  : segment.end.x
              }
              y2={
                i === pathPosition.currentSegment
                  ? pathPosition.y
                  : segment.end.y
              }
              stroke="#22c55e"
              strokeWidth="3"
              filter="url(#glow)"
            />
          ))}

        {/* Render nodes */}
        {currentGraph.nodes.map((node, i) => (
          <circle
            key={`node-${i}`}
            cx={node.x}
            cy={node.y}
            r="6"
            fill={getNodeColor(i)}
            filter="url(#glow)"
          />
        ))}
      </svg>
    </div>
  );
};

export default AnimatedGraph;
