"use client"
import { useState, useEffect } from "react";
import { Mountain, Map, Navigation, Footprints, Compass, Cloud, Trophy } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface HeuristicRule {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
}

const GRID_SIZE = 10;
const VISIBILITY_RADIUS = 2;

const HEURISTIC_RULES: HeuristicRule[] = [
  {
    id: "up",
    name: "Always Up",
    icon: <Mountain className="w-6 h-6" />,
    description: "Climb in the steepest direction"
  },
  {
    id: "path",
    name: "Follow Path",
    icon: <Footprints className="w-6 h-6" />,
    description: "Follow established trails"
  },
  {
    id: "compass",
    name: "Use Compass",
    icon: <Compass className="w-6 h-6" />,
    description: "Navigate with tools"
  }
];

const HeuristicMountaineer = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [selectedRule, setSelectedRule] = useState<string>("up");
  const [isClimbing, setIsClimbing] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(0);
  const [visibility, setVisibility] = useState<boolean[][]>(
    Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false))
  );

  const updateVisibility = (pos: Position) => {
    const newVisibility = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(false)
    );
    
    for (let i = -VISIBILITY_RADIUS; i <= VISIBILITY_RADIUS; i++) {
      for (let j = -VISIBILITY_RADIUS; j <= VISIBILITY_RADIUS; j++) {
        const newX = pos.x + i;
        const newY = pos.y + j;
        if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
          newVisibility[newX][newY] = true;
        }
      }
    }
    setVisibility(newVisibility);
  };

  useEffect(() => {
    updateVisibility(position);
  }, [position]);

  useEffect(() => {
    let climberInterval: NodeJS.Timeout;

    if (isClimbing) {
      climberInterval = setInterval(() => {
        setPosition(prev => {
          const newPos = { ...prev };
          switch (selectedRule) {
            case "up":
              newPos.y = Math.min(prev.y + 1, GRID_SIZE - 1);
              break;
            case "path":
              newPos.x = (prev.x + 1) % GRID_SIZE;
              break;
            case "compass":
              newPos.x = Math.min(prev.x + 1, GRID_SIZE - 1);
              newPos.y = Math.min(prev.y + 1, GRID_SIZE - 1);
              break;
          }
          setSteps(s => s + 1);
          return newPos;
        });
      }, 1000);
    }

    return () => clearInterval(climberInterval);
  }, [isClimbing, selectedRule]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Mountain Climbing Heuristics</h2>
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-gray-500" />
          <span>Steps: {steps}</span>
        </div>
      </div>

      <div className="grid grid-cols-GRID_SIZE gap-1 mb-4 bg-white p-4 rounded">
        {Array(GRID_SIZE).fill(null).map((_, x) => (
          <div key={x} className="flex gap-1">
            {Array(GRID_SIZE).fill(null).map((_, y) => (
              <div
                key={`${x}-${y}`}
                className={`w-8 h-8 rounded ${
                  x === position.x && y === position.y
                    ? "bg-blue-500"
                    : visibility[x]?.[y]
                    ? "bg-gray-200"
                    : "bg-gray-400"
                }`}
                role="grid-cell"
                aria-label={`Position ${x},${y}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        {HEURISTIC_RULES.map(rule => (
          <button
            key={rule.id}
            onClick={() => setSelectedRule(rule.id)}
            className={`flex items-center gap-2 p-2 rounded ${
              selectedRule === rule.id ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            aria-pressed={selectedRule === rule.id}
          >
            {rule.icon}
            <span>{rule.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => setIsClimbing(!isClimbing)}
        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        aria-label={isClimbing ? "Stop climbing" : "Start climbing"}
      >
        {isClimbing ? "Stop" : "Start"} Climbing
      </button>
    </div>
  );
};

export default HeuristicMountaineer;