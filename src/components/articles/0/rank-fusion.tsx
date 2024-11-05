"use client"
import { useState, useEffect } from "react";
import { 
  Crown, Star, Shield, ArrowRight, Info,
  RefreshCcw, HelpCircle, ChevronDown,
  Weight, Plus, Minus
} from "lucide-react";

interface RankItem {
  id: string;
  name: string;
  score?: number;
}

interface RankList {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  items: RankItem[];
  weight: number;
}

const INITIAL_LISTS: RankList[] = [
  {
    id: "critics",
    name: "Food Critics",
    description: "Expert opinions from professional food critics",
    icon: <Crown className="w-6 h-6 text-yellow-500" />,
    items: [
      { id: "a", name: "Gourmet Bistro" },
      { id: "b", name: "Spice Palace" },
      { id: "c", name: "Sushi Haven" },
    ],
    weight: 2
  },
  {
    id: "users",
    name: "User Reviews",
    description: "Aggregated ratings from thousands of diners",
    icon: <Star className="w-6 h-6 text-orange-500" />,
    items: [
      { id: "b", name: "Spice Palace" },
      { id: "c", name: "Sushi Haven" },
      { id: "d", name: "Burger Joint" },
    ],
    weight: 1
  },
  {
    id: "health",
    name: "Health Inspectors",
    description: "Official health and safety ratings",
    icon: <Shield className="w-6 h-6 text-emerald-500" />,
    items: [
      { id: "c", name: "Sushi Haven" },
      { id: "a", name: "Gourmet Bistro" },
      { id: "e", name: "Vegan Delight" },
    ],
    weight: 3
  },
];

const ANIMATION_DELAYS = {
  LIST_APPEAR: 800,
  ITEM_APPEAR: 200,
  BETWEEN_LISTS: 1000,
  FUSION_START: 1000,
};

const WeightControl: React.FC<{
  weight: number;
  onChange: (weight: number) => void;
  disabled?: boolean;
}> = ({ weight, onChange, disabled = false }) => (
  <div className="flex items-center space-x-2">
    <Weight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
      <button
        onClick={() => onChange(Math.max(1, weight - 1))}
        disabled={disabled || weight <= 1}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg
          disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease weight"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center font-medium">{weight}</span>
      <button
        onClick={() => onChange(Math.min(3, weight + 1))}
        disabled={disabled || weight >= 3}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg
          disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase weight"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const RankFusionVisualizer: React.FC = () => {
  const [lists, setLists] = useState<RankList[]>(INITIAL_LISTS);
  const [fusedList, setFusedList] = useState<RankItem[]>([]);
  const [showInfo, setShowInfo] = useState<string>("");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [activeListIndex, setActiveListIndex] = useState<number>(-1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isInitialLoad) {
      // Animate through each list
      timer = setTimeout(() => {
        const animateList = (index: number) => {
          if (index < lists.length) {
            setActiveListIndex(index);
            setTimeout(() => animateList(index + 1), ANIMATION_DELAYS.BETWEEN_LISTS);
          } else {
            // Show fused list after all lists are shown
            setFusedList(fuseLists(lists));
            setIsInitialLoad(false);
          }
        };
        
        animateList(0);
      }, ANIMATION_DELAYS.LIST_APPEAR);
    }

    return () => clearTimeout(timer);
  }, [isInitialLoad, lists]);

  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    darkQuery.addEventListener("change", handler);
    return () => darkQuery.removeEventListener("change", handler);
  }, []);

  const handleWeightChange = (listId: string, newWeight: number) => {
    const updatedLists = lists.map(list => 
      list.id === listId ? { ...list, weight: newWeight } : list
    );
    setLists(updatedLists);
    setFusedList(fuseLists(updatedLists));
  };

  const fuseLists = (lists: RankList[]): RankItem[] => {
    const itemScores: { [key: string]: number } = {};
    const items: { [key: string]: RankItem } = {};

    lists.forEach(list => {
      list.items.forEach((item, index) => {
        const score = (list.items.length - index) * list.weight;
        itemScores[item.id] = (itemScores[item.id] || 0) + score;
        items[item.id] = item;
      });
    });

    return Object.entries(itemScores)
      .sort(([, a], [, b]) => b - a)
      .map(([id, score]) => ({
        ...items[id],
        score
      }));
  };

  const renderList = (list: RankList, index: number) => (
    <div
      key={list.id}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden
        hover:shadow-xl transition-all duration-500
        ${isInitialLoad && activeListIndex < index ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
    >
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="transform transition-all duration-500 delay-300">
            {list.icon}
          </div>
          <h3 className="text-lg font-semibold dark:text-white">{list.name}</h3>
          <button
            onClick={() => setShowInfo(showInfo === list.id ? "" : list.id)}
            className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400
              dark:hover:text-gray-200 transition-colors duration-200"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2">
          <WeightControl
            weight={list.weight}
            onChange={(weight) => handleWeightChange(list.id, weight)}
          />
        </div>
        {showInfo === list.id && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 
            animate-fade-in">
            {list.description}
          </p>
        )}
      </div>
      <div className="p-4">
        <ul className="space-y-2">
          {list.items.map((item, idx) => (
            <li
              key={item.id}
              className="flex items-center space-x-3 text-sm sm:text-base"
            >
              <span className="w-6 h-6 flex items-center justify-center 
                bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 
                dark:text-blue-400 font-medium">
                {idx + 1}
              </span>
              <span className="flex-1 dark:text-gray-200">{item.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                × {list.weight}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderFusedList = () => (
    <div
      className={`bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 
        dark:to-purple-800 rounded-lg shadow-lg overflow-hidden text-white
        transition-all duration-500
        ${isInitialLoad && activeListIndex < lists.length ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
    >
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <RefreshCcw className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold">Fused Rankings</h3>
          <button
            onClick={() => setShowInfo(showInfo === "fused" ? "" : "fused")}
            className="ml-auto text-white/70 hover:text-white 
              transition-colors duration-200"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        {showInfo === "fused" && (
          <p className="mt-2 text-sm text-white/90 animate-fade-in">
            Rankings are combined using weighted scores based on position and list importance
          </p>
        )}
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {fusedList.map((item, idx) => (
            <li
              key={item.id}
              className="flex items-center space-x-3 text-sm sm:text-base"
            >
              <span className="w-6 h-6 flex items-center justify-center 
                bg-white/20 rounded-full font-medium">
                {idx + 1}
              </span>
              <span className="flex-1">{item.name}</span>
              <span className="text-sm text-white/70">
                Score: {item.score}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 
        bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold 
            bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 
            dark:to-purple-400 text-transparent bg-clip-text mb-4">
            Weighted Rank Fusion
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Adjust weights to control how much each ranking system influences the final result
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lists.map((list, index) => renderList(list, index))}
          <div className="hidden lg:flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="lg:col-span-2">
            {renderFusedList()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankFusionVisualizer;