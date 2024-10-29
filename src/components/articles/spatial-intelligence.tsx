"use client"
import { useState, useEffect } from "react";
import { Box, Move3d, Boxes, Brain, Robot, Trophy, ArrowRight } from "lucide-react";

interface GameState {
  mode: 'observe' | 'predict' | 'challenge';
  score: number;
  currentPuzzle: number;
  objects: {id: number, x: number, y: number, type: string}[];
  selectedObject: number | null;
}

interface Challenge {
  id: number;
  instruction: string;
  targetConfig: {x: number, y: number}[];
  difficulty: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    instruction: "Arrange furniture for optimal flow",
    targetConfig: [{x: 20, y: 20}, {x: 80, y: 80}],
    difficulty: 1
  },
  {
    id: 2, 
    instruction: "Create efficient robot path",
    targetConfig: [{x: 30, y: 70}, {x: 60, y: 40}],
    difficulty: 2
  }
];

/**
 * SpatialIntelligenceLab - Interactive component teaching spatial intelligence concepts
 * through observation, prediction, and challenges
 */
const SpatialIntelligenceLab = () => {
  const [gameState, setGameState] = useState<GameState>({
    mode: 'observe',
    score: 0,
    currentPuzzle: 0,
    objects: [
      {id: 1, x: 10, y: 10, type: 'chair'},
      {id: 2, x: 50, y: 50, type: 'table'}
    ],
    selectedObject: null
  });

  const [showHint, setShowHint] = useState<boolean>(false);
  const [aiThinking, setAiThinking] = useState<boolean>(false);

  useEffect(() => {
    if (gameState.mode === 'predict') {
      const timer = setTimeout(() => {
        setAiThinking(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.mode]);

  const handleObjectMove = (e: React.MouseEvent<HTMLDivElement>, objectId: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setGameState(prev => ({
      ...prev,
      objects: prev.objects.map(obj => 
        obj.id === objectId ? {...obj, x, y} : obj
      )
    }));
  };

  const switchMode = (mode: 'observe' | 'predict' | 'challenge') => {
    setGameState(prev => ({...prev, mode}));
    setShowHint(false);
    setAiThinking(false);
  };

  const renderMode = () => {
    switch(gameState.mode) {
      case 'observe':
        return (
          <div className="relative h-96 bg-gray-100 rounded-lg p-4">
            <div className="absolute top-2 left-2">
              <Brain className="text-blue-500" />
              <span>Observer Mode</span>
            </div>
            {gameState.objects.map(obj => (
              <div
                key={obj.id}
                className="absolute p-2 bg-blue-200 rounded cursor-move transition-all duration-300"
                style={{left: `${obj.x}%`, top: `${obj.y}%`}}
                onMouseDown={(e) => handleObjectMove(e, obj.id)}
                role="button"
                tabIndex={0}
                aria-label={`Movable ${obj.type}`}
              >
                <Box />
              </div>
            ))}
          </div>
        );
      
      case 'predict':
        return (
          <div className="relative h-96 bg-gray-100 rounded-lg p-4">
            <div className="absolute top-2 left-2">
              <Robot className="text-blue-500" />
              <span>Predictor Mode</span>
            </div>
            {aiThinking && (
              <div className="absolute inset-0 bg-blue-50/50">
                <div className="grid grid-cols-10 grid-rows-10 h-full">
                  {Array(100).fill(0).map((_, i) => (
                    <div 
                      key={i}
                      className="border border-blue-100 transition-colors duration-300"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${Math.random() * 0.5})`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'challenge':
        return (
          <div className="relative h-96 bg-gray-100 rounded-lg p-4">
            <div className="absolute top-2 left-2">
              <Trophy className="text-blue-500" />
              <span>Challenge Mode</span>
            </div>
            <div className="text-center">
              {CHALLENGES[gameState.currentPuzzle].instruction}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => switchMode('observe')}
          className={`px-4 py-2 rounded ${
            gameState.mode === 'observe' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <Brain className="inline mr-2" />
          Observer
        </button>
        <button
          onClick={() => switchMode('predict')}
          className={`px-4 py-2 rounded ${
            gameState.mode === 'predict' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <Robot className="inline mr-2" />
          Predictor
        </button>
        <button
          onClick={() => switchMode('challenge')}
          className={`px-4 py-2 rounded ${
            gameState.mode === 'challenge' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <Trophy className="inline mr-2" />
          Challenge
        </button>
      </div>

      {renderMode()}
    </div>
  );
};

export default SpatialIntelligenceLab;