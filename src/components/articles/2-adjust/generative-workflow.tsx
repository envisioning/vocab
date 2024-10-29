"use client"
import { useState, useEffect } from "react";
import { Book, ChefHat, Palette, Zap, Lightbulb, RefreshCw } from "lucide-react";

interface ComponentProps {}

type TrainingData = "recipes" | "paintings" | "stories";
type GeneratedContent = string;

const TRAINING_DATA: Record<TrainingData, string[]> = {
  recipes: ["Spaghetti Carbonara", "Chicken Curry", "Apple Pie"],
  paintings: ["Starry Night", "Mona Lisa", "The Scream"],
  stories: ["Romeo and Juliet", "The Great Gatsby", "To Kill a Mockingbird"],
};

const PROMPTS: Record<TrainingData, string[]> = {
  recipes: ["Italian dessert", "Vegetarian main course", "Spicy appetizer"],
  paintings: ["Sunset landscape", "Abstract portrait", "Futuristic cityscape"],
  stories: ["Sci-fi adventure", "Romance in Paris", "Mystery in a small town"],
};

/**
 * GenerativeWorkflowLab: An interactive component to teach the concept of Generative Workflow.
 */
const GenerativeWorkflowLab: React.FC<ComponentProps> = () => {
  const [selectedData, setSelectedData] = useState<TrainingData>("recipes");
  const [learningProgress, setLearningProgress] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>("");
  const [isExplanationVisible, setIsExplanationVisible] = useState<boolean>(false);

  useEffect(() => {
    const learningInterval = setInterval(() => {
      setLearningProgress((prev) => (prev < 100 ? prev + 10 : 0));
    }, 500);

    return () => clearInterval(learningInterval);
  }, []);

  useEffect(() => {
    setPrompt(PROMPTS[selectedData][0]);
  }, [selectedData]);

  const handleDataSelection = (data: TrainingData) => {
    setSelectedData(data);
    setLearningProgress(0);
    setGeneratedContent("");
  };

  const handleGenerate = () => {
    const randomIndex = Math.floor(Math.random() * TRAINING_DATA[selectedData].length);
    setGeneratedContent(`Generated ${selectedData}: ${TRAINING_DATA[selectedData][randomIndex]}`);
  };

  const getIcon = (data: TrainingData) => {
    switch (data) {
      case "recipes":
        return <ChefHat className="w-6 h-6" />;
      case "paintings":
        return <Palette className="w-6 h-6" />;
      case "stories":
        return <Book className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Generative Workflow Lab</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Select Training Data</h2>
        <div className="flex space-x-4">
          {Object.keys(TRAINING_DATA).map((data) => (
            <button
              key={data}
              onClick={() => handleDataSelection(data as TrainingData)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition duration-300 ${
                selectedData === data ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              aria-pressed={selectedData === data}
            >
              {getIcon(data as TrainingData)}
              <span>{data.charAt(0).toUpperCase() + data.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Learning Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${learningProgress}%` }}
            role="progressbar"
            aria-valuenow={learningProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Input Prompt</h2>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Input prompt"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Generate Content</h2>
        <button
          onClick={handleGenerate}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          <Zap className="w-5 h-5 inline-block mr-2" />
          Generate
        </button>
        {generatedContent && (
          <p className="mt-4 p-4 bg-white rounded-md shadow">{generatedContent}</p>
        )}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setIsExplanationVisible(!isExplanationVisible)}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition duration-300"
        >
          <Lightbulb className="w-5 h-5" />
          <span>{isExplanationVisible ? "Hide" : "Show"} Explanation</span>
        </button>
        <button
          onClick={() => {
            setSelectedData("recipes");
            setLearningProgress(0);
            setPrompt("");
            setGeneratedContent("");
          }}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-600 transition duration-300"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>

      {isExplanationVisible && (
        <div className="mt-4 p-4 bg-blue-100 rounded-md">
          <p>
            Generative Workflow: AI learns patterns from training data, then uses those patterns to
            generate new content based on input prompts.
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerativeWorkflowLab;