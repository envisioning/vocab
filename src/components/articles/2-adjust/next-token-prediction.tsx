"use client"
import { useState, useEffect } from "react";
import { Type, ArrowRight, Zap, BookOpen, MessageSquare, FileText } from "lucide-react";

interface ComponentProps {}

type ModelType = "casual" | "formal" | "scientific";
type Suggestion = { word: string; confidence: number };

const INITIAL_TEXT = "The quick brown";
const MODEL_SUGGESTIONS: Record<ModelType, Suggestion[]> = {
  casual: [
    { word: "fox", confidence: 0.8 },
    { word: "dog", confidence: 0.6 },
    { word: "cat", confidence: 0.4 },
  ],
  formal: [
    { word: "specimen", confidence: 0.7 },
    { word: "document", confidence: 0.5 },
    { word: "analysis", confidence: 0.3 },
  ],
  scientific: [
    { word: "hypothesis", confidence: 0.9 },
    { word: "experiment", confidence: 0.7 },
    { word: "theory", confidence: 0.5 },
  ],
};

/**
 * PredictiveTextPlayground: A component that demonstrates Next Token Prediction
 * through an interactive text input and suggestion system.
 */
const PredictiveTextPlayground: React.FC<ComponentProps> = () => {
  const [inputText, setInputText] = useState<string>(INITIAL_TEXT);
  const [modelType, setModelType] = useState<ModelType>("casual");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
      setSuggestions(MODEL_SUGGESTIONS[modelType]);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText, modelType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setIsTyping(true);
    setSuggestions([]);
  };

  const handleSuggestionClick = (word: string) => {
    setInputText((prev) => `${prev} ${word}`);
  };

  const handleModelChange = (newModel: ModelType) => {
    setModelType(newModel);
    setSuggestions(MODEL_SUGGESTIONS[newModel]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <Type className="mr-2" /> Next Token Prediction Playground
      </h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          aria-label="Enter your text"
        />
      </div>

      <div className="mb-4 flex space-x-2" role="radiogroup" aria-label="Select model type">
        {(["casual", "formal", "scientific"] as ModelType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleModelChange(type)}
            className={`px-3 py-1 rounded ${
              modelType === type ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            aria-pressed={modelType === type}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Zap className="mr-2" /> Suggestions
        </h3>
        {isTyping ? (
          <p className="text-gray-600">Thinking...</p>
        ) : (
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white p-2 rounded shadow"
              >
                <button
                  onClick={() => handleSuggestionClick(suggestion.word)}
                  className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                >
                  <ArrowRight className="inline mr-2" />
                  {suggestion.word}
                </button>
                <span className="text-sm text-gray-500">
                  Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 bg-gray-200 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <BookOpen className="mr-2" /> How it works
        </h3>
        <p className="text-sm text-gray-700">
          As you type, the AI predicts the next word based on the context and the selected model.
          Try different models to see how predictions change!
        </p>
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          onClick={() => setInputText(INITIAL_TEXT)}
        >
          <MessageSquare className="mr-2" /> Reset Text
        </button>
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => alert("Feature coming soon!")}
        >
          <FileText className="mr-2" /> Learn More
        </button>
      </div>
    </div>
  );
};

export default PredictiveTextPlayground;