"use client"
import { useState, useEffect } from "react";
import { Target, Bot, RefreshCw, Sun, Moon, Info, ChevronDown } from "lucide-react";

interface Cell {
  isWall: boolean;
  isPath: boolean;
  isVisited: boolean;
  fScore?: number;  // Total estimated cost
  gScore?: number;  // Cost from start
  hScore?: number;  // Heuristic cost to goal
}

interface Position {
  x: number;
  y: number;
}

interface Node {
  pos: Position;
  g: number;  // Cost from start
  h: number;  // Heuristic (estimated) cost to goal
  f: number;  // Total cost (g + h)
  parent: Position | null;
}

interface InfoAccordionProps {
  title: string;
}

const InfoAccordion = ({ title }: InfoAccordionProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(0);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef) {
      setHeight(isOpen ? contentRef.scrollHeight : 0);
    }
  }, [isOpen, contentRef]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg shadow-sm overflow-hidden my-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100/50 dark:hover:bg-blue-800/30 transition-colors duration-300"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={16}
        />
      </button>
      
      <div
        style={{ height: `${height}px` }}
        className="transition-all duration-300 ease-in-out"
      >
        <div ref={setContentRef} className="px-4 pb-4 text-xs">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            The AI evaluates each possible move by combining two key pieces of information:
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-200">
            <li className="flex items-start">
              <div className="h-5 w-1 bg-green-400 rounded-full mr-2 mt-1" />
              <div>
                <span className="font-semibold">Known Cost (g-score):</span>
                <span className="ml-1">How far it has traveled from the start</span>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-1 bg-blue-400 rounded-full mr-2 mt-1" />
              <div>
                <span className="font-semibold">Estimated Cost (h-score):</span>
                <span className="ml-1">Predicted distance to the goal</span>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-1 bg-purple-400 rounded-full mr-2 mt-1" />
              <div>
                <span className="font-semibold">Total Score (f-score):</span>
                <span className="ml-1">Combined knowledge (g + h) used to make the best decision</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const GRID_SIZE = 8;
const DIRECTIONS = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
];

const AIGoalMaze = () => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [start] = useState<Position>({ x: 0, y: 0 });
  const [goal] = useState<Position>({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });
  const [currentPos, setCurrentPos] = useState<Position>({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [path, setPath] = useState<Position[]>([]);
  const [pathIndex, setPathIndex] = useState<number>(0);
  const [showCosts, setShowCosts] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Manhattan distance heuristic
  const manhattan = (pos1: Position, pos2: Position): number => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  };

  const findPath = (startPos: Position, goalPos: Position, mazeGrid: Cell[][]): Position[] => {
    const openSet: Node[] = [];
    const closedSet = new Set<string>();
    const cameFrom = new Map<string, Position>();
    
    // Initialize grid scores
    const gridScores = mazeGrid.map(row => row.map(cell => ({
      ...cell,
      fScore: Infinity,
      gScore: Infinity,
      hScore: Infinity
    })));
    
    // Initialize start node
    openSet.push({
      pos: startPos,
      g: 0,
      h: manhattan(startPos, goalPos),
      f: manhattan(startPos, goalPos),
      parent: null
    });
    gridScores[startPos.y][startPos.x].gScore = 0;
    gridScores[startPos.y][startPos.x].hScore = manhattan(startPos, goalPos);
    gridScores[startPos.y][startPos.x].fScore = manhattan(startPos, goalPos);

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      const posKey = `${current.pos.x},${current.pos.y}`;

      if (current.pos.x === goalPos.x && current.pos.y === goalPos.y) {
        // Reconstruct path
        const path: Position[] = [];
        let currentPos = current.pos;
        while (cameFrom.has(`${currentPos.x},${currentPos.y}`)) {
          path.unshift(currentPos);
          currentPos = cameFrom.get(`${currentPos.x},${currentPos.y}`)!;
        }
        path.unshift(startPos);
        setMaze(gridScores);
        return path;
      }

      closedSet.add(posKey);

      for (const dir of DIRECTIONS) {
        const neighborPos = {
          x: current.pos.x + dir.x,
          y: current.pos.y + dir.y
        };

        if (
          neighborPos.x < 0 || neighborPos.x >= GRID_SIZE ||
          neighborPos.y < 0 || neighborPos.y >= GRID_SIZE ||
          gridScores[neighborPos.y][neighborPos.x].isWall ||
          closedSet.has(`${neighborPos.x},${neighborPos.y}`)
        ) {
          continue;
        }

        const g = current.g + 1;
        const h = manhattan(neighborPos, goalPos);
        const f = g + h;

        gridScores[neighborPos.y][neighborPos.x].gScore = g;
        gridScores[neighborPos.y][neighborPos.x].hScore = h;
        gridScores[neighborPos.y][neighborPos.x].fScore = f;

        const neighborNode: Node = {
          pos: neighborPos,
          g,
          h,
          f,
          parent: current.pos
        };

        const neighborKey = `${neighborPos.x},${neighborPos.y}`;
        if (!closedSet.has(neighborKey)) {
          cameFrom.set(neighborKey, current.pos);
          openSet.push(neighborNode);
        }
      }
    }

    return []; // No path found
  };

  // Part #02 - Functions remain the same
  const generateMaze = () => {
    const newMaze: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        isWall: Math.random() < 0.3,
        isPath: false,
        isVisited: false,
      }))
    );
    
    newMaze[start.y][start.x].isWall = false;
    newMaze[goal.y][goal.x].isWall = false;
    
    const foundPath = findPath(start, goal, newMaze);
    
    if (foundPath.length === 0) {
      let current = { ...start };
      while (current.x !== goal.x || current.y !== goal.y) {
        if (current.x < goal.x) {
          current.x++;
        } else if (current.y < goal.y) {
          current.y++;
        }
        newMaze[current.y][current.x].isWall = false;
      }
    }

    setMaze(newMaze);
    setCurrentPos({ ...start });
    setPathIndex(0);
    
    const pathToGoal = findPath(start, goal, newMaze);
    setPath(pathToGoal);
  };

  const handleRestart = () => {
    generateMaze();
    setIsPaused(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleCosts = () => {
    setShowCosts(!showCosts);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    generateMaze();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (path.length === 0 || pathIndex >= path.length || isPaused) return;

    const interval = setInterval(() => {
      setPathIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        if (newIndex < path.length) {
          const newPos = path[newIndex];
          setCurrentPos(newPos);
          
          const newMaze = [...maze];
          newMaze[newPos.y][newPos.x].isVisited = true;
          setMaze(newMaze);
        }
        return newIndex;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [path, pathIndex, maze, isPaused]);

  const baseClasses = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900";

  // Part #03 - Updated Return with Accordion
  return (
    <div className={`p-4 rounded-lg shadow-lg ${baseClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Goal-Driven AI in Action</h2>
        <div className="flex gap-2">
          <button
            onClick={toggleCosts}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle cost display"
          >
            <Info size={20} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={togglePause}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Pause/Resume"
          >
            {isPaused ? "▶️" : "⏸️"}
          </button>
          <button
            onClick={handleRestart}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Generate new maze"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`
                aspect-square rounded-sm relative
                ${cell.isWall ? "bg-gray-800 dark:bg-gray-600" : "bg-blue-100 dark:bg-blue-900"}
                ${cell.isVisited ? "bg-green-200 dark:bg-green-800" : ""}
                ${currentPos.x === x && currentPos.y === y ? "bg-blue-500" : ""}
              `}
            >
              {x === start.x && y === start.y && <Bot className="w-full h-full p-1" />}
              {x === goal.x && y === goal.y && <Target className="w-full h-full p-1" />}
              {showCosts && !cell.isWall && cell.fScore !== undefined && cell.gScore !== undefined && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[0.6rem]">
                  <span>f={cell.fScore.toFixed(0)}</span>
                  <span>g={cell.gScore.toFixed(0)}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 text-sm space-y-2">
        <p className="font-bold">Understanding AI Goals through Pathfinding</p>
        <p>This visualization demonstrates how AI systems pursue goals intelligently. Just like how we might navigate a maze, the AI has a clear objective: reach the target while finding the most efficient path.</p>
        
        <InfoAccordion title="How does our AI find the best path?" />
        
        <div className="space-y-2">
          <p className="mt-2">The explainer mirrors how AI systems work in general:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>They have a clear goal (reach the target)</li>
            <li>They use both current information and future predictions</li>
            <li>They make decisions by evaluating multiple options</li>
            <li>They adapt their path as they discover new information</li>
          </ul>
        </div>
        
        <p className="mt-2 italic">💡 Toggle the info button to see how the AI evaluates each position in real-time!</p>
      </div>
    </div>
  );
};

export default AIGoalMaze;