import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ALifeSimulation = () => {
  const rows = 15;
  const cols = 15;
  const [grid, setGrid] = useState([]);
  const [generation, setGeneration] = useState(0);

  // Initialize empty grid
  useEffect(() => {
    const initialGrid = Array(rows)
      .fill()
      .map(() =>
        Array(cols)
          .fill()
          .map(() => Math.random() > 0.7)
      );
    setGrid(initialGrid);
  }, []);

  // Update grid based on rules
  const updateGrid = () => {
    const newGrid = grid.map((row, i) =>
      row.map((cell, j) => {
        const neighbors = countNeighbors(i, j);
        // Rules for cell survival/birth
        if (cell) {
          return neighbors === 2 || neighbors === 3;
        } else {
          return neighbors === 3;
        }
      })
    );
    setGrid(newGrid);
    setGeneration((prev) => prev + 1);
  };

  // Count living neighbors
  const countNeighbors = (x, y) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newX = x + i;
        const newY = y + j;
        if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
          count += grid[newX][newY] ? 1 : 0;
        }
      }
    }
    return count;
  };

  // Continuous animation loop
  useEffect(() => {
    const intervalId = setInterval(updateGrid, 500);
    return () => clearInterval(intervalId);
  }, [grid]);

  // Toggle cell state on click
  const toggleCell = (i, j) => {
    const newGrid = [...grid];
    newGrid[i][j] = !newGrid[i][j];
    setGrid(newGrid);
  };

  // Reset simulation
  const resetSimulation = () => {
    const newGrid = Array(rows)
      .fill()
      .map(() =>
        Array(cols)
          .fill()
          .map(() => Math.random() > 0.7)
      );
    setGrid(newGrid);
    setGeneration(0);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Artificial Life Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            Generation: {generation} | Click cells to toggle them or use Reset
            for a new pattern
          </div>

          <div className="border rounded p-4 bg-gray-50">
            {grid.map((row, i) => (
              <div key={i} className="flex justify-center">
                {row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`w-6 h-6 border border-gray-200 cursor-pointer transition-colors
                      ${cell ? "bg-blue-500" : "bg-white"}`}
                    onClick={() => toggleCell(i, j)}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={resetSimulation}
            >
              <RefreshCw size={16} />
              Reset
            </button>
          </div>

          <div className="text-sm space-y-2">
            <p>Watch how this Artificial Life simulation demonstrates:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Emergence:</strong> Complex patterns appear from simple
                rules
              </li>
              <li>
                <strong>Self-organization:</strong> Cells naturally form
                structures
              </li>
              <li>
                <strong>Evolution:</strong> Patterns change and adapt over time
              </li>
              <li>
                <strong>Local interactions:</strong> Each cell only affects its
                neighbors
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ALifeSimulation;
