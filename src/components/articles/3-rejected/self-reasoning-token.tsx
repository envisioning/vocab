"use client"
import { useState, useEffect } from "react";
import { BookOpen, Lightbulb, ArrowRight, RotateCcw } from "lucide-react";

interface StoryNode {
  id: number;
  content: string;
  choices: string[];
}

interface ComponentProps {}

/**
 * AIStorytellerSimulator: A component that demonstrates Self-Reasoning Tokens
 * through an interactive storytelling experience.
 */
const AIStorytellerSimulator: React.FC<ComponentProps> = () => {
  const [currentNode, setCurrentNode] = useState<number>(0);
  const [narration, setNarration] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  const storyOutline: StoryNode[] = [
    {
      id: 0,
      content: "A mysterious package arrives",
      choices: ["Open it", "Leave it unopened"],
    },
    {
      id: 1,
      content: "Inside is a glowing orb",
      choices: ["Touch the orb", "Research its origin"],
    },
    {
      id: 2,
      content: "The orb grants a wish",
      choices: ["Wish for wealth", "Wish for knowledge"],
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      timer = setTimeout(() => {
        if (currentNode < storyOutline.length - 1) {
          setCurrentNode((prev) => prev + 1);
        } else {
          setIsAnimating(false);
        }
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [currentNode, isAnimating]);

  useEffect(() => {
    setNarration(storyOutline[currentNode].content);
  }, [currentNode]);

  const handleChoice = (choice: string) => {
    setIsAnimating(false);
    setNarration(`You chose to ${choice.toLowerCase()}. ${storyOutline[currentNode + 1]?.content}`);
    if (currentNode < storyOutline.length - 1) {
      setCurrentNode((prev) => prev + 1);
    }
  };

  const resetSimulation = () => {
    setCurrentNode(0);
    setNarration("");
    setIsAnimating(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">AI Storyteller Simulator</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <BookOpen className="mr-2" /> Story Outline (Self-Reasoning Tokens)
        </h2>
        <div className="flex justify-between items-center">
          {storyOutline.map((node, index) => (
            <div
              key={node.id}
              className={`flex items-center ${
                index === currentNode ? "text-blue-500 font-bold" : "text-gray-500"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                {index + 1}
              </div>
              {index < storyOutline.length - 1 && <ArrowRight className="mx-2" />}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <Lightbulb className="mr-2" /> Current Narration
        </h2>
        <p className="bg-white p-4 rounded shadow">{narration}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Future Possibilities</h2>
        <div className="flex justify-around">
          {storyOutline[currentNode].choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-300"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={resetSimulation}
        className="flex items-center justify-center w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-300"
      >
        <RotateCcw className="mr-2" /> Reset Simulation
      </button>
    </div>
  );
};

export default AIStorytellerSimulator;