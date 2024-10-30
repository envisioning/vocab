"use client"
import { useState, useEffect } from "react";
import { Backpack, Book, Camera, Hash, ArrowRight, Lock, AlertCircle } from "lucide-react";

interface HashItem {
  key: string;
  value: string;
  icon: "locker" | "book" | "photo";
}

interface Bucket {
  items: HashItem[];
}

interface ScenarioType {
  id: number;
  name: string;
  icon: JSX.Element;
}

const SCENARIOS: ScenarioType[] = [
  { id: 1, name: "School Lockers", icon: <Backpack className="w-6 h-6" /> },
  { id: 2, name: "Library", icon: <Book className="w-6 h-6" /> },
  { id: 3, name: "Instagram", icon: <Camera className="w-6 h-6" /> },
];

const BUCKET_COUNT = 8;

/**
 * HashTableExplorer: Interactive component teaching hash tables through real-world scenarios
 */
export default function HashTableExplorer() {
  const [buckets, setBuckets] = useState<Bucket[]>(Array(BUCKET_COUNT).fill({ items: [] }));
  const [activeScenario, setActiveScenario] = useState<number>(1);
  const [inputKey, setInputKey] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const hashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % BUCKET_COUNT;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey || !inputValue) return;

    const index = hashFunction(inputKey);
    setAnimatingIndex(index);

    const newBuckets = [...buckets];
    const icon = activeScenario === 1 ? "locker" : activeScenario === 2 ? "book" : "photo";
    newBuckets[index] = {
      items: [...newBuckets[index].items, { key: inputKey, value: inputValue, icon }],
    };

    setBuckets(newBuckets);
    setInputKey("");
    setInputValue("");

    setTimeout(() => setAnimatingIndex(null), 500);
  };

  useEffect(() => {
    return () => {
      setAnimatingIndex(null);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex gap-4 justify-center mb-8">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setActiveScenario(scenario.id)}
            className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-300
              ${activeScenario === scenario.id ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            aria-pressed={activeScenario === scenario.id}
          >
            {scenario.icon}
            <span>{scenario.name}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex gap-4 justify-center mb-8">
        <input
          type="text"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Enter key"
          className="border p-2 rounded"
          aria-label="Key input"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="border p-2 rounded"
          aria-label="Value input"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Add Item
        </button>
      </form>

      <div className="grid grid-cols-4 gap-4">
        {buckets.map((bucket, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-4 min-h-[120px] transition-colors duration-300
              ${animatingIndex === index ? "border-green-500" : "border-gray-200"}`}
          >
            <div className="text-sm text-gray-500 mb-2">Bucket {index}</div>
            {bucket.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded mb-2"
              >
                {item.icon === "locker" ? (
                  <Lock className="w-4 h-4" />
                ) : item.icon === "book" ? (
                  <Book className="w-4 h-4" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {item.key}: {item.value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}