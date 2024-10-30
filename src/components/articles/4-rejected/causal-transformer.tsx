"use client"
import { useState, useEffect } from "react";
import { Brain, ArrowRight, MessageSquare, AlertCircle, ChevronRight } from "lucide-react";

interface Word {
  text: string;
  influence: number;
  predictions: string[];
  confidence: number;
}

interface ComponentProps {}

const INITIAL_STORY = ["The", "cat", "sat", "on"];
const PREDICTIONS = {
  "The": ["big", "small", "cat", "dog"],
  "cat": ["sat", "ran", "jumped", "slept"],
  "sat": ["on", "under", "near", "beside"],
  "on": ["the", "a", "my", "their"]
};

const CausalTransformerDemo: React.FC<ComponentProps> = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (isAnimating && currentIndex < INITIAL_STORY.length) {
      const timer = setTimeout(() => {
        const newWord: Word = {
          text: INITIAL_STORY[currentIndex],
          influence: Math.min((currentIndex + 1) * 0.25, 1),
          predictions: PREDICTIONS[INITIAL_STORY[currentIndex] as keyof typeof PREDICTIONS],
          confidence: Math.min((currentIndex + 1) * 0.2, 0.8)
        };

        setWords(prev => [...prev, newWord]);
        setCurrentIndex(prev => prev + 1);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, isAnimating]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      const newWord: Word = {
        text: userInput.trim(),
        influence: Math.min((words.length + 1) * 0.25, 1),
        predictions: ["the", "a", "quickly", "slowly"],
        confidence: Math.min((words.length + 1) * 0.2, 0.8)
      };
      setWords(prev => [...prev, newWord]);
      setUserInput("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="text-blue-500" />
        <h2 className="text-2xl font-bold">Causal Transformer Story Predictor</h2>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-4" role="list">
          {words.map((word, idx) => (
            <div key={idx} className="relative" role="listitem">
              <div className={`p-3 bg-white rounded-lg shadow-md transition-all duration-300
                border-2 border-blue-${Math.round(word.influence * 500)}`}>
                <p className="font-medium">{word.text}</p>
                <div className="mt-2 h-1 bg-gray-200 rounded">
                  <div
                    className="h-full bg-green-500 rounded transition-all duration-300"
                    style={{ width: `${word.confidence * 100}%` }}
                    role="progressbar"
                    aria-valuenow={word.confidence * 100}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
              <div className="absolute top-full mt-2 flex gap-2">
                {word.predictions.map((pred, pidx) => (
                  <span key={pidx} className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {pred}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleInputSubmit} className="flex gap-2 mt-8">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="flex-1 p-2 border-2 border-gray-300 rounded"
            placeholder="Add your own word..."
            aria-label="Enter a word"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
              transition duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600">
            <AlertCircle className="w-5 h-5" />
            <p>Words can only influence predictions for future words, not past ones.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CausalTransformerDemo;