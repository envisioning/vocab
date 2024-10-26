import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ACOVisualization = () => {
  const [paths, setPaths] = useState([]);
  const [ants, setAnts] = useState([]);
  const [iteration, setIteration] = useState(0);

  // Grid configuration
  const gridSize = { width: 10, height: 6 };
  const start = { x: 0, y: 2 };
  const end = { x: 9, y: 2 };

  // Initialize paths with random obstacles
  const initializePaths = () => {
    const initialPaths = [];
    const obstaclePositions = new Set();

    // Generate random obstacle positions (avoiding start and end)
    while (
      obstaclePositions.size <
      Math.floor(gridSize.width * gridSize.height * 0.2)
    ) {
      const x = Math.floor(Math.random() * gridSize.width);
      const y = Math.floor(Math.random() * gridSize.height);
      const pos = `${x},${y}`;
      if (
        (x !== start.x || y !== start.y) &&
        (x !== end.x || y !== end.y) &&
        !obstaclePositions.has(pos)
      ) {
        obstaclePositions.add(pos);
      }
    }

    // Create paths grid
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        if (
          (x === start.x && y === start.y) ||
          (x === end.x && y === end.y) ||
          !obstaclePositions.has(`${x},${y}`)
        ) {
          initialPaths.push({
            x,
            y,
            pheromone: 0.1,
          });
        }
      }
    }
    return initialPaths;
  };

  // Reset simulation
  const resetSimulation = () => {
    setPaths(initializePaths());
    setAnts([{ x: start.x, y: start.y, visited: new Set() }]);
    setIteration(0);
  };

  // Initialize on mount
  useEffect(() => {
    resetSimulation();
  }, []);

  // Simulate ant movement
  useEffect(() => {
    const interval = setInterval(() => {
      setIteration((prev) => prev + 1);

      // Move ants
      setAnts((prevAnts) => {
        const newAnts = prevAnts.map((ant) => {
          if (ant.x === end.x && ant.y === end.y) {
            // Reset ant to start if it reached the end
            return { x: start.x, y: start.y, visited: new Set() };
          }

          // Get all possible moves (up, down, right)
          const possibleMoves = paths.filter((path) => {
            // Check if move is valid (adjacent cell)
            const isAdjacent =
              (Math.abs(path.x - ant.x) === 1 && path.y === ant.y) || // horizontal move
              (path.x === ant.x && Math.abs(path.y - ant.y) === 1); // vertical move

            // Prevent moving left or revisiting cells
            const isForward = path.x >= ant.x;
            const notVisited = !ant.visited?.has(`${path.x},${path.y}`);

            return isAdjacent && isForward && notVisited;
          });

          if (possibleMoves.length === 0) {
            // Reset ant if stuck
            return { x: start.x, y: start.y, visited: new Set() };
          }

          // Calculate probabilities based on pheromone levels
          const totalPheromone = possibleMoves.reduce(
            (sum, move) => sum + move.pheromone,
            0
          );
          let random = Math.random() * totalPheromone;

          let selectedMove = possibleMoves[0];
          for (const move of possibleMoves) {
            random -= move.pheromone;
            if (random <= 0) {
              selectedMove = move;
              break;
            }
          }

          // Update ant's visited cells
          const newVisited = new Set(ant.visited || []);
          newVisited.add(`${selectedMove.x},${selectedMove.y}`);

          return {
            x: selectedMove.x,
            y: selectedMove.y,
            visited: newVisited,
          };
        });

        // Update pheromones
        setPaths((prevPaths) => {
          return prevPaths.map((path) => {
            const antOnPath = newAnts.some(
              (ant) => ant.x === path.x && ant.y === path.y
            );
            const isOnPathToEnd =
              antOnPath &&
              newAnts.some((ant) => ant.x === end.x && ant.y === end.y);

            return {
              ...path,
              pheromone: Math.max(
                0.1,
                path.pheromone * 0.95 + // Evaporation
                  (antOnPath ? 0.3 : 0) + // Basic pheromone deposit
                  (isOnPathToEnd ? 0.5 : 0) // Extra pheromone for successful paths
              ),
            };
          });
        });

        // Add new ants at start
        if (iteration % 3 === 0 && newAnts.length < 5) {
          newAnts.push({ x: start.x, y: start.y, visited: new Set() });
        }

        return newAnts;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [paths, iteration]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Ant Colony Optimization Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="grid gap-1 p-4 bg-slate-100 rounded-lg">
            {Array.from({ length: gridSize.height }).map((_, y) => (
              <div key={y} className="flex gap-1">
                {Array.from({ length: gridSize.width }).map((_, x) => {
                  const path = paths.find((p) => p.x === x && p.y === y);
                  const ant = ants.find((a) => a.x === x && a.y === y);
                  const isStart = x === start.x && y === start.y;
                  const isEnd = x === end.x && y === end.y;
                  const opacity = path ? Math.min(path.pheromone, 1) : 0;
                  const showAnt = ant && !isStart && !isEnd;

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`w-8 h-8 flex items-center justify-center rounded font-mono text-sm
                        ${!path ? "bg-slate-700" : "bg-blue-500"}`}
                      style={{ opacity: path ? opacity : 1 }}
                    >
                      {showAnt && "🐜"}
                      {isStart && "🏠"}
                      {isEnd && "🎯"}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <Button onClick={resetSimulation}>New Maze</Button>
          <div className="text-sm text-gray-600">Iteration: {iteration}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ACOVisualization;
