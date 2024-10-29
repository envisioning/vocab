"use client"
import { useState, useEffect } from "react";
import { Brain, Cloud, MessageSquare, ArrowRight, RefreshCw } from "lucide-react";

interface ComponentProps {}

type StoryPart = {
  input: string;
  prediction: string;
};

const INITIAL_STORY: StoryPart[] = [
  { input: "Once upon a time", prediction: "in a far-off land" },
  { input: "there was a brave knight", prediction: "who sought adventure" },
];

/**
 * RNNStoryGenerator: An interactive component to teach RNN concepts
 * through storytelling.
 */
const RNNStoryGenerator: React.FC<ComponentProps> = () => {
  const [story, setStory] = useState<StoryPart[]>(INITIAL_STORY);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    let animationTimer: number;
    if (isAnimating) {
      animationTimer = window.setTimeout(() => {
        if (story.length < INITIAL_STORY.length) {
          setStory((prevStory) => [...prevStory, INITIAL_STORY[prevStory.length]]);
        } else {
          setIsAnimating(false);
        }
      }, 2000);
    }
    return () => {
      window.clearTimeout(animationTimer);
    };
  }, [isAnimating, story]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleAddStoryPart = () => {
    if (currentInput.trim()) {
      const newPrediction = generatePrediction(currentInput, story);
      setStory([...story, { input: currentInput, prediction: newPrediction }]);
      setCurrentInput("");
    }
  };

  const handleReset = () => {
    setStory(INITIAL_STORY);
    setCurrentInput("");
    setIsAnimating(true);
  };

  const generatePrediction = (input: string, prevStory: StoryPart[]): string => {
    const keywords = prevStory.flatMap(part => part.input.split(" "));
    const lastWord = input.split(" ").pop() || "";
    const predictionWords = keywords.filter(word => word.startsWith(lastWord[0]));
    return predictionWords[Math.floor(Math.random() * predictionWords.length)] || "...";
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">RNN Story Generator</h1>
      <div className="mb-4 p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Story So Far:</h2>
        {story.map((part, index) => (
          <div key={index} className="mb-2 flex items-center">
            <MessageSquare className="mr-2 text-blue-500" />
            <span>{part.input}</span>
          </div>
        ))}
      </div>
      <div className="mb-4 p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">RNN Memory Cloud:</h2>
        <div className="flex flex-wrap gap-2">
          {story.flatMap(part => part.input.split(" ")).map((word, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {word}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          placeholder="Continue the story..."
          className="w-full p-2 border rounded"
          aria-label="Enter the next part of the story"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddStoryPart}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          aria-label="Add to story"
        >
          <div className="flex items-center">
            <span>Add to Story</span>
            <ArrowRight className="ml-2" />
          </div>
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-300"
          aria-label="Reset story"
        >
          <div className="flex items-center">
            <RefreshCw className="mr-2" />
            <span>Reset</span>
          </div>
        </button>
      </div>
      {story.length > 0 && (
        <div className="p-4 bg-green-100 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <Brain className="mr-2 text-green-500" />
            RNN Prediction:
          </h2>
          <p>{story[story.length - 1].prediction}</p>
        </div>
      )}
    </div>
  );
};

export default RNNStoryGenerator;