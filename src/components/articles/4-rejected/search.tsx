"use client"
import { useState, useEffect } from "react";
import { Compass, Map, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Treasure, X } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface Cell {
  isWall: boolean;
  isExplored: boolean;
  isVisible: boolean;
}

type SearchMode = 'explorer' | 'map' | 'guide';

const GRID_SIZE = 8;
const INITIAL_ENERGY = 50;

const createGrid = (): Cell[][] => {
  const grid: Cell[][] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = {
        isWall: Math.random() < 0.2,
        isExplored: false,
        isVisible: false
      };
    }
  }
  grid[0][0].isWall = false;
  grid[GRID_SIZE-1][GRID_SIZE-1].isWall = false;
  return grid;
};

export default function SearchGame() {
  const [grid, setGrid] = useState<Cell[][]>(createGrid());
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [mode, setMode] = useState<SearchMode>('explorer');
  const [energy, setEnergy] = useState(INITIAL_ENERGY);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const updateVisibility = () => {
      const newGrid = grid.map(row => row.map(cell => ({...cell, isVisible: false})));
      
      if (mode === 'map') {
        newGrid.forEach(row => row.forEach(cell => cell.isVisible = true));
      } else if (mode === 'explorer') {
        [-1, 0, 1].forEach(dx => {
          [-1, 0, 1].forEach(dy => {
            const newX = position.x + dx;
            const newY = position.y + dy;
            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
              newGrid[newX][newY].isVisible = true;
            }
          });
        });
      } else if (mode === 'guide') {
        const distance = Math.abs(GRID_SIZE-1 - position.x) + Math.abs(GRID_SIZE-1 - position.y);
        [-2, -1, 0, 1, 2].forEach(dx => {
          [-2, -1, 0, 1, 2].forEach(dy => {
            const newX = position.x + dx;
            const newY = position.y + dy;
            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
              newGrid[newX][newY].isVisible = Math.random() < (1 - distance/(GRID_SIZE*2));
            }
          });
        });
      }
      setGrid(newGrid);
    };

    updateVisibility();
  }, [position, mode]);

  const move = (dx: number, dy: number) => {
    const newX = position.x + dx;
    const newY = position.y + dy;
    
    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE && !grid[newX][newY].isWall && energy > 0) {
      setPosition({ x: newX, y: newY });
      setEnergy(prev => prev - 1);
      setMoves(prev => prev + 1);
      
      const newGrid = [...grid];
      newGrid[newX][newY].isExplored = true;
      setGrid(newGrid);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch(e.key) {
      case 'ArrowUp': move(-1, 0); break;
      case 'ArrowDown': move(1, 0); break;
      case 'ArrowLeft': move(0, -1); break;
      case 'ArrowRight': move(0, 1); break;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('explorer')}
          className={`p-2 rounded ${mode === 'explorer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-pressed={mode === 'explorer'}
        >
          <Eye className="w-6 h-6" />
        </button>
        <button
          onClick={() => setMode('map')}
          className={`p-2 rounded ${mode === 'map' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-pressed={mode === 'map'}
        >
          <Map className="w-6 h-6" />
        </button>
        <button
          onClick={() => setMode('guide')}
          className={`p-2 rounded ${mode === 'guide' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-pressed={mode === 'guide'}
        >
          <Compass className="w-6 h-6" />
        </button>
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
        {grid.map((row, x) => row.map((cell, y) => (
          <div
            key={`${x}-${y}`}
            className={`w-12 h-12 border ${
              cell.isVisible ? (cell.isWall ? 'bg-gray-500' : 'bg-white') : 'bg-gray-800'
            } ${position.x === x && position.y === y ? 'bg-blue-500' : ''} 
            ${x === GRID_SIZE-1 && y === GRID_SIZE-1 ? 'bg-green-500' : ''}`}
            aria-label={`Cell ${x},${y}`}
          />
        )))}
      </div>

      <div className="flex gap-4 mt-4">
        <div>Moves: {moves}</div>
        <div>Energy: {energy}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => move(-1, 0)} className="p-2 bg-gray-200 rounded"><ChevronUp /></button>
        <button onClick={() => move(0, -1)} className="p-2 bg-gray-200 rounded"><ChevronLeft /></button>
        <button onClick={() => move(0, 1)} className="p-2 bg-gray-200 rounded"><ChevronRight /></button>
        <button onClick={() => move(1, 0)} className="p-2 bg-gray-200 rounded"><ChevronDown /></button>
      </div>
    </div>
  );
}