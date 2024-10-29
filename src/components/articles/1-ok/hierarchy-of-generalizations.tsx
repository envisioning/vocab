"use client"
import { useState, useEffect } from "react";
import { Building2, Dog, Newspaper, ArrowRight, Check, RefreshCcw } from "lucide-react";

interface HierarchyItem {
  id: string;
  text: string;
  level: number;
  category: string;
}

interface DragItem {
  id: string;
  currentLevel: number;
}

const THEMES = [
  { id: "art", icon: Building2, name: "Art Gallery" },
  { id: "zoo", icon: Dog, name: "Zoo Animals" },
  { id: "news", icon: Newspaper, name: "News Organization" }
];

const HIERARCHY_DATA: Record<string, HierarchyItem[]> = {
  art: [
    { id: "a1", text: "Mona Lisa", level: 0, category: "art" },
    { id: "a2", text: "Portrait Style", level: 1, category: "art" },
    { id: "a3", text: "Renaissance", level: 2, category: "art" },
    { id: "a4", text: "Classical Art", level: 3, category: "art" }
  ],
  zoo: [
    { id: "z1", text: "Spot the Dalmatian", level: 0, category: "zoo" },
    { id: "z2", text: "Dog Breeds", level: 1, category: "zoo" },
    { id: "z3", text: "Canines", level: 2, category: "zoo" },
    { id: "z4", text: "Mammals", level: 3, category: "zoo" }
  ],
  news: [
    { id: "n1", text: "Local Event", level: 0, category: "news" },
    { id: "n2", text: "City Stories", level: 1, category: "news" },
    { id: "n3", text: "Regional Trends", level: 2, category: "news" },
    { id: "n4", text: "Global Patterns", level: 3, category: "news" }
  ]
};

export default function HierarchyOfGeneralizations() {
  const [selectedTheme, setSelectedTheme] = useState<string>("art");
  const [items, setItems] = useState<HierarchyItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const shuffledItems = [...HIERARCHY_DATA[selectedTheme]]
      .sort(() => Math.random() - 0.5)
      .map(item => ({ ...item, level: 0 }));
    setItems(shuffledItems);
    setScore(0);
    return () => setItems([]);
  }, [selectedTheme]);

  const handleDragStart = (id: string, level: number) => {
    setDraggedItem({ id, currentLevel: level });
  };

  const handleDrop = (targetLevel: number) => {
    if (!draggedItem) return;

    const updatedItems = items.map(item => {
      if (item.id === draggedItem.id) {
        const correctLevel = HIERARCHY_DATA[selectedTheme].find(i => i.id === item.id)?.level;
        const isCorrect = correctLevel === targetLevel;
        if (isCorrect) setScore(prev => prev + 1);
        return { ...item, level: targetLevel };
      }
      return item;
    });
    setItems(updatedItems);
    setDraggedItem(null);
  };

  const resetGame = () => {
    const shuffledItems = [...HIERARCHY_DATA[selectedTheme]]
      .sort(() => Math.random() - 0.5)
      .map(item => ({ ...item, level: 0 }));
    setItems(shuffledItems);
    setScore(0);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex gap-4 mb-6 justify-center">
        {THEMES.map(({ id, icon: Icon, name }) => (
          <button
            key={id}
            onClick={() => setSelectedTheme(id)}
            className={`flex items-center gap-2 p-2 rounded ${
              selectedTheme === id ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            aria-pressed={selectedTheme === id}
          >
            <Icon size={20} />
            <span>{name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {[3, 2, 1, 0].map(level => (
          <div
            key={level}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(level)}
            className="min-h-[100px] border-2 border-dashed border-gray-300 rounded p-2"
            aria-label={`Level ${level} drop zone`}
          >
            {items
              .filter(item => item.level === level)
              .map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id, item.level)}
                  className="p-2 bg-white shadow rounded mb-2 cursor-move"
                >
                  {item.text}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Check className="text-green-500" />
          <span>Score: {score}/4</span>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-2 p-2 bg-gray-200 rounded"
          aria-label="Reset game"
        >
          <RefreshCcw size={20} />
          Reset
        </button>
      </div>
    </div>
  );
}