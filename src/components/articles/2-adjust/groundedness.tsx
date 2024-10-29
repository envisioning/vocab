"use client"
import { useState, useEffect } from "react";
import { Tv, Database, Send, RefreshCw, HelpCircle } from "lucide-react";

interface ComponentProps {}

type NewsItem = {
  question: string;
  answer: string;
  groundedness: "grounded" | "inference" | "ungrounded";
};

const INITIAL_NEWS: NewsItem[] = [
  {
    question: "What's the capital of France?",
    answer: "The capital of France is Paris.",
    groundedness: "grounded",
  },
  {
    question: "Will it rain tomorrow?",
    answer: "Based on current weather patterns, there's a chance of rain.",
    groundedness: "inference",
  },
  {
    question: "Who will win the next election?",
    answer: "The incumbent party will definitely win.",
    groundedness: "ungrounded",
  },
];

/**
 * GroundedNewsAnchor: An interactive component teaching the concept of AI groundedness.
 */
const GroundedNewsAnchor: React.FC<ComponentProps> = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(INITIAL_NEWS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [isExplanationMode, setIsExplanationMode] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [newsItems.length]);

  const handleQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const newItem: NewsItem = {
      question: userQuestion,
      answer: generateAnswer(userQuestion),
      groundedness: determineGroundedness(userQuestion),
    };

    setNewsItems((prevItems) => [...prevItems, newItem]);
    setUserQuestion("");
    setCurrentIndex(newsItems.length);
  };

  const generateAnswer = (question: string): string => {
    // Simplified logic for demo purposes
    return `Here's a response to "${question}" based on available information.`;
  };

  const determineGroundedness = (
    question: string
  ): "grounded" | "inference" | "ungrounded" => {
    // Simplified logic for demo purposes
    const lowercaseQuestion = question.toLowerCase();
    if (lowercaseQuestion.includes("capital") || lowercaseQuestion.includes("population"))
      return "grounded";
    if (lowercaseQuestion.includes("weather") || lowercaseQuestion.includes("forecast"))
      return "inference";
    return "ungrounded";
  };

  const getGroundednessColor = (groundedness: string): string => {
    switch (groundedness) {
      case "grounded":
        return "bg-green-500";
      case "inference":
        return "bg-yellow-500";
      case "ungrounded":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const resetDemo = () => {
    setNewsItems(INITIAL_NEWS);
    setCurrentIndex(0);
    setUserQuestion("");
    setIsExplanationMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">The Grounded News Anchor</h1>
        <button
          onClick={resetDemo}
          className="p-2 bg-blue-500 text-white rounded-full"
          aria-label="Reset demo"
        >
          <RefreshCw size={24} />
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="w-2/3 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Tv className="mr-2" size={24} />
            <h2 className="text-xl font-semibold">News Studio</h2>
          </div>
          <div className="mb-4">
            <p className="font-bold">Question:</p>
            <p>{newsItems[currentIndex].question}</p>
          </div>
          <div className="mb-4">
            <p className="font-bold">Answer:</p>
            <p
              className={`p-2 rounded ${getGroundednessColor(
                newsItems[currentIndex].groundedness
              )}`}
            >
              {newsItems[currentIndex].answer}
            </p>
          </div>
          <div>
            <p className="font-bold">Groundedness:</p>
            <p className="capitalize">{newsItems[currentIndex].groundedness}</p>
          </div>
        </div>

        <div className="w-1/3 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Database className="mr-2" size={24} />
            <h2 className="text-xl font-semibold">Fact Database</h2>
          </div>
          <ul className="list-disc pl-5">
            <li>Capitals of countries</li>
            <li>Population statistics</li>
            <li>Historical events</li>
            <li>Scientific facts</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleQuestionSubmit} className="mt-4 flex">
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow p-2 border rounded-l"
          aria-label="Enter your question"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r"
          aria-label="Submit question"
        >
          <Send size={24} />
        </button>
      </form>

      <button
        onClick={() => setIsExplanationMode(!isExplanationMode)}
        className="mt-4 p-2 bg-blue-500 text-white rounded-full"
        aria-label="Toggle explanation mode"
      >
        <HelpCircle size={24} />
      </button>

      {isExplanationMode && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Explanation Mode</h3>
          <p>
            Groundedness refers to how closely AI-generated content is tied to
            factual knowledge. Green responses are grounded in facts, yellow are
            inferences, and red are ungrounded statements.
          </p>
        </div>
      )}
    </div>
  );
};

export default GroundedNewsAnchor;