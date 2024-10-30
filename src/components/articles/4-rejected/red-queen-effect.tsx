"use client"
import { useState, useEffect } from "react";
import { TrendingUp, Heart, RotateCcw, Trophy, AlertCircle } from "lucide-react";

interface ContentStrategy {
  id: number;
  name: string;
  cost: number;
  boost: number;
}

interface TrendingTopic {
  id: number;
  name: string;
  popularity: number;
}

const INITIAL_STRATEGIES: ContentStrategy[] = [
  { id: 1, name: "Create Original Content", cost: 20, boost: 15 },
  { id: 2, name: "Collaborate", cost: 30, boost: 25 },
  { id: 3, name: "Adapt to Trends", cost: 15, boost: 10 },
];

const INITIAL_TOPICS: TrendingTopic[] = [
  { id: 1, name: "Dance Challenges", popularity: 100 },
  { id: 2, name: "Study Tips", popularity: 80 },
  { id: 3, name: "Gaming", popularity: 90 },
];

export default function RedQueenSimulator() {
  const [engagement, setEngagement] = useState<number>(100);
  const [resources, setResources] = useState<number>(100);
  const [topics, setTopics] = useState<TrendingTopic[]>(INITIAL_TOPICS);
  const [selectedStrategy, setSelectedStrategy] = useState<ContentStrategy | null>(null);
  const [gameActive, setGameActive] = useState<boolean>(false);

  useEffect(() => {
    if (!gameActive) return;

    const decayInterval = setInterval(() => {
      setEngagement((prev) => Math.max(0, prev - 5));
      setTopics((prev) =>
        prev.map((topic) => ({
          ...topic,
          popularity: Math.max(0, topic.popularity - Math.random() * 10),
        }))
      );
    }, 2000);

    return () => clearInterval(decayInterval);
  }, [gameActive]);

  const handleStrategySelect = (strategy: ContentStrategy) => {
    if (resources < strategy.cost) return;

    setSelectedStrategy(strategy);
    setResources((prev) => prev - strategy.cost);
    setEngagement((prev) => Math.min(100, prev + strategy.boost));
  };

  const resetGame = () => {
    setEngagement(100);
    setResources(100);
    setTopics(INITIAL_TOPICS);
    setSelectedStrategy(null);
    setGameActive(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <TrendingUp className="text-blue-500" />
        Social Media Evolution Simulator
      </h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" />
            <span className="font-semibold">Engagement: {engagement}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            <span className="font-semibold">Resources: {resources}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold">Trending Topics:</h2>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="px-3 py-1 bg-blue-100 rounded-full text-sm"
                style={{ opacity: topic.popularity / 100 }}
              >
                {topic.name}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-3">Available Strategies:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {INITIAL_STRATEGIES.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => handleStrategySelect(strategy)}
                disabled={resources < strategy.cost}
                className="p-3 border rounded-lg transition-colors duration-300
                         hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium">{strategy.name}</div>
                <div className="text-sm text-gray-600">Cost: {strategy.cost}</div>
              </button>
            ))}
          </div>
        </div>

        {engagement <= 20 && (
          <div className="mt-4 p-3 bg-red-100 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            <span>Your engagement is dropping! Adapt to survive!</span>
          </div>
        )}

        <button
          onClick={resetGame}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg
                   hover:bg-blue-600 transition-colors duration-300"
        >
          <RotateCcw size={16} />
          Reset Simulation
        </button>
      </div>
    </div>
  );
}