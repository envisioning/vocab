"use client"
import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, RefreshCw } from "lucide-react";

interface Cell {
    isWall: boolean;
    isVisible: boolean;
    isPath: boolean;
}

interface Position {
    x: number;
    y: number;
}

const GRID_SIZE = 10;
const VISIBILITY_RADIUS = 2;

const generateMaze = (): Cell[][] => {
    const maze: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
        Array(GRID_SIZE).fill(null).map(() => ({
            isWall: Math.random() < 0.3,
            isVisible: false,
            isPath: false
        }))
    );
    maze[0][0].isWall = false;
    maze[GRID_SIZE-1][GRID_SIZE-1].isWall = false;
    return maze;
};

export default function FogNavigator() {
    const [maze, setMaze] = useState<Cell[][]>(generateMaze());
    const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
    const [showAll, setShowAll] = useState<boolean>(false);
    const [moves, setMoves] = useState<number>(0);
    const [bestScore, setBestScore] = useState<number | null>(null);

    useEffect(() => {
        const updateVisibility = () => {
            const newMaze = maze.map((row, y) =>
                row.map((cell, x) => ({
                    ...cell,
                    isVisible: showAll || 
                        (Math.abs(x - playerPos.x) <= VISIBILITY_RADIUS &&
                         Math.abs(y - playerPos.y) <= VISIBILITY_RADIUS)
                }))
            );
            setMaze(newMaze);
        };
        updateVisibility();
    }, [playerPos, showAll]);

    const handleMove = (dx: number, dy: number) => {
        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (
            newX >= 0 && newX < GRID_SIZE &&
            newY >= 0 && newY < GRID_SIZE &&
            !maze[newY][newX].isWall
        ) {
            setPlayerPos({ x: newX, y: newY });
            setMoves(moves + 1);

            if (newX === GRID_SIZE-1 && newY === GRID_SIZE-1) {
                if (!bestScore || moves + 1 < bestScore) {
                    setBestScore(moves + 1);
                }
            }
        }
    };

    const resetGame = () => {
        setMaze(generateMaze());
        setPlayerPos({ x: 0, y: 0 });
        setMoves(0);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 max-w-2xl mx-auto">
            <div className="text-lg font-semibold mb-2">
                The Fog Navigator: Information Gap Challenge
            </div>
            
            <div className="grid grid-cols-10 gap-1 bg-gray-100 p-4 rounded-lg">
                {maze.map((row, y) =>
                    row.map((cell, x) => (
                        <div
                            key={`${x}-${y}`}
                            className={`
                                w-8 h-8 rounded-sm transition-all duration-300
                                ${!cell.isVisible ? 'bg-gray-600' :
                                  cell.isWall ? 'bg-gray-800' :
                                  playerPos.x === x && playerPos.y === y ? 'bg-blue-500' :
                                  x === GRID_SIZE-1 && y === GRID_SIZE-1 ? 'bg-green-500' :
                                  'bg-white'}
                            `}
                            role="gridcell"
                            aria-label={`Cell ${x},${y}`}
                        />
                    ))
                )}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                    onClick={() => handleMove(0, -1)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    aria-label="Move up"
                >
                    <ChevronUp />
                </button>
                <button
                    onClick={() => handleMove(0, 1)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    aria-label="Move down"
                >
                    <ChevronDown />
                </button>
                <button
                    onClick={() => handleMove(-1, 0)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    aria-label="Move left"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={() => handleMove(1, 0)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    aria-label="Move right"
                >
                    <ChevronRight />
                </button>
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    aria-label="Toggle visibility"
                >
                    {showAll ? <EyeOff /> : <Eye />}
                </button>
                <button
                    onClick={resetGame}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    aria-label="Reset game"
                >
                    <RefreshCw />
                </button>
            </div>

            <div className="mt-4 text-center">
                <div>Moves: {moves}</div>
                {bestScore && <div>Best Score: {bestScore}</div>}
            </div>
        </div>
    );
}