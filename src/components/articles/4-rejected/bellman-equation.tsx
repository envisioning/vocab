"use client"

import { useState, useEffect } from "react";
import { Map, Navigation, ArrowRight, ArrowDown, ArrowLeft, ArrowUp, RefreshCw } from "lucide-react";

interface ComponentProps {}

type Intersection = {
  id: number;
  x: number;
  y: number;
  reward: number;
};

type Action = "up" | "down" | "left" | "right";

const GRID_SIZE = 5;
const DISCOUNT_FACTOR = 0.9;

const INTERSECTIONS: Intersection[] = [
  { id: 0, x: 0, y: 0, reward: 0 },
  { id: 1, x: 2, y: 0, reward: 10 },
  { id: 2, x: 4, y: 0, reward: 0 },
  { id: 3, x: 0, y: 2, reward: 5 },
  { id: 4, x: 2, y: 2, reward: -5 },
  { id: 5, x: 4, y: 2, reward: 5 },
  { id: 6, x: 0, y: 4, reward: 0 },
  { id: 7, x: 2, y: 4, reward: 20 },
  { id: 8, x: 4, y: 4, reward: 0 },
];

/**
 * BellmanExplorer: An interactive component to teach the Bellman Equation
 * through a GPS navigation metaphor.
 */
const BellmanExplorer: React.FC<ComponentProps> = () => {
  const [currentIntersection, setCurrentIntersection] = useState<number>(0);
  const [path, setPath] = useState<number[]>([0]);
  const [totalReward, setTotalReward] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        const nextAction = getBestAction(currentIntersection);
        handleMove(nextAction);
      }, 1500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoPlaying, currentIntersection]);

  const getBestAction = (intersectionId: number): Action => {
    const current = INTERSECTIONS[intersectionId];
    const actions: Action[] = ["up", "down", "left", "right"];
    let bestAction: Action = "up";
    let maxValue = -Infinity;

    actions.forEach((action) => {
      const nextIntersection = getNextIntersection(current, action);
      if (nextIntersection) {
        const value = nextIntersection.reward + DISCOUNT_FACTOR * maxValue;
        if (value > maxValue) {
          maxValue = value;
          bestAction = action;
        }
      }
    });

    return bestAction;
  };

  const getNextIntersection = (current: Intersection, action: Action): Intersection | null => {
    const { x, y } = current;
    let nextX = x;
    let nextY = y;

    switch (action) {
      case "up":
        nextY = Math.max(0, y - 1);
        break;
      case "down":
        nextY = Math.min(GRID_SIZE - 1, y + 1);
        break;
      case "left":
        nextX = Math.max(0, x - 1);
        break;
      case "right":
        nextX = Math.min(GRID_SIZE - 1, x + 1);
        break;
    }

    return INTERSECTIONS.find((i) => i.x === nextX && i.y === nextY) || null;
  };

  const handleMove = (action: Action) => {
    const current = INTERSECTIONS[currentIntersection];
    const next = getNextIntersection(current, action);

    if (next) {
      setCurrentIntersection(next.id);
      setPath((prevPath) => [...prevPath, next.id]);
      setTotalReward((prevReward) => prevReward + next.reward);
    }
  };

  const handleReset = () => {
    setCurrentIntersection(0);
    setPath([0]);
    setTotalReward(0);
    setIsAutoPlaying(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Bellman Explorer: GPS Navigation</h2>
      <div className="grid grid-cols-5 gap-4 mb-4">
        {INTERSECTIONS.map((intersection) => (
          <div
            key={intersection.id}
            className={`h-20 flex items-center justify-center rounded-lg ${
              currentIntersection === intersection.id ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            <span className="font-bold">{intersection.reward}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className="p-2 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => handleMove("up")}
          aria-label="Move up"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <button
          className="p-2 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => handleMove("down")}
          aria-label="Move down"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
        <button
          className="p-2 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => handleMove("left")}
          aria-label="Move left"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          className="p-2 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => handleMove("right")}
          aria-label="Move right"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isAutoPlaying ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        >
          {isAutoPlaying ? "Stop Auto" : "Start Auto"}
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleReset}
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <p className="font-bold mb-2">Total Reward: {totalReward}</p>
        <p className="font-bold">Path: {path.join(" -> ")}</p>
      </div>
    </div>
  );
};

export default BellmanExplorer;