"use client"
import { useState, useEffect } from "react";
import { Factory, Warehouse, Building2, Router, Play, Pause, RefreshCw, Timer, Zap, Database } from "lucide-react";

interface GridCell {
  type: 'empty' | 'processor' | 'memory' | 'task' | 'route';
  efficiency: number;
}

interface GameState {
  score: number;
  tasks: number;
  energy: number;
  memory: number;
}

const GRID_SIZE = 5;
const INITIAL_ENERGY = 100;
const INITIAL_MEMORY = 100;

const ComputeEfficiencySimulator = () => {
  const [grid, setGrid] = useState<GridCell[][]>(
    Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill({ type: 'empty', efficiency: 0 })
    )
  );
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    tasks: 0,
    energy: INITIAL_ENERGY,
    memory: INITIAL_MEMORY
  });
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTool, setSelectedTool] = useState<GridCell['type']>('empty');

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        energy: Math.max(0, prev.energy - 1),
        tasks: prev.tasks + calculateTaskGeneration(),
        score: prev.score + calculateEfficiencyScore()
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, grid]);

  const calculateTaskGeneration = () => {
    return grid.flat().filter(cell => cell.type === 'task').length;
  };

  const calculateEfficiencyScore = () => {
    const processors = grid.flat().filter(cell => cell.type === 'processor').length;
    const memory = grid.flat().filter(cell => cell.type === 'memory').length;
    return Math.floor((processors * memory) / Math.max(1, gameState.tasks));
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isRunning) {
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = { type: selectedTool, efficiency: 0 };
        return newGrid;
      });
    }
  };

  const resetGame = () => {
    setIsRunning(false);
    setGrid(Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill({ type: 'empty', efficiency: 0 })
    ));
    setGameState({
      score: 0,
      tasks: 0,
      energy: INITIAL_ENERGY,
      memory: INITIAL_MEMORY
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Compute Efficiency Simulator</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            aria-label={isRunning ? "Pause simulation" : "Start simulation"}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={resetGame}
            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            aria-label="Reset simulation"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Timer size={24} /> {gameState.tasks} Tasks
        </div>
        <div className="flex items-center gap-2">
          <Zap size={24} /> {gameState.energy} Energy
        </div>
        <div className="flex items-center gap-2">
          <Database size={24} /> {gameState.memory} Memory
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {grid.map((row, i) => (
          row.map((cell, j) => (
            <button
              key={`${i}-${j}`}
              onClick={() => handleCellClick(i, j)}
              className={`h-20 w-20 border-2 rounded flex items-center justify-center ${
                cell.type === 'empty' ? 'border-gray-300' : 'border-blue-500'
              }`}
              aria-label={`Grid cell ${i},${j} - ${cell.type}`}
            >
              {cell.type === 'processor' && <Factory size={32} />}
              {cell.type === 'memory' && <Warehouse size={32} />}
              {cell.type === 'task' && <Building2 size={32} />}
              {cell.type === 'route' && <Router size={32} />}
            </button>
          ))
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        {['processor', 'memory', 'task', 'route'].map(tool => (
          <button
            key={tool}
            onClick={() => setSelectedTool(tool as GridCell['type'])}
            className={`p-2 rounded ${
              selectedTool === tool ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            aria-label={`Select ${tool} tool`}
          >
            {tool === 'processor' && <Factory size={24} />}
            {tool === 'memory' && <Warehouse size={24} />}
            {tool === 'task' && <Building2 size={24} />}
            {tool === 'route' && <Router size={24} />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComputeEfficiencySimulator;