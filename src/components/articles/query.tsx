"use client"
import { useState, useEffect } from "react";
import { Coffee, Milk, IceCream, Thermometer, Clock, Check, X } from "lucide-react";

interface DrinkOption {
  id: string;
  name: string;
  icon: JSX.Element;
  category: "base" | "extra" | "spec";
}

interface QueryState {
  base: string[];
  extras: string[];
  specifications: string[];
}

const DRINK_OPTIONS: DrinkOption[] = [
  { id: "espresso", name: "Espresso", icon: <Coffee />, category: "base" },
  { id: "milk", name: "Milk", icon: <Milk />, category: "extra" },
  { id: "ice-cream", name: "Ice Cream", icon: <IceCream />, category: "extra" },
  { id: "hot", name: "Hot", icon: <Thermometer />, category: "spec" },
  { id: "quick", name: "Quick", icon: <Clock />, category: "spec" },
];

export default function QueryCafe() {
  const [query, setQuery] = useState<QueryState>({
    base: [],
    extras: [],
    specifications: [],
  });
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>("");

  useEffect(() => {
    const baseItems = query.base.length ? query.base.join(", ") : "*";
    const whereClause = query.specifications.length 
      ? `WHERE temperature = '${query.specifications.includes("hot") ? "hot" : "cold"}'`
      : "";
    const joinClause = query.extras.length 
      ? `JOIN extras ON drinks.id = extras.drink_id WHERE extras.name IN ('${query.extras.join("', '")}')`
      : "";
    
    setSqlQuery(`SELECT ${baseItems} FROM drinks ${joinClause} ${whereClause}`);

    return () => setSqlQuery("");
  }, [query]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (category: keyof QueryState) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    const option = DRINK_OPTIONS.find(opt => opt.id === draggedItem);
    if (!option || option.category !== category) return;

    setQuery(prev => ({
      ...prev,
      [category]: [...prev[category], draggedItem],
    }));
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeItem = (category: keyof QueryState, id: string) => {
    setQuery(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== id),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Query Café Builder</h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="font-semibold mb-2">Available Items</h2>
            <div className="flex flex-wrap gap-2">
              {DRINK_OPTIONS.map(option => (
                <div
                  key={option.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, option.id)}
                  className="p-2 bg-blue-100 rounded-md flex items-center gap-2 cursor-move hover:bg-blue-200 transition duration-300"
                >
                  {option.icon}
                  <span>{option.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            onDrop={handleDrop("base")}
            onDragOver={handleDragOver}
            className="p-4 bg-white rounded-lg shadow min-h-[100px]"
          >
            <h2 className="font-semibold mb-2">Base Drinks (SELECT)</h2>
            <div className="flex flex-wrap gap-2">
              {query.base.map(id => {
                const option = DRINK_OPTIONS.find(opt => opt.id === id);
                return (
                  <div key={id} className="p-2 bg-green-100 rounded-md flex items-center gap-2">
                    {option?.icon}
                    <span>{option?.name}</span>
                    <button
                      onClick={() => removeItem("base", id)}
                      className="p-1 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            onDrop={handleDrop("extras")}
            onDragOver={handleDragOver}
            className="p-4 bg-white rounded-lg shadow min-h-[100px]"
          >
            <h2 className="font-semibold mb-2">Extras (JOIN)</h2>
            <div className="flex flex-wrap gap-2">
              {query.extras.map(id => {
                const option = DRINK_OPTIONS.find(opt => opt.id === id);
                return (
                  <div key={id} className="p-2 bg-green-100 rounded-md flex items-center gap-2">
                    {option?.icon}
                    <span>{option?.name}</span>
                    <button
                      onClick={() => removeItem("extras", id)}
                      className="p-1 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-4">Generated SQL Query</h2>
          <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
            {sqlQuery}
          </pre>
        </div>
      </div>
    </div>
  );
}