"use client"
import { useState, useEffect } from "react";
import { Robot, ArrowRight, ArrowDown, ArrowUp, ArrowLeft, Target, Battery, Diamond, HelpCircle, Brain } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface GridCell {
  reward: number;
  isWall: boolean;
  isGoal: boolean;
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const GRID_SIZE = 5;
const LEARNING_RATE = 0.1;
const ACTIONS = ["up", "right", "down", "left"];

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute z-10 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg -top-full left-1/2 transform -translate-x-1/2 pointer-events-none">
      {text}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
    </div>
  </div>
);

const QlearningVisualizer = () => {
  const [agentPos, setAgentPos] = useState<Position>({ x: 0, y: 4 });
  const [isLearning, setIsLearning] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [episodes, setEpisodes] = useState(0);
  const [path, setPath] = useState<Position[]>([]);
  const [rewardTotal, setRewardTotal] = useState(0);

  const grid: GridCell[][] = Array(GRID_SIZE).fill(null).map((_, i) => 
    Array(GRID_SIZE).fill(null).map((_, j) => ({
      reward: -1,
      isWall: (i === 2 && j === 2) || (i === 1 && j === 1),
      isGoal: i === 0 && j === 4
    }))
  );

  const moveAgent = (direction: string) => {
    setAgentPos(prev => {
      const newPos = { ...prev };
      switch (direction) {
        case "up": newPos.y = Math.max(0, prev.y - 1); break;
        case "right": newPos.x = Math.min(GRID_SIZE - 1, prev.x + 1); break;
        case "down": newPos.y = Math.min(GRID_SIZE - 1, prev.y + 1); break;
        case "left": newPos.x = Math.max(0, prev.x - 1); break;
      }
      if (grid[newPos.y][newPos.x].isWall) return prev;
      setRewardTotal(prev => prev + grid[newPos.y][newPos.x].reward);
      return newPos;
    });
  };

  useEffect(() => {
    if (!isLearning) return;
    const interval = setInterval(() => {
      const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      moveAgent(randomAction);
      setEnergy(prev => Math.max(0, prev - 1));
      setPath(prev => [...prev, agentPos]);
      
      if (grid[agentPos.y][agentPos.x].isGoal) {
        setEpisodes(prev => prev + 1);
        setAgentPos({ x: 0, y: 4 });
        setEnergy(100);
        setPath([]);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isLearning, agentPos]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-4 md:p-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400">Q-Learning Explorer</h1>
          <Tooltip text="Q-Learning is a reinforcement learning algorithm where an agent learns to make decisions by receiving rewards for its actions.">
            <HelpCircle className="w-6 h-6 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
        <p className="text-gray-300 max-w-md px-4">
          Watch our AI agent learn to navigate through obstacles and find the optimal path to the treasure!
        </p>
      </div>

      <div className="relative bg-gray-700/50 backdrop-blur-sm p-4 md:p-8 rounded-xl shadow-2xl border border-gray-600">
        <div className="grid grid-cols-5 gap-1 md:gap-2">
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-lg transition-all duration-300 
                  ${cell.isWall ? 'bg-gray-800/80' : 'bg-gray-600/50'} 
                  ${cell.isGoal ? 'bg-green-500/20 animate-pulse' : ''}`}
              >
                {agentPos.x === x && agentPos.y === y && (
                  <Robot className="w-6 h-6 md:w-8 md:h-8 text-blue-400 animate-bounce" />
                )}
                {cell.isGoal && <Diamond className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />}
                {cell.isWall && <div className="w-full h-full bg-gray-800/80 rounded-lg" />}
              </div>
            ))
          )}
        </div>

        {path.map((pos, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-400/30"
            style={{
              left: `${(pos.x * 4.25) + 2.5}rem`,
              top: `${(pos.y * 4.25) + 2.5}rem`,
            }}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <Tooltip text="Battery level represents remaining moves before reset">
          <div className="flex items-center gap-2">
            <Battery className="text-green-400" />
            <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all duration-300"
                style={{ width: `${energy}%` }}
              />
            </div>
          </div>
        </Tooltip>

        <button
          onClick={() => setIsLearning(!isLearning)}
          className={`px-6 py-3 rounded-full font-bold transition-all duration-300 
            ${isLearning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          {isLearning ? 'Stop Learning' : 'Start Learning'}
        </button>

        <div className="flex gap-4 text-gray-300">
          <Tooltip text="Number of successful path completions">
            <div>Episodes: <span className="text-blue-400 font-bold">{episodes}</span></div>
          </Tooltip>
          <Tooltip text="Total rewards accumulated">
            <div>Score: <span className="text-green-400 font-bold">{rewardTotal}</span></div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default QlearningVisualizer;