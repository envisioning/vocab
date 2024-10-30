"use client"
import { useState, useEffect } from "react";
import { MessageSquare, Zap, Clock, Info } from "lucide-react";

interface ComponentProps {}

type PredictionType = "single" | "multi";

interface Message {
  text: string;
  type: PredictionType;
}

const INITIAL_PROMPTS = [
  "The quick brown",
  "In a world where",
  "Once upon a time",
  "The future of AI",
];

const SINGLE_TOKEN_PREDICTIONS = [
  " fox",
  " technology",
  " in",
  " is",
];

const MULTI_TOKEN_PREDICTIONS = [
  " fox jumps over the lazy dog",
  " technology shapes our every decision",
  " in a faraway kingdom, there lived",
  " is both exciting and challenging",
];

/**
 * MultiTokenPrediction component demonstrates the difference between
 * single-token and multi-token prediction in a chat-like interface.
 */
const MultiTokenPrediction: React.FC<ComponentProps> = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [isExplanationMode, setIsExplanationMode] = useState<boolean>(false);
  const [singleTokenSpeed, setSingleTokenSpeed] = useState<number>(0);
  const [multiTokenSpeed, setMultiTokenSpeed] = useState<number>(0);

  useEffect(() => {
    const promptIndex = Math.floor(Math.random() * INITIAL_PROMPTS.length);
    setCurrentPrompt(INITIAL_PROMPTS[promptIndex]);

    return () => {
      setCurrentPrompt("");
    };
  }, []);

  useEffect(() => {
    if (input === currentPrompt) {
      const singleTokenStart = performance.now();
      const multiTokenStart = performance.now();

      const singleTokenTimer = setTimeout(() => {
        addMessage(input + SINGLE_TOKEN_PREDICTIONS[INITIAL_PROMPTS.indexOf(currentPrompt)], "single");
        setSingleTokenSpeed(performance.now() - singleTokenStart);
      }, 1000);

      const multiTokenTimer = setTimeout(() => {
        addMessage(input + MULTI_TOKEN_PREDICTIONS[INITIAL_PROMPTS.indexOf(currentPrompt)], "multi");
        setMultiTokenSpeed(performance.now() - multiTokenStart);
      }, 500);

      return () => {
        clearTimeout(singleTokenTimer);
        clearTimeout(multiTokenTimer);
      };
    }
  }, [input, currentPrompt]);

  const addMessage = (text: string, type: PredictionType) => {
    setMessages((prev) => [...prev, { text, type }]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleExplanationToggle = () => {
    setIsExplanationMode((prev) => !prev);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Multi-Token Prediction Demo</h1>
      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <h2 className="text-lg font-semibold mb-2">Single-Token Prediction</h2>
          <div className="bg-white p-4 rounded-lg h-64 overflow-y-auto">
            {messages
              .filter((m) => m.type === "single")
              .map((m, i) => (
                <div key={i} className="mb-2">
                  <MessageSquare className="inline-block mr-2 text-blue-500" />
                  {m.text}
                </div>
              ))}
          </div>
          <div className="mt-2 flex items-center">
            <Clock className="mr-2 text-gray-500" />
            <span>Speed: {singleTokenSpeed.toFixed(2)} ms</span>
          </div>
        </div>
        <div className="w-1/2 pl-2">
          <h2 className="text-lg font-semibold mb-2">Multi-Token Prediction</h2>
          <div className="bg-white p-4 rounded-lg h-64 overflow-y-auto">
            {messages
              .filter((m) => m.type === "multi")
              .map((m, i) => (
                <div key={i} className="mb-2">
                  <MessageSquare className="inline-block mr-2 text-green-500" />
                  {m.text}
                </div>
              ))}
          </div>
          <div className="mt-2 flex items-center">
            <Zap className="mr-2 text-yellow-500" />
            <span>Speed: {multiTokenSpeed.toFixed(2)} ms</span>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={currentPrompt}
          className="w-full p-2 border rounded"
          aria-label="Type your message"
        />
      </div>
      <button
        onClick={handleExplanationToggle}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        aria-label="Toggle explanation mode"
      >
        <Info className="inline-block mr-2" />
        {isExplanationMode ? "Hide" : "Show"} Explanation
      </button>
      {isExplanationMode && (
        <div className="mt-4 p-4 bg-white rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How it works:</h3>
          <p>
            Single-token prediction generates one token at a time, while multi-token prediction
            generates multiple tokens simultaneously, resulting in faster and more coherent output.
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiTokenPrediction;