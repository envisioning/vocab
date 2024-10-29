"use client"
import { useState, useEffect } from "react";
import { MessageSquare, Brain, Smile, Frown, Meh, Search, Book, Zap } from "lucide-react";

interface ComponentProps {}

type Message = {
  text: string;
  sender: "user" | "ai";
};

type NLUAnalysis = {
  entities: string[];
  intent: string;
  sentiment: "positive" | "neutral" | "negative";
  context: string;
};

const SCENARIOS: string[] = [
  "I'm feeling hungry. What's a good pizza place nearby?",
  "Can you help me book a flight to New York next week?",
  "This movie is absolutely terrible! I want my money back.",
];

/**
 * NLUPlayground: An interactive component to teach Natural Language Understanding
 */
const NLUPlayground: React.FC<ComponentProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [analysis, setAnalysis] = useState<NLUAnalysis | null>(null);
  const [explanationMode, setExplanationMode] = useState<boolean>(false);
  const [challengeMode, setChallengeMode] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 0) {
        setMessages([{ text: "Hello! I'm an NLU-powered AI assistant. How can I help you?", sender: "ai" }]);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      analyzeMessage(input);
      setInput("");
    }
  };

  const analyzeMessage = (text: string) => {
    // Simulated NLU analysis
    const newAnalysis: NLUAnalysis = {
      entities: text.split(" ").filter(word => word.length > 4),
      intent: text.toLowerCase().includes("book") ? "booking" : "general_query",
      sentiment: text.toLowerCase().includes("terrible") ? "negative" : "positive",
      context: messages.length > 1 ? "follow-up" : "initial",
    };
    setAnalysis(newAnalysis);
  };

  const renderSentiment = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return <Smile className="text-green-500" />;
      case "negative":
        return <Frown className="text-red-500" />;
      default:
        return <Meh className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">NLU Playground</h1>
      <div className="mb-4 flex justify-between">
        <button
          onClick={() => setExplanationMode(!explanationMode)}
          className={`px-3 py-1 rounded ${explanationMode ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          Explanation Mode
        </button>
        <button
          onClick={() => setChallengeMode(!challengeMode)}
          className={`px-3 py-1 rounded ${challengeMode ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          Challenge Mode
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow mb-4 h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-100" : "bg-gray-200"}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border rounded-l"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
            <MessageSquare size={20} />
          </button>
        </div>
      </form>
      {challengeMode && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Challenge Scenarios:</h3>
          {SCENARIOS.map((scenario, index) => (
            <button
              key={index}
              onClick={() => setInput(scenario)}
              className="block w-full text-left p-2 mb-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {scenario}
            </button>
          ))}
        </div>
      )}
      {analysis && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold mb-2 flex items-center">
            <Brain className="mr-2" /> NLU Analysis
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold flex items-center">
                <Search className="mr-1" /> Entities
              </h3>
              <p>{analysis.entities.join(", ")}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center">
                <Zap className="mr-1" /> Intent
              </h3>
              <p>{analysis.intent}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center">
                {renderSentiment(analysis.sentiment)} Sentiment
              </h3>
              <p>{analysis.sentiment}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center">
                <Book className="mr-1" /> Context
              </h3>
              <p>{analysis.context}</p>
            </div>
          </div>
          {explanationMode && (
            <div className="mt-4 p-2 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">Explanation:</h3>
              <p>
                The NLU system analyzes your input by identifying key entities, determining the intent,
                assessing sentiment, and considering context from previous messages.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NLUPlayground;