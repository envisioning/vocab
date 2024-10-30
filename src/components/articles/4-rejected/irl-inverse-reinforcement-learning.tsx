"use client"
import { useState, useEffect } from "react";
import { Cat, Brain, Check, X, RefreshCw } from "lucide-react";

interface Behavior {
  id: number;
  action: string;
  icon: string;
  location: string;
  time: string;
}

interface Reward {
  id: number;
  name: string;
  value: number;
  isDropped: boolean;
}

interface TheoryBoard {
  rewards: Reward[];
  score: number;
}

const BEHAVIORS: Behavior[] = [
  { id: 1, action: "Sleeps near heater", icon: "🛏️", location: "Living room", time: "Morning" },
  { id: 2, action: "Plays with yarn", icon: "🧶", location: "Bedroom", time: "Afternoon" },
  { id: 3, action: "Sits by window", icon: "🪟", location: "Kitchen", time: "Evening" },
];

const INITIAL_REWARDS: Reward[] = [
  { id: 1, name: "Warmth", value: 0, isDropped: false },
  { id: 2, name: "Entertainment", value: 0, isDropped: false },
  { id: 3, name: "Bird watching", value: 0, isDropped: false },
];

export default function PetWhispererSimulator() {
  const [currentBehavior, setCurrentBehavior] = useState<number>(0);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [theoryBoard, setTheoryBoard] = useState<TheoryBoard>({ rewards: [], score: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBehavior((prev) => (prev + 1) % BEHAVIORS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (e: React.DragEvent, reward: Reward) => {
    e.dataTransfer.setData("rewardId", reward.id.toString());
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rewardId = parseInt(e.dataTransfer.getData("rewardId"));
    const reward = rewards.find((r) => r.id === rewardId);
    
    if (reward && !reward.isDropped) {
      setRewards(rewards.map((r) =>
        r.id === rewardId ? { ...r, isDropped: true } : r
      ));
      setTheoryBoard((prev) => ({
        rewards: [...prev.rewards, reward],
        score: calculateScore([...prev.rewards, reward])
      }));
    }
  };

  const calculateScore = (currentRewards: Reward[]): number => {
    const patterns = [
      [1, 2, 3], // Perfect match
      [1, 3, 2], // Alternative good match
      [2, 1, 3], // Another valid pattern
    ];
    
    const rewardPattern = currentRewards.map(r => r.id);
    return patterns.some(p => 
      p.every((id, index) => id === rewardPattern[index])) ? 100 : 50;
  };

  const resetSimulation = () => {
    setRewards(INITIAL_REWARDS);
    setTheoryBoard({ rewards: [], score: 0 });
    setCurrentBehavior(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pet Behavior Analyzer</h2>
        <button
          onClick={resetSimulation}
          className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
          aria-label="Reset simulation"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <Cat className="w-8 h-8 text-blue-500" />
          <div>
            <p className="font-medium">{BEHAVIORS[currentBehavior].action}</p>
            <p className="text-sm text-gray-600">
              {BEHAVIORS[currentBehavior].location} - {BEHAVIORS[currentBehavior].time}
            </p>
          </div>
        </div>
      </div>

      <div
        className="min-h-[200px] p-4 border-2 border-dashed border-gray-300 rounded-lg mb-6"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        aria-label="Theory board"
      >
        <h3 className="text-lg font-medium mb-4">Your Theory Board</h3>
        <div className="flex flex-wrap gap-2">
          {theoryBoard.rewards.map((reward) => (
            <div
              key={reward.id}
              className="px-3 py-2 bg-blue-100 rounded-full text-blue-800"
            >
              {reward.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              draggable={!reward.isDropped}
              onDragStart={(e) => handleDragStart(e, reward)}
              onDragEnd={handleDragEnd}
              className={`px-3 py-2 rounded-full cursor-move transition duration-300 ${
                reward.isDropped
                  ? "bg-gray-200 text-gray-500"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {reward.name}
            </div>
          ))}
        </div>
        
        <div className="flex items-center">
          <Brain className="w-5 h-5 text-blue-500 mr-2" />
          <span className="font-medium">Score: {theoryBoard.score}</span>
        </div>
      </div>
    </div>
  );
}