"use client"
import { useState, useEffect } from "react";
import { List, Move, ArrowRight } from "lucide-react";

interface RankItem {
  id: string;
  name: string;
}

interface RankList {
  id: string;
  name: string;
  items: RankItem[];
}

const INITIAL_LISTS: RankList[] = [
  {
    id: "1",
    name: "Food Critics",
    items: [
      { id: "a", name: "Gourmet Bistro" },
      { id: "b", name: "Spice Palace" },
      { id: "c", name: "Sushi Haven" },
    ],
  },
  {
    id: "2",
    name: "User Reviews",
    items: [
      { id: "b", name: "Spice Palace" },
      { id: "c", name: "Sushi Haven" },
      { id: "d", name: "Burger Joint" },
    ],
  },
  {
    id: "3",
    name: "Health Inspectors",
    items: [
      { id: "c", name: "Sushi Haven" },
      { id: "a", name: "Gourmet Bistro" },
      { id: "e", name: "Vegan Delight" },
    ],
  },
];

/**
 * RankFusionVisualizer: A component to teach Rank Fusion concepts
 * to 15-18 year old students through interactive visualization.
 */
const RankFusionVisualizer: React.FC = () => {
  const [lists, setLists] = useState<RankList[]>(INITIAL_LISTS);
  const [fusedList, setFusedList] = useState<RankItem[]>([]);
  const [step, setStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 4) {
        setStep((prevStep) => prevStep + 1);
        setIsAnimating(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step === 4) {
      const fused = fuseLists(lists);
      setFusedList(fused);
    }
  }, [step, lists]);

  const fuseLists = (lists: RankList[]): RankItem[] => {
    const itemScores: { [key: string]: number } = {};
    lists.forEach((list) => {
      list.items.forEach((item, index) => {
        const score = list.items.length - index;
        itemScores[item.id] = (itemScores[item.id] || 0) + score;
      });
    });
    return Object.entries(itemScores)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => {
        const item = lists.flatMap((l) => l.items).find((i) => i.id === id);
        return item!;
      });
  };

  const renderList = (list: RankList, index: number) => (
    <div
      key={list.id}
      className={`bg-gray-100 p-4 rounded-lg shadow-md transition-all duration-300 ${
        step > index ? "opacity-100" : "opacity-0 translate-y-4"
      }`}
    >
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <List className="mr-2" />
        {list.name}
      </h3>
      <ul>
        {list.items.map((item, idx) => (
          <li
            key={item.id}
            className="mb-1 flex items-center"
          >
            <span className="mr-2">{idx + 1}.</span>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderFusedList = () => (
    <div
      className={`bg-blue-100 p-4 rounded-lg shadow-md transition-all duration-300 ${
        step === 4 ? "opacity-100" : "opacity-0 translate-y-4"
      }`}
    >
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Move className="mr-2" />
        Fused Ranking
      </h3>
      <ul>
        {fusedList.map((item, index) => (
          <li
            key={item.id}
            className="mb-1 flex items-center"
          >
            <span className="mr-2">{index + 1}.</span>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Rank Fusion Visualizer</h2>
      <p className="mb-4">
        Watch as we combine different restaurant rankings to create one
        ultimate list!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {lists.map((list, index) => renderList(list, index))}
        <div className="flex items-center justify-center">
          <ArrowRight
            className={`text-blue-500 transition-all duration-300 ${
              step === 4 ? "opacity-100" : "opacity-0"
            }`}
            size={32}
          />
        </div>
        {renderFusedList()}
      </div>
      <button
        onClick={() => {
          setStep(0);
          setFusedList([]);
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Reset visualization"
      >
        Reset
      </button>
    </div>
  );
};

export default RankFusionVisualizer;