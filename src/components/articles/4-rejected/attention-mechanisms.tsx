"use client"
import { useState, useEffect } from "react";
import { Newspaper, User, Brain, ChevronDown, ChevronUp } from "lucide-react";

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
}

interface AnalystType {
  id: string;
  name: string;
  icon: JSX.Element;
}

const ARTICLES: Article[] = [
  { id: 1, title: "Global Climate Summit", content: "World leaders gather to discuss climate change mitigation strategies.", category: "politics" },
  { id: 2, title: "New AI Breakthrough", content: "Researchers develop more efficient natural language processing model.", category: "tech" },
  { id: 3, title: "Olympic Records Shattered", content: "Multiple world records broken in track and field events.", category: "sports" },
];

const ANALYSTS: AnalystType[] = [
  { id: "general", name: "General Analyst", icon: <User className="w-6 h-6" /> },
  { id: "tech", name: "Tech Analyst", icon: <Brain className="w-6 h-6" /> },
];

/**
 * AttentionMechanismDemo component demonstrates how attention mechanisms work in AI
 * through an interactive news feed analyzer.
 */
const AttentionMechanismDemo: React.FC = () => {
  const [currentArticle, setCurrentArticle] = useState<Article>(ARTICLES[0]);
  const [selectedAnalyst, setSelectedAnalyst] = useState<AnalystType>(ANALYSTS[0]);
  const [highlightedText, setHighlightedText] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentArticle((prev) => {
        const nextIndex = (ARTICLES.findIndex((a) => a.id === prev.id) + 1) % ARTICLES.length;
        return ARTICLES[nextIndex];
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const words = currentArticle.content.split(" ");
    const randomIndex = Math.floor(Math.random() * words.length);
    setHighlightedText(words[randomIndex]);
  }, [currentArticle, selectedAnalyst]);

  const handleAnalystChange = (analyst: AnalystType) => {
    setSelectedAnalyst(analyst);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">AI News Analyzer</h1>
      <div className="flex items-center mb-4">
        <Newspaper className="w-6 h-6 mr-2 text-blue-500" />
        <span className="font-semibold">Current Article:</span>
      </div>
      <div className="bg-white p-4 rounded-md mb-4">
        <h2 className="text-xl font-semibold mb-2">{currentArticle.title}</h2>
        <p className="text-gray-700">
          {currentArticle.content.split(" ").map((word, index) => (
            <span
              key={index}
              className={`${
                word === highlightedText ? "bg-yellow-200 font-bold" : ""
              } transition-all duration-300`}
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {selectedAnalyst.icon}
          <span className="ml-2 font-semibold">{selectedAnalyst.name}</span>
        </div>
        <button
          onClick={toggleExpand}
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" /> Hide Analysts
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" /> Show Analysts
            </>
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {ANALYSTS.map((analyst) => (
            <button
              key={analyst.id}
              onClick={() => handleAnalystChange(analyst)}
              className={`flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${
                selectedAnalyst.id === analyst.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {analyst.icon}
              <span className="ml-2">{analyst.name}</span>
            </button>
          ))}
        </div>
      )}
      <div className="bg-gray-200 p-4 rounded-md">
        <h3 className="font-semibold mb-2">AI Analysis:</h3>
        <p>
          The AI is focusing on the word "{highlightedText}" because it's relevant to the{" "}
          {selectedAnalyst.name}'s expertise in {currentArticle.category}.
        </p>
      </div>
    </div>
  );
};

export default AttentionMechanismDemo;