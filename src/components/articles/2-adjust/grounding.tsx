"use client"
import { useState, useEffect } from "react";
import { Alien, Book, Brain, CheckCircle2, XCircle, Coffee, Flame, Star, Heart } from "lucide-react";

interface Scenario {
  word: string;
  context: string;
  literal: string;
  contextual: string;
  icon: JSX.Element;
}

const SCENARIOS: Scenario[] = [
  {
    word: "hot",
    context: "This coffee is hot",
    literal: "High temperature only",
    contextual: "Warning: Could burn!",
    icon: <Coffee className="w-8 h-8" />,
  },
  {
    word: "hot",
    context: "This pepper is hot",
    literal: "High temperature?",
    contextual: "Spicy!",
    icon: <Flame className="w-8 h-8" />,
  },
  {
    word: "hot",
    context: "That trend is hot",
    literal: "Temperature rising?",
    contextual: "Popular!",
    icon: <Star className="w-8 h-8" />,
  },
];

/**
 * AlienGrounding - Interactive component teaching the concept of grounding
 * through an alien learning Earth concepts
 */
export default function AlienGrounding() {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [showContextual, setShowContextual] = useState<boolean>(false);
  const [understanding, setUnderstanding] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowContextual(prev => !prev);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentScenario === SCENARIOS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentScenario(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentScenario]);

  const handleNextScenario = () => {
    setCurrentScenario(prev => (prev + 1) % SCENARIOS.length);
    setShowContextual(false);
    setUnderstanding(prev => Math.min(prev + 33, 100));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Alien className="w-10 h-10 text-blue-500" />
          <h2 className="text-2xl font-bold">Alien's Earth Dictionary</h2>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-gray-600" />
          <div className="w-32 h-4 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${understanding}%` }}
              role="progressbar"
              aria-valuenow={understanding}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Book className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Dictionary Knowledge</h3>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-lg mb-2">{SCENARIOS[currentScenario].word}</p>
            <p className="text-gray-600">
              {showContextual ? 
                SCENARIOS[currentScenario].contextual :
                SCENARIOS[currentScenario].literal}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            {SCENARIOS[currentScenario].icon}
            <div className="flex gap-2">
              {showContextual ? 
                <CheckCircle2 className="w-6 h-6 text-green-500" /> :
                <XCircle className="w-6 h-6 text-gray-400" />
              }
            </div>
          </div>
          <p className="text-lg">{SCENARIOS[currentScenario].context}</p>
          <button
            onClick={handleNextScenario}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            aria-label="Next scenario"
          >
            Try Next Context
          </button>
        </div>
      </div>
    </div>
  );
}