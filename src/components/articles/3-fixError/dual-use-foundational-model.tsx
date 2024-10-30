"use client"
import { useState, useEffect } from "react";
import { Knife, Beaker, MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react";

interface Scenario {
  id: number;
  tool: string;
  icon: JSX.Element;
  positiveUse: string;
  negativeUse: string;
}

interface ComponentProps {}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    tool: "Swiss Army Knife",
    icon: <Knife className="w-8 h-8" />,
    positiveUse: "Opening cans, repairs",
    negativeUse: "Potential weapon",
  },
  {
    id: 2,
    tool: "Chemistry Lab",
    icon: <Beaker className="w-8 h-8" />,
    positiveUse: "Medicine creation",
    negativeUse: "Harmful substances",
  },
  {
    id: 3,
    tool: "Language Model",
    icon: <MessageSquare className="w-8 h-8" />,
    positiveUse: "Educational content",
    negativeUse: "Misinformation",
  },
];

/**
 * DualUseExplorer: Interactive component teaching dual-use concept
 * through real-world scenarios and active engagement
 */
const DualUseExplorer: React.FC<ComponentProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [userChoice, setUserChoice] = useState<"positive" | "negative" | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
      setUserChoice(null);
      setFeedback("");
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChoice = (choice: "positive" | "negative") => {
    setUserChoice(choice);
    setFeedback(
      "Both uses are possible - this demonstrates dual-use nature!"
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Dual Use Technology Explorer
      </h1>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-center mb-4">
          {SCENARIOS[currentScenario].icon}
          <h2 className="text-xl ml-3">{SCENARIOS[currentScenario].tool}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleChoice("positive")}
            className={`p-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300
              ${userChoice === "positive" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            aria-label={`Positive use: ${SCENARIOS[currentScenario].positiveUse}`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span>{SCENARIOS[currentScenario].positiveUse}</span>
          </button>

          <button
            onClick={() => handleChoice("negative")}
            className={`p-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300
              ${userChoice === "negative" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            aria-label={`Negative use: ${SCENARIOS[currentScenario].negativeUse}`}
          >
            <ThumbsDown className="w-5 h-5" />
            <span>{SCENARIOS[currentScenario].negativeUse}</span>
          </button>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-4 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-blue-500" />
            <p>{feedback}</p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2">
        {SCENARIOS.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 
              ${currentScenario === index ? "bg-blue-500" : "bg-gray-300"}`}
            role="button"
            tabIndex={0}
            onClick={() => setCurrentScenario(index)}
            onKeyPress={(e) => e.key === "Enter" && setCurrentScenario(index)}
            aria-label={`Go to scenario ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DualUseExplorer;