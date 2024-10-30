"use client"
import { useState, useEffect } from "react";
import { Brain, Navigation, Play, Pause, RotateCcw, Ghost, Box } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface WorldObject {
  id: string;
  position: Position;
  type: "obstacle" | "goal";
}

interface WorldState {
  agentPosition: Position;
  objects: WorldObject[];
  modelAccuracy: number;
}

const GRID_SIZE = 10;
const MOVEMENT_DELAY = 500;

const initialObjects: WorldObject[] = [
  { id: "obs1", position: { x: 3, y: 3 }, type: "obstacle" },
  { id: "obs2", position: { x: 6, y: 6 }, type: "obstacle" },
  { id: "goal", position: { x: 8, y: 8 }, type: "goal" },
];

const WorldModelSimulator = () => {
  const [realWorld, setRealWorld] = useState<WorldState>({
    agentPosition: { x: 0, y: 0 },
    objects: initialObjects,
    modelAccuracy: 1,
  });

  const [modelWorld, setModelWorld] = useState<WorldState>({
    agentPosition: { x: 0, y: 0 },
    objects: initialObjects,
    modelAccuracy: 0.8,
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"explore" | "dream" | "execute">("explore");

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isSimulating) {
      intervalId = setInterval(() => {
        if (currentPhase === "explore") {
          updateExploration();
        } else if (currentPhase === "dream") {
          simulateDream();
        } else {
          executeAction();
        }
      }, MOVEMENT_DELAY);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimulating, currentPhase]);

  const updateExploration = () => {
    setModelWorld(prev => ({
      ...prev,
      modelAccuracy: Math.min(prev.modelAccuracy + 0.1, 0.9),
    }));
    if (modelWorld.modelAccuracy >= 0.9) {
      setCurrentPhase("dream");
    }
  };

  const simulateDream = () => {
    const newPosition = getNextPosition(modelWorld.agentPosition);
    setModelWorld(prev => ({
      ...prev,
      agentPosition: newPosition,
    }));
  };

  const executeAction = () => {
    const newPosition = getNextPosition(realWorld.agentPosition);
    setRealWorld(prev => ({
      ...prev,
      agentPosition: newPosition,
    }));
  };

  const getNextPosition = (currentPos: Position): Position => {
    const possibleMoves = [
      { x: currentPos.x + 1, y: currentPos.y },
      { x: currentPos.x, y: currentPos.y + 1 },
    ].filter(pos => pos.x < GRID_SIZE && pos.y < GRID_SIZE);
    
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentPhase("explore");
    setRealWorld({
      agentPosition: { x: 0, y: 0 },
      objects: initialObjects,
      modelAccuracy: 1,
    });
    setModelWorld({
      agentPosition: { x: 0, y: 0 },
      objects: initialObjects,
      modelAccuracy: 0.8,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex gap-8">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Reality</h2>
          <div className="grid grid-cols-10 gap-1 bg-white p-2 rounded-lg shadow-md">
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);
              return (
                <div
                  key={`real-${idx}`}
                  className="w-8 h-8 border border-gray-200 flex items-center justify-center"
                >
                  {realWorld.agentPosition.x === x && realWorld.agentPosition.y === y && (
                    <Brain className="w-6 h-6 text-blue-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">AI's Mental Model</h2>
          <div className="grid grid-cols-10 gap-1 bg-white/80 p-2 rounded-lg shadow-md">
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);
              return (
                <div
                  key={`model-${idx}`}
                  className="w-8 h-8 border border-gray-200 flex items-center justify-center"
                >
                  {modelWorld.agentPosition.x === x && modelWorld.agentPosition.y === y && (
                    <Ghost className="w-6 h-6 text-blue-500/60" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          aria-label={isSimulating ? "Pause simulation" : "Start simulation"}
        >
          {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isSimulating ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetSimulation}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
          aria-label="Reset simulation"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default WorldModelSimulator;