"use client"
import { useState, useEffect } from "react";
import { Brain, Book, BookOpen, GraduationCap, School, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

interface MemoryItem {
  id: number;
  content: string;
  position: number;
  opacity: number;
}

interface MemoryPalaceProps {}

const INITIAL_ITEMS: MemoryItem[] = [
  { id: 1, content: "First Day", position: 0, opacity: 1 },
  { id: 2, content: "New Friends", position: 1, opacity: 0.9 },
  { id: 3, content: "Math Class", position: 2, opacity: 0.8 },
  { id: 4, content: "Lunch Break", position: 3, opacity: 0.7 },
  { id: 5, content: "Science Lab", position: 4, opacity: 0.6 },
  { id: 6, content: "Group Project", position: 5, opacity: 0.5 },
  { id: 7, content: "Library Time", position: 6, opacity: 0.4 },
  { id: 8, content: "Art Class", position: 7, opacity: 0.5 },
  { id: 9, content: "Last Bell", position: 8, opacity: 0.9 }
];

/**
 * MemoryPalace: Interactive component demonstrating the Lost-in-the-Middle effect
 */
const MemoryPalace: React.FC<MemoryPalaceProps> = () => {
  const [items, setItems] = useState<MemoryItem[]>(INITIAL_ITEMS);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentFocus, setCurrentFocus] = useState<number>(0);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setCurrentFocus((prev) => (prev + 1) % items.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isAnimating, items.length]);

  const handleStartAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  const handleReset = () => {
    setItems(INITIAL_ITEMS);
    setCurrentFocus(0);
    setIsAnimating(false);
  };

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      setCurrentFocus((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === "ArrowLeft") {
      setCurrentFocus((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div 
      className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg"
      role="region"
      aria-label="Memory Palace Demonstration"
      onKeyDown={handleKeyNavigation}
      tabIndex={0}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="text-blue-500" />
          Lost-in-the-Middle Effect
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleStartAnimation}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            aria-label={isAnimating ? "Pause Animation" : "Start Animation"}
          >
            {isAnimating ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-gray-600 hover:text-blue-500 transition duration-300"
            aria-label="Reset Demonstration"
          >
            <RefreshCw />
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center min-w-full">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col items-center p-4 transition-all duration-300 ${
                currentFocus === item.position ? "scale-110" : "scale-100"
              }`}
              style={{ opacity: item.opacity }}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full mb-2">
                {item.position === 0 ? <Book /> : 
                 item.position === items.length - 1 ? <GraduationCap /> : 
                 <BookOpen />}
              </div>
              <span className="text-sm text-center">{item.content}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center text-gray-600">
        <p>Notice how middle memories become harder to recall!</p>
        <div className="flex justify-center gap-4 mt-2">
          <ArrowLeft className="text-blue-500" />
          <span>Use arrow keys to navigate</span>
          <ArrowRight className="text-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default MemoryPalace;