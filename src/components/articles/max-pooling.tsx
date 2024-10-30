"use client"
import { useState, useEffect } from "react";
import { Mountain, Trophy, GraduationCap, ArrowRight, RefreshCw } from "lucide-react";

interface MaxPoolingProps {}

type ThemeType = "mountains" | "athletes" | "students";
type GridCell = { value: number; isSelected: boolean; isHighlighted: boolean };

const THEMES: Record<ThemeType, { icon: JSX.Element; label: string }> = {
  mountains: { icon: <Mountain className="w-5 h-5" />, label: "Mountain Heights" },
  athletes: { icon: <Trophy className="w-5 h-5" />, label: "Athlete Jumps" },
  students: { icon: <GraduationCap className="w-5 h-5" />, label: "Test Scores" }
};

const generateGrid = (size: number): GridCell[][] => {
  return Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => ({
      value: Math.floor(Math.random() * 10),
      isSelected: false,
      isHighlighted: false
    }))
  );
};

const MaxPooling: React.FC<MaxPoolingProps> = () => {
  const [theme, setTheme] = useState<ThemeType>("mountains");
  const [grid, setGrid] = useState<GridCell[][]>(generateGrid(6));
  const [outputGrid, setOutputGrid] = useState<number[][]>([]);
  const [currentWindow, setCurrentWindow] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const highlightCurrentWindow = () => {
      const newGrid = grid.map((row, i) =>
        row.map((cell, j) => ({
          ...cell,
          isHighlighted: 
            i >= currentWindow.row && 
            i < currentWindow.row + 2 && 
            j >= currentWindow.col && 
            j < currentWindow.col + 2
        }))
      );
      setGrid(newGrid);
    };

    highlightCurrentWindow();
  }, [currentWindow]);

  const handleMaxSelection = () => {
    const window = grid
      .slice(currentWindow.row, currentWindow.row + 2)
      .map(row => row.slice(currentWindow.col, currentWindow.col + 2));
    
    const maxValue = Math.max(...window.flat().map(cell => cell.value));
    const newOutputGrid = [...outputGrid];
    const outputRow = Math.floor(currentWindow.row / 2);
    const outputCol = Math.floor(currentWindow.col / 2);
    
    if (!newOutputGrid[outputRow]) newOutputGrid[outputRow] = [];
    newOutputGrid[outputRow][outputCol] = maxValue;
    
    setOutputGrid(newOutputGrid);
    setScore(prev => prev + 1);

    if (currentWindow.col + 2 < grid[0].length) {
      setCurrentWindow(prev => ({ ...prev, col: prev.col + 2 }));
    } else if (currentWindow.row + 2 < grid.length) {
      setCurrentWindow({ row: currentWindow.row + 2, col: 0 });
    }
  };

  const resetGame = () => {
    setGrid(generateGrid(6));
    setOutputGrid([]);
    setCurrentWindow({ row: 0, col: 0 });
    setScore(0);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex gap-4 mb-4">
        {Object.entries(THEMES).map(([key, { icon, label }]) => (
          <button
            key={key}
            onClick={() => setTheme(key as ThemeType)}
            className={`flex items-center gap-2 p-2 rounded ${
              theme === key ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            aria-pressed={theme === key}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="grid grid-cols-6 gap-1">
          {grid.map((row, i) => 
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`h-12 flex items-center justify-center rounded ${
                  cell.isHighlighted ? 'bg-blue-200' : 'bg-gray-100'
                }`}
              >
                {cell.value}
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-3 gap-1">
          {outputGrid.map((row, i) =>
            row.map((value, j) => (
              <div
                key={`output-${i}-${j}`}
                className="h-12 flex items-center justify-center bg-green-100 rounded"
              >
                {value}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleMaxSelection}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          aria-label="Find maximum value"
        >
          Find Max <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={resetGame}
          className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2"
          aria-label="Reset game"
        >
          Reset <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MaxPooling;