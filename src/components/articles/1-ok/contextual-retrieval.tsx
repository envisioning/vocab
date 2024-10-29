"use client"
import { useState, useEffect } from "react";
import { Book, Sun, Moon, Cloud, MapPin, User, Search, RefreshCw, AlertCircle } from "lucide-react";

interface ScenarioType {
  query: string;
  context: {
    time: 'day' | 'night';
    weather: 'sunny' | 'cloudy';
    location: 'library' | 'cafe';
    previousSearches: string[];
  };
  contextualResult: string;
  keywordResult: string;
}

const SCENARIOS: ScenarioType[] = [
  {
    query: "I need something cold",
    context: {
      time: 'day',
      weather: 'sunny',
      location: 'cafe',
      previousSearches: ['summer drinks', 'beach activities']
    },
    contextualResult: "Iced coffee or smoothie recommended for hot summer day",
    keywordResult: "Cold items: ice, freezer, snow, refrigerator"
  },
  {
    query: "I need something cold",
    context: {
      time: 'night',
      weather: 'cloudy',
      location: 'library',
      previousSearches: ['flu remedies', 'fever reduction']
    },
    contextualResult: "Cold medicine and fever reducers section",
    keywordResult: "Cold items: ice, freezer, snow, refrigerator"
  }
];

/**
 * Interactive component teaching contextual retrieval through real-world scenarios
 */
const ContextualRetrieval = () => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  useEffect(() => {
    if (!isAnimating) return;
    
    const timer = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAnimating]);

  const handleContextToggle = () => {
    setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
  };

  const scenario = SCENARIOS[currentScenario];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contextual Retrieval Demo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Current Context</h3>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label={isAnimating ? "Pause animation" : "Start animation"}
            >
              <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {scenario.context.time === 'day' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>Time: {scenario.context.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              <span>Weather: {scenario.context.weather}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Location: {scenario.context.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>Recent searches: {scenario.context.previousSearches.join(", ")}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              <span className="font-semibold">Query: "{scenario.query}"</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold mb-2">Keyword Search Result:</h4>
              <p>{scenario.keywordResult}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <h4 className="font-semibold mb-2">Contextual Result:</h4>
              <p>{scenario.contextualResult}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="mt-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
        aria-expanded={showExplanation}
      >
        <AlertCircle className="w-5 h-5" />
        <span>Why are the results different?</span>
      </button>

      {showExplanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p>The contextual retrieval system considers your current situation (time, location, weather) 
             and past behavior to provide more relevant results, just like a helpful friend would!</p>
        </div>
      )}
    </div>
  );
};

export default ContextualRetrieval;