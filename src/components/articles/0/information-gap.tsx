"use client"
import { useState, useEffect } from "react";
import { 
    ChevronUp, 
    ChevronDown, 
    ChevronLeft, 
    ChevronRight, 
    Eye, 
    EyeOff, 
    RefreshCw,
    Sun,
    Moon
} from "lucide-react";

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
    maze[GRID_SIZE - 1][GRID_SIZE - 1].isWall = false;
    return maze;
};

export default function FogNavigator() {
    const [maze, setMaze] = useState<Cell[][]>(generateMaze());
    const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
    const [showAll, setShowAll] = useState<boolean>(false);
    const [moves, setMoves] = useState<number>(0);
    const [bestScore, setBestScore] = useState<number | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeQuery.matches);

        const updateTheme = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };

        darkModeQuery.addEventListener('change', updateTheme);
        return () => darkModeQuery.removeEventListener('change', updateTheme);
    }, []);

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

            if (newX === GRID_SIZE - 1 && newY === GRID_SIZE - 1 && (!bestScore || moves + 1 < bestScore)) {
                setBestScore(moves + 1);
            }
        }
    };

    const resetGame = () => {
        setMaze(generateMaze());
        setPlayerPos({ x: 0, y: 0 });
        setMoves(0);
    };

    return (
        <div className={`flex flex-col items-center gap-4 p-4 max-w-2xl mx-auto transition-colors duration-300 
            ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-center px-4">
                The Fog Navigator: Information Gap Challenge
            </div>

            <div className={`grid grid-cols-10 gap-0.5 sm:gap-1 p-2 sm:p-4 rounded-lg
                ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {maze.map((row, y) =>
                    row.map((cell, x) => (
                        <div
                            key={`${x}-${y}`}
                            className={`
                                w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-sm transition-all duration-300
                                ${!cell.isVisible ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-600') :
                                    cell.isWall ? (isDarkMode ? 'bg-gray-950' : 'bg-gray-800') :
                                        playerPos.x === x && playerPos.y === y ? 'bg-blue-500' :
                                            x === GRID_SIZE - 1 && y === GRID_SIZE - 1 ? 'bg-green-500' :
                                                (isDarkMode ? 'bg-gray-600' : 'bg-white')}
                            `}
                            role="gridcell"
                            aria-label={`Cell ${x},${y}`}
                        />
                    ))
                )}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 sm:mt-4">
                <button
                    onClick={() => handleMove(0, -1)}
                    className={`p-2 rounded hover:opacity-90 transition-opacity
                        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
                    aria-label="Move up"
                >
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                    onClick={() => handleMove(0, 1)}
                    className={`p-2 rounded hover:opacity-90 transition-opacity
                        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
                    aria-label="Move down"
                >
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                    onClick={() => handleMove(-1, 0)}
                    className={`p-2 rounded hover:opacity-90 transition-opacity
                        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
                    aria-label="Move left"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                    onClick={() => handleMove(1, 0)}
                    className={`p-2 rounded hover:opacity-90 transition-opacity
                        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
                    aria-label="Move right"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                    onClick={() => setShowAll(!showAll)}
                    className={`p-2 rounded hover:opacity-90 transition-opacity
                        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
                    aria-label="Toggle visibility"
                >
                    {showAll ? 
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    }
                </button>
                <button
                    onClick={resetGame}
                    className={`p-2 rounded hover:opacity-90 transition-opacity
                        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
                    aria-label="Reset game"
                >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>

            <div className="mt-2 sm:mt-4 text-center text-sm sm:text-base">
                <div>Moves: {moves}</div>
                {bestScore && <div>Best Score: {bestScore}</div>}
            </div>
        </div>
    );
}