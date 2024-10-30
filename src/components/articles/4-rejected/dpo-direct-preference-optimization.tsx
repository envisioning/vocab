"use client"
import { useState, useEffect } from "react";
import { ChefHat, Music, ThumbsUp, ThumbsDown } from "lucide-react";

interface ComponentProps {}

type Scenario = {
  query: string;
  traditionalResponse: string;
  dpoResponses: string[];
};

const SCENARIOS: Scenario[] = [
  {
    query: "Recommend a movie",
    traditionalResponse: "I suggest watching 'The Godfather'.",
    dpoResponses: [
      "How about 'The Avengers'?",
      "You might enjoy 'La La Land'.",
      "Consider watching 'Inception'.",
    ],
  },
  {
    query: "Suggest a recipe",
    traditionalResponse: "Here's a classic spaghetti bolognese recipe.",
    dpoResponses: [
      "Try this spicy chicken curry!",
      "How about a vegetarian stir-fry?",
      "Here's a quick and easy smoothie bowl recipe.",
    ],
  },
];

/**
 * DPOSimulator component demonstrates the difference between traditional AI and DPO-optimized AI.
 */
const DPOSimulator: React.FC<ComponentProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [dpoResponse, setDpoResponse] = useState<string>("");
  const [traditionalSatisfaction, setTraditionalSatisfaction] = useState<number>(50);
  const [dpoSatisfaction, setDpoSatisfaction] = useState<number>(50);
  const [iteration, setIteration] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIteration((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setDpoResponse(SCENARIOS[currentScenario].dpoResponses[iteration]);
  }, [currentScenario, iteration]);

  const handlePreference = (isPositive: boolean, isDPO: boolean) => {
    const satisfactionChange = isPositive ? 10 : -10;
    if (isDPO) {
      setDpoSatisfaction((prev) => Math.min(Math.max(prev + satisfactionChange, 0), 100));
    } else {
      setTraditionalSatisfaction((prev) => Math.min(Math.max(prev + satisfactionChange, 0), 100));
    }
  };

  const switchScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
    setIteration(0);
    setTraditionalSatisfaction(50);
    setDpoSatisfaction(50);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">DPO Preference Simulator</h2>
      <div className="flex justify-between mb-6">
        <div className="w-1/2 p-4 bg-white rounded-lg shadow mr-2">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <Music className="mr-2" /> Traditional AI
          </h3>
          <p className="mb-4">{SCENARIOS[currentScenario].traditionalResponse}</p>
          <div className="flex justify-between items-center">
            <span>Satisfaction: {traditionalSatisfaction}%</span>
            <div>
              <button
                onClick={() => handlePreference(true, false)}
                className="p-2 bg-green-500 text-white rounded-full mr-2"
                aria-label="Like traditional response"
              >
                <ThumbsUp size={20} />
              </button>
              <button
                onClick={() => handlePreference(false, false)}
                className="p-2 bg-red-500 text-white rounded-full"
                aria-label="Dislike traditional response"
              >
                <ThumbsDown size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/2 p-4 bg-white rounded-lg shadow ml-2">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <ChefHat className="mr-2" /> DPO AI
          </h3>
          <p className="mb-4">{dpoResponse}</p>
          <div className="flex justify-between items-center">
            <span>Satisfaction: {dpoSatisfaction}%</span>
            <div>
              <button
                onClick={() => handlePreference(true, true)}
                className="p-2 bg-green-500 text-white rounded-full mr-2"
                aria-label="Like DPO response"
              >
                <ThumbsUp size={20} />
              </button>
              <button
                onClick={() => handlePreference(false, true)}
                className="p-2 bg-red-500 text-white rounded-full"
                aria-label="Dislike DPO response"
              >
                <ThumbsDown size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="mb-2">Current query: {SCENARIOS[currentScenario].query}</p>
        <button
          onClick={switchScenario}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Switch Scenario
        </button>
      </div>
    </div>
  );
};

export default DPOSimulator;