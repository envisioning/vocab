"use client"
import { useState, useEffect } from "react";
import { Heart, Coffee, Zap, RotateCcw, Trophy, Star } from "lucide-react";

interface CoffeeShopState {
  visits: number;
  preferences: string[];
  loyaltyPoints: number;
  favoriteOrder: string;
  achievements: string[];
}

/**
 * StatefulCoffeeShop - Educational component demonstrating stateful behavior
 * through an interactive coffee shop experience
 */
export default function StatefulCoffeeShop() {
  const [state, setState] = useState<CoffeeShopState>({
    visits: 0,
    preferences: [],
    loyaltyPoints: 0,
    favoriteOrder: "",
    achievements: [],
  });

  const [orderHistory, setOrderHistory] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);

  const DRINK_OPTIONS = ["Latte", "Espresso", "Cappuccino", "Mocha"];

  useEffect(() => {
    if (state.visits === 5 && !state.achievements.includes("Regular")) {
      setState(prev => ({
        ...prev,
        achievements: [...prev.achievements, "Regular"],
      }));
    }
    return () => {
      // Cleanup not needed for this effect
    };
  }, [state.visits]);

  const handleOrder = (drink: string) => {
    setOrderHistory(prev => [...prev, drink]);
    setState(prev => ({
      ...prev,
      visits: prev.visits + 1,
      loyaltyPoints: prev.loyaltyPoints + 10,
      preferences: [...prev.preferences, drink],
      favoriteOrder: prev.preferences.length > 0 ? 
        getMostFrequent([...prev.preferences, drink]) : 
        drink,
    }));
  };

  const getMostFrequent = (arr: string[]): string => {
    return arr.sort((a,b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop() || "";
  };

  const resetState = () => {
    setState({
      visits: 0,
      preferences: [],
      loyaltyPoints: 0,
      favoriteOrder: "",
      achievements: [],
    });
    setOrderHistory([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Coffee Shop Profile
        </h2>
        <button
          onClick={resetState}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
          aria-label="Reset profile"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Coffee className="text-blue-500" />
            <span>Visits: {state.visits}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" />
            <span>Loyalty Points: {state.loyaltyPoints}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500" />
            <span>Favorite Order: {state.favoriteOrder || "Not yet determined"}</span>
          </div>
          {state.achievements.length > 0 && (
            <div className="flex items-center gap-2">
              <Trophy className="text-green-500" />
              <span>Achievements: {state.achievements.join(", ")}</span>
            </div>
          )}
        </div>

        <div className="border-l pl-6">
          <h3 className="text-lg font-semibold mb-4">Place an Order</h3>
          <div className="grid grid-cols-2 gap-3">
            {DRINK_OPTIONS.map((drink) => (
              <button
                key={drink}
                onClick={() => handleOrder(drink)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
                aria-label={`Order ${drink}`}
              >
                <Zap size={16} />
                {drink}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Order History</h3>
        <div className="flex flex-wrap gap-2">
          {orderHistory.map((order, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {order}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}