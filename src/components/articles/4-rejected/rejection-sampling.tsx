"use client"
import { useState, useEffect } from "react";
import { Circle, Square, Triangle, Target, X } from "lucide-react";

interface ComponentProps {}

type Shape = "circle" | "square" | "triangle";
type Color = "red" | "blue" | "green";

interface Item {
  shape: Shape;
  color: Color;
}

interface Distribution {
  [key: string]: number;
}

const COLORS: Color[] = ["red", "blue", "green"];
const SHAPES: Shape[] = ["circle", "square", "triangle"];

const INITIAL_TARGET: Distribution = {
  "red-circle": 0.2,
  "blue-square": 0.3,
  "green-triangle": 0.5,
};

const RejectionSamplingGame: React.FC<ComponentProps> = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [targetDistribution, setTargetDistribution] = useState<Distribution>(INITIAL_TARGET);
  const [collectedItems, setCollectedItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setItems((prevItems) => [
          ...prevItems,
          {
            shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          },
        ].slice(-5));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameActive]);

  useEffect(() => {
    if (collectedItems.length > 0) {
      const currentDistribution = collectedItems.reduce((acc, item) => {
        const key = `${item.color}-${item.shape}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Distribution);

      const totalItems = collectedItems.length;
      let newScore = 0;

      Object.keys(targetDistribution).forEach((key) => {
        const targetPercentage = targetDistribution[key];
        const currentPercentage = (currentDistribution[key] || 0) / totalItems;
        newScore += 1 - Math.abs(targetPercentage - currentPercentage);
      });

      setScore(Math.round((newScore / Object.keys(targetDistribution).length) * 100));
    }
  }, [collectedItems, targetDistribution]);

  const handleItemClick = (item: Item) => {
    if (!gameActive) return;

    const key = `${item.color}-${item.shape}`;
    const acceptanceProbability = targetDistribution[key] || 0;

    if (Math.random() < acceptanceProbability) {
      setCollectedItems((prev) => [...prev, item]);
    }

    setItems((prev) => prev.filter((i) => i !== item));
  };

  const renderShape = (shape: Shape, color: Color) => {
    const props = { size: 32, className: `text-${color}-500` };
    switch (shape) {
      case "circle":
        return <Circle {...props} />;
      case "square":
        return <Square {...props} />;
      case "triangle":
        return <Triangle {...props} />;
    }
  };

  const toggleGame = () => setGameActive((prev) => !prev);

  const resetGame = () => {
    setGameActive(false);
    setItems([]);
    setCollectedItems([]);
    setScore(0);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Rejection Sampling Game</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Target Distribution:</h3>
        <div className="flex space-x-4">
          {Object.entries(targetDistribution).map(([key, value]) => (
            <div key={key} className="flex items-center">
              {renderShape(key.split("-")[1] as Shape, key.split("-")[0] as Color)}
              <span className="ml-2">{`${(value * 100).toFixed(0)}%`}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4 p-4 bg-gray-200 rounded">
        <h3 className="text-lg font-semibold mb-2">Conveyor Belt:</h3>
        <div className="flex justify-between items-center">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              aria-label={`${item.color} ${item.shape}`}
            >
              {renderShape(item.shape, item.color)}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Collected Items:</h3>
        <div className="flex flex-wrap gap-2">
          {collectedItems.map((item, index) => (
            <div key={index}>{renderShape(item.shape, item.color)}</div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Score: {score}%</h3>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={toggleGame}
          className={`px-4 py-2 rounded ${
            gameActive ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {gameActive ? "Stop" : "Start"}
        </button>
        <button onClick={resetGame} className="px-4 py-2 rounded bg-blue-500 text-white">
          Reset
        </button>
      </div>
    </div>
  );
};

export default RejectionSamplingGame;