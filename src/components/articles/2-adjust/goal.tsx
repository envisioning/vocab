"use client"
import { useState, useEffect } from "react";
import { Sun, Cloud, Robot, Plant, Target, Trash2 } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface Entity {
  id: string;
  type: 'robot' | 'plant';
  position: Position;
  path: Position[];
}

interface Obstacle {
  id: string;
  position: Position;
}

const GRID_SIZE = 12;
const MOVE_INTERVAL = 1000;

export default function GoalQuestGarden() {
  const [sunPosition, setSunPosition] = useState<Position>({ x: 6, y: 0 });
  const [entities, setEntities] = useState<Entity[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [selectedTool, setSelectedTool] = useState<'robot' | 'plant' | 'cloud' | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setEntities(prev => prev.map(entity => {
        if (!entity.path.length) return entity;
        
        const nextPos = entity.path[0];
        const newPath = entity.path.slice(1);
        
        return {
          ...entity,
          position: nextPos,
          path: newPath
        };
      }));
    }, MOVE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const calculatePath = (start: Position, goal: Position): Position[] => {
    const path: Position[] = [];
    let current = { ...start };
    
    while (current.x !== goal.x || current.y !== goal.y) {
      if (current.x < goal.x) current.x++;
      if (current.x > goal.x) current.x--;
      if (current.y < goal.y) current.y++;
      if (current.y > goal.y) current.y--;
      path.push({ ...current });
    }
    
    return path;
  };

  const handleCellClick = (x: number, y: number) => {
    if (!selectedTool) return;

    if (selectedTool === 'cloud') {
      setObstacles(prev => [...prev, {
        id: `obstacle-${Date.now()}`,
        position: { x, y }
      }]);
    } else {
      const goal = selectedTool === 'plant' ? sunPosition : { x, y };
      const path = calculatePath({ x, y }, goal);
      
      setEntities(prev => [...prev, {
        id: `entity-${Date.now()}`,
        type: selectedTool,
        position: { x, y },
        path
      }]);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedTool('robot')}
          className={`p-2 rounded ${selectedTool === 'robot' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-label="Select robot tool"
        >
          <Robot className="w-6 h-6" />
        </button>
        <button
          onClick={() => setSelectedTool('plant')}
          className={`p-2 rounded ${selectedTool === 'plant' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-label="Select plant tool"
        >
          <Plant className="w-6 h-6" />
        </button>
        <button
          onClick={() => setSelectedTool('cloud')}
          className={`p-2 rounded ${selectedTool === 'cloud' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          aria-label="Select cloud obstacle"
        >
          <Cloud className="w-6 h-6" />
        </button>
        <button
          onClick={() => setEntities([])}
          className="p-2 rounded bg-gray-200"
          aria-label="Clear all"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-1 bg-white p-2 rounded">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          
          return (
            <button
              key={idx}
              onClick={() => handleCellClick(x, y)}
              className="aspect-square border border-gray-200 rounded flex items-center justify-center transition-colors duration-300 hover:bg-gray-50"
              aria-label={`Grid cell ${x},${y}`}
            >
              {x === sunPosition.x && y === sunPosition.y && (
                <Sun className="w-6 h-6 text-yellow-500" />
              )}
              {entities.map(entity => 
                entity.position.x === x && entity.position.y === y && (
                  entity.type === 'robot' ? 
                    <Robot key={entity.id} className="w-6 h-6 text-blue-500" /> :
                    <Plant key={entity.id} className="w-6 h-6 text-green-500" />
                )
              )}
              {obstacles.map(obstacle =>
                obstacle.position.x === x && obstacle.position.y === y && (
                  <Cloud key={obstacle.id} className="w-6 h-6 text-gray-400" />
                )
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}