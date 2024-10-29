"use client"
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, RefreshCw } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface ComponentProps {}

const GRID_SIZE = 10;
const INITIAL_POSITION: Position = { x: 0, y: 0 };

const PathIntegrationMaze: React.FC<ComponentProps> = () => {
  const [actualPosition, setActualPosition] = useState<Position>(INITIAL_POSITION);
  const [estimatedPosition, setEstimatedPosition] = useState<Position>(INITIAL_POSITION);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [path, setPath] = useState<Position[]>([INITIAL_POSITION]);
  const [errorFactor, setErrorFactor] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        moveCharacter(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [actualPosition, estimatedPosition, errorFactor]);

  const moveCharacter = (direction: string) => {
    const newActualPosition = { ...actualPosition };
    const newEstimatedPosition = { ...estimatedPosition };

    switch (direction) {
      case "ArrowUp":
        newActualPosition.y = Math.max(0, newActualPosition.y - 1);
        newEstimatedPosition.y = Math.max(0, newEstimatedPosition.y - 1 + (Math.random() - 0.5) * errorFactor);
        break;
      case "ArrowDown":
        newActualPosition.y = Math.min(GRID_SIZE - 1, newActualPosition.y + 1);
        newEstimatedPosition.y = Math.min(GRID_SIZE - 1, newEstimatedPosition.y + 1 + (Math.random() - 0.5) * errorFactor);
        break;
      case "ArrowLeft":
        newActualPosition.x = Math.max(0, newActualPosition.x - 1);
        newEstimatedPosition.x = Math.max(0, newEstimatedPosition.x - 1 + (Math.random() - 0.5) * errorFactor);
        break;
      case "ArrowRight":
        newActualPosition.x = Math.min(GRID_SIZE - 1, newActualPosition.x + 1);
        newEstimatedPosition.x = Math.min(GRID_SIZE - 1, newEstimatedPosition.x + 1 + (Math.random() - 0.5) * errorFactor);
        break;
    }

    setActualPosition(newActualPosition);
    setEstimatedPosition(newEstimatedPosition);
    setPath([...path, newActualPosition]);
  };

  const resetMaze = () => {
    setActualPosition(INITIAL_POSITION);
    setEstimatedPosition(INITIAL_POSITION);
    setPath([INITIAL_POSITION]);
    setIsRevealed(false);
  };

  const renderGrid = () => {
    return Array(GRID_SIZE).fill(null).map((_, rowIndex) => (
      <div key={rowIndex} className="flex">
        {Array(GRID_SIZE).fill(null).map((_, colIndex) => (
          <div
            key={colIndex}
            className={`w-8 h-8 border border-gray-300 ${
              isRevealed && actualPosition.x === colIndex && actualPosition.y === rowIndex
                ? "bg-blue-500"
                : estimatedPosition.x === colIndex && estimatedPosition.y === rowIndex
                ? "bg-green-500"
                : path.some(p => p.x === colIndex && p.y === rowIndex)
                ? "bg-gray-300"
                : ""
            }`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Path Integration Maze</h2>
      <div className="mb-4">{renderGrid()}</div>
      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => moveCharacter("ArrowUp")}
          className="p-2 bg-blue-500 text-white rounded"
          aria-label="Move Up"
        >
          <ArrowUp />
        </button>
        <button
          onClick={() => moveCharacter("ArrowDown")}
          className="p-2 bg-blue-500 text-white rounded"
          aria-label="Move Down"
        >
          <ArrowDown />
        </button>
        <button
          onClick={() => moveCharacter("ArrowLeft")}
          className="p-2 bg-blue-500 text-white rounded"
          aria-label="Move Left"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={() => moveCharacter("ArrowRight")}
          className="p-2 bg-blue-500 text-white rounded"
          aria-label="Move Right"
        >
          <ArrowRight />
        </button>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsRevealed(!isRevealed)}
          className="p-2 bg-green-500 text-white rounded flex items-center"
        >
          <Eye className="mr-2" /> {isRevealed ? "Hide" : "Reveal"} Actual Position
        </button>
        <button
          onClick={resetMaze}
          className="p-2 bg-gray-500 text-white rounded flex items-center"
        >
          <RefreshCw className="mr-2" /> Reset Maze
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="errorSlider" className="block mb-2">
          Error Factor: {errorFactor.toFixed(2)}
        </label>
        <input
          id="errorSlider"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={errorFactor}
          onChange={(e) => setErrorFactor(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <p className="text-sm">
        Use arrow keys or buttons to navigate. The green square shows your estimated position, while the blue square (when revealed) shows your actual position.
      </p>
    </div>
  );
};

export default PathIntegrationMaze;