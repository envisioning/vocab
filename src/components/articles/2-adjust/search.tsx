"use client"
import { useState, useEffect } from "react";
import { Search as SearchIcon, Target, Map, Compass, Info, Brain, Lightbulb, ArrowRight, HelpCircle } from "lucide-react";

interface SearchState {
  currentPosition: number;
  visited: number[];
  found: boolean;
  isSearching: boolean;
  showTooltip: number | null;
}

const MAZE_SIZE = 16;
const TARGET_POSITION = 13;

const TOOLTIPS = {
  search: "The AI agent (blue) systematically explores the space",
  target: "The goal state the AI is trying to reach",
  visited: "Previously explored states",
  progress: "Watch the search progress in real-time!"
};

export default function AISearchVisualizer() {
  const [searchState, setSearchState] = useState<SearchState>({
    currentPosition: 0,
    visited: [0],
    found: false,
    isSearching: false,
    showTooltip: null
  });

  useEffect(() => {
    if (!searchState.isSearching || searchState.found) return;

    const searchInterval = setInterval(() => {
      setSearchState((prev) => {
        const nextPosition = prev.currentPosition + 1;
        const newVisited = [...prev.visited, nextPosition];
        const found = nextPosition === TARGET_POSITION;
        return {
          ...prev,
          currentPosition: nextPosition,
          visited: newVisited,
          found: found,
          isSearching: !found,
        };
      });
    }, 600);

    return () => clearInterval(searchInterval);
  }, [searchState.isSearching]);

  const renderCell = (index: number) => {
    const isVisited = searchState.visited.includes(index);
    const isCurrent = index === searchState.currentPosition;
    const isTarget = index === TARGET_POSITION;

    return (
      <div
        key={index}
        className={`
          relative w-20 h-20 rounded-xl flex items-center justify-center
          transition-all duration-500 transform hover:scale-105
          ${isVisited ? "bg-blue-100 shadow-inner" : "bg-gray-50"}
          ${isCurrent ? "ring-4 ring-blue-500 shadow-lg" : ""}
          ${isTarget ? "bg-green-100 shadow-lg" : ""}
          backdrop-blur-sm
        `}
        onMouseEnter={() => setSearchState(prev => ({ ...prev, showTooltip: index }))}
        onMouseLeave={() => setSearchState(prev => ({ ...prev, showTooltip: null }))}
      >
        {isCurrent && (
          <div className="relative">
            <SearchIcon className="w-10 h-10 text-blue-500 animate-pulse" />
            {searchState.showTooltip === index && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white p-2 rounded-lg text-xs whitespace-nowrap">
                {TOOLTIPS.search}
              </div>
            )}
          </div>
        )}
        {isTarget && (
          <div className="relative">
            <Target className="w-10 h-10 text-green-500 animate-bounce" />
            {searchState.showTooltip === index && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white p-2 rounded-lg text-xs whitespace-nowrap">
                {TOOLTIPS.target}
              </div>
            )}
          </div>
        )}
        {!isCurrent && !isTarget && isVisited && (
          <div className="w-4 h-4 rounded-full bg-blue-300 animate-pulse" />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 p-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl max-w-4xl mx-auto shadow-xl">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            AI Search Visualization
          </h2>
        </div>
        <p className="text-gray-600 flex items-center justify-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Watch how AI explores possibilities to find its target!
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 p-8 bg-white/50 rounded-2xl shadow-lg backdrop-blur-sm">
        {Array.from({ length: MAZE_SIZE }, (_, i) => renderCell(i))}
      </div>

      <div className="flex gap-6 items-center">
        <button
          onClick={() => setSearchState({
            currentPosition: 0,
            visited: [0],
            found: false,
            isSearching: true,
            showTooltip: null
          })}
          disabled={searchState.isSearching}
          className={`
            px-8 py-4 rounded-xl flex items-center gap-3 text-lg font-semibold
            shadow-lg hover:shadow-xl transform hover:-translate-y-1
            ${searchState.isSearching
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
            }
            transition-all duration-300
          `}
        >
          <Compass className="w-6 h-6" />
          {searchState.found ? "Try Again" : "Start Search"}
        </button>

        {searchState.found && (
          <div className="flex items-center gap-3 text-green-500 font-medium text-lg bg-green-50 px-6 py-3 rounded-xl">
            <Map className="w-6 h-6" />
            Target Found!
          </div>
        )}
      </div>

      <div className="text-base text-gray-600 max-w-lg text-center p-6 bg-white/70 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 justify-center mb-3">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <span className="font-medium">How it works:</span>
        </div>
        <p>
          Just like how we search for items in different locations, AI systematically explores possible
          solutions until it finds its goal. This visualization shows a simple linear search pattern!
        </p>
      </div>
    </div>
  );
}