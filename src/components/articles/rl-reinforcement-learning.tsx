import React, { useState, useEffect } from "react";
import {
  Brain,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Repeat,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReinforcementLearningDemo = () => {
  const [agentPosition, setAgentPosition] = useState({ x: 0, y: 2 });
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [path, setPath] = useState([]);

  const grid = [
    ["⭐", "🌟", "⭐"],
    ["❌", "🎯", "❌"],
    ["🤖", "🌟", "⭐"],
  ];

  const getReward = (x, y) => {
    if (grid[y][x] === "🎯") return 100;
    if (grid[y][x] === "🌟") return 10;
    if (grid[y][x] === "❌") return -50;
    return -1;
  };

  const makeMove = () => {
    const possibleMoves = [
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 }, // down
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 }, // right
    ];

    // Filter valid moves
    const validMoves = possibleMoves.filter((move) => {
      const newX = agentPosition.x + move.dx;
      const newY = agentPosition.y + move.dy;
      return newX >= 0 && newX < 3 && newY >= 0 && newY < 3;
    });

    // Choose move (with some learning bias towards the goal)
    const targetX = 1;
    const targetY = 1;
    const smartMoves = validMoves.filter(
      (move) =>
        Math.abs(agentPosition.x + move.dx - targetX) +
          Math.abs(agentPosition.y + move.dy - targetY) <=
        Math.abs(agentPosition.x - targetX) +
          Math.abs(agentPosition.y - targetY)
    );

    const selectedMove =
      smartMoves.length > 0
        ? smartMoves[Math.floor(Math.random() * smartMoves.length)]
        : validMoves[Math.floor(Math.random() * validMoves.length)];

    const newX = agentPosition.x + selectedMove.dx;
    const newY = agentPosition.y + selectedMove.dy;

    setAgentPosition({ x: newX, y: newY });
    setScore((prev) => prev + getReward(newX, newY));
    setMoves((prev) => prev + 1);
    setPath((prev) => [...prev, { x: newX, y: newY }]);

    // Reset if reached goal or bad state
    if (grid[newY][newX] === "🎯" || grid[newY][newX] === "❌") {
      setTimeout(() => {
        setAgentPosition({ x: 0, y: 2 });
        setPath([]);
      }, 1000);
    }
  };

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(makeMove, 1000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, agentPosition]);

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="text-blue-500" /> Reinforcement Learning in Action
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`h-16 w-16 flex items-center justify-center text-2xl border-2 
                    ${
                      agentPosition.x === x && agentPosition.y === y
                        ? "bg-blue-100"
                        : "bg-white"
                    }
                    ${
                      path.some((p) => p.x === x && p.y === y)
                        ? "border-blue-300"
                        : "border-gray-200"
                    }
                    transition-all duration-300`}
                >
                  {agentPosition.x === x && agentPosition.y === y ? "🤖" : cell}
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              <span className="font-bold">Score: {score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat className="text-green-500" />
              <span className="font-bold">Moves: {moves}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>🤖 Agent learns to reach 🎯 (reward: +100)</p>
            <p>🌟 Bonus points (reward: +10)</p>
            <p>❌ Obstacles (penalty: -50)</p>
            <p>Each move costs -1 point</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReinforcementLearningDemo;
