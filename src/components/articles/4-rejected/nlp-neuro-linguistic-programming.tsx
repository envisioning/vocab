"use client"
import { useState, useEffect } from "react";
import { Book, MessageSquare, Globe, Sparkles, RefreshCw } from "lucide-react";

interface ComponentProps {}

type Activity = "textAnalysis" | "detective" | "chatbot" | "translation" | "predictive";

interface Scenario {
  text: string;
  entities: string[];
  sentiment: "positive" | "negative" | "neutral";
}

const SCENARIOS: Scenario[] = [
  {
    text: "Sarah loved the new restaurant. The food was delicious and the service was excellent.",
    entities: ["Sarah", "restaurant", "food", "service"],
    sentiment: "positive",
  },
  {
    text: "The movie was disappointing. The plot was confusing and the acting was subpar.",
    entities: ["movie", "plot", "acting"],
    sentiment: "negative",
  },
];

/**
 * NLPPlayground - An interactive component for learning about Natural Language Processing
 */
const NLPPlayground: React.FC<ComponentProps> = () => {
  const [currentActivity, setCurrentActivity] = useState<Activity>("textAnalysis");
  const [userInput, setUserInput] = useState<string>("");
  const [analysis, setAnalysis] = useState<Scenario | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentActivity === "textAnalysis" && userInput) {
        performAnalysis();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [userInput, currentActivity]);

  const performAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
      setAnalysis(randomScenario);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleActivityChange = (activity: Activity) => {
    setCurrentActivity(activity);
    setUserInput("");
    setAnalysis(null);
  };

  const renderActivity = () => {
    switch (currentActivity) {
      case "textAnalysis":
        return (
          <div className="space-y-4">
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter text for analysis..."
              aria-label="Text for analysis"
            />
            {isAnalyzing ? (
              <p className="text-blue-500">Analyzing...</p>
            ) : analysis ? (
              <div className="space-y-2">
                <p>Entities: {analysis.entities.join(", ")}</p>
                <p>Sentiment: {analysis.sentiment}</p>
              </div>
            ) : null}
          </div>
        );
      default:
        return <p>Select an activity to begin</p>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">NLP Playground</h1>
      <div className="flex space-x-4 mb-4">
        <button
          className={`p-2 rounded ${
            currentActivity === "textAnalysis" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleActivityChange("textAnalysis")}
          aria-label="Text Analysis"
        >
          <Book size={24} />
        </button>
        <button
          className={`p-2 rounded ${
            currentActivity === "detective" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleActivityChange("detective")}
          aria-label="Language Detective"
        >
          <MessageSquare size={24} />
        </button>
        <button
          className={`p-2 rounded ${
            currentActivity === "chatbot" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleActivityChange("chatbot")}
          aria-label="AI Chatbot"
        >
          <Globe size={24} />
        </button>
        <button
          className={`p-2 rounded ${
            currentActivity === "translation" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleActivityChange("translation")}
          aria-label="Translation Challenge"
        >
          <Sparkles size={24} />
        </button>
        <button
          className={`p-2 rounded ${
            currentActivity === "predictive" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleActivityChange("predictive")}
          aria-label="Predictive Text"
        >
          <RefreshCw size={24} />
        </button>
      </div>
      {renderActivity()}
    </div>
  );
};

export default NLPPlayground;